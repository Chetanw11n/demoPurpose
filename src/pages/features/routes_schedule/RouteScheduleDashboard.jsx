import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
    getRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
    getSchedulesByRouteId,
    createSchedule,
    updateSchedule,
    deleteSchedule
} from '../../../axios/route_schedule_api'
import RouteList from './RouteList'
import CreateRouteForm from './CreateRouteForm'
import EditRouteForm from './EditRouteForm'
import DeleteRouteDialog from './DeleteRouteDialog'
import ScheduleForm from './ScheduleForm'
import ScheduleList from './ScheduleList'
import { getRouteId, normalizeId } from '../../../utils/routeUtils'

const RouteScheduleDashboard = () => {
    const [routes, setRoutes] = useState([])
    const [schedules, setSchedules] = useState([])
    
    // PERSISTENCE: Initialize from localStorage so selection survives refresh
    const [selectedRouteID, setSelectedRouteID] = useState(() => {
        return localStorage.getItem('lastSelectedRouteId') || null;
    })
    
    const [editingRoute, setEditingRoute] = useState(null)
    const [editingSchedule, setEditingSchedule] = useState(null)
    const [loading, setLoading] = useState(true)

    const [currentView, setCurrentView] = useState('list')
    const [showSchedulePopUp, setShowSchedulePopUp] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [routeToDelete, setRouteToDelete] = useState(null)

    const fetchRoutes = async () => {
        try {
            setLoading(true)
            const response = await getRoutes()
            const routesData = response.data.data || response.data || []
            setRoutes(Array.isArray(routesData) ? routesData : [])
        } catch (err) {
            toast.error('Failed to fetch routes')
        } finally {
            setLoading(false)
        }
    }

    const fetchSchedules = async (routeID) => {
        if (!routeID) return;
        try {
            const response = await getSchedulesByRouteId(normalizeId(routeID))
            const data = response.data.data || response.data || []
            setSchedules(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Fetch schedule error:", err)
            setSchedules([])
        }
    }

    // Load initial routes
    useEffect(() => { 
        fetchRoutes() 
    }, [])

    // Whenever selectedRouteID changes (including on refresh), fetch schedules
    useEffect(() => {
        if (selectedRouteID) {
            fetchSchedules(selectedRouteID);
            localStorage.setItem('lastSelectedRouteId', selectedRouteID);
        } else {
            localStorage.removeItem('lastSelectedRouteId');
        }
    }, [selectedRouteID])

    const handleSaveRoute = async (routeData) => {
        try {
            if (editingRoute) {
                await updateRoute(getRouteId(editingRoute), routeData)
                toast.success('Route updated.')
            } else {
                await createRoute(routeData)
                toast.success('Route created.')
            }
            await fetchRoutes()
            setCurrentView('list')
        } catch (err) {
            toast.error('Error saving route')
        }
    }

    const handleSaveSchedule = async (scheduleData) => {
        try {
            const targetRouteId = normalizeId(scheduleData.routeId);
            
            if (editingSchedule) {
                const sId = editingSchedule.scheduleId || editingSchedule.id
                await updateSchedule(sId, scheduleData)
                toast.success('Schedule updated!')
            } else {
                await createSchedule(targetRouteId, scheduleData)
                toast.success('Schedule created!')
            }
            
            // Re-fetch schedules immediately to ensure UI is in sync
            await fetchSchedules(targetRouteId)
            setSelectedRouteID(targetRouteId)
            
            setShowSchedulePopUp(false)
            setEditingSchedule(null)
        } catch (err) {
            toast.error('Error saving schedule')
        }
    }

    // Helper to find the current selected route object
    const currentSelectedRoute = routes.find(r => normalizeId(getRouteId(r)) === normalizeId(selectedRouteID));

    return (
        <div className="container py-4">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h1 className="fw-bold text-dark">Govt Transport Management</h1>
            </div>

            {currentView === 'create' && <CreateRouteForm onSave={handleSaveRoute} onCancel={() => setCurrentView('list')} />}
            {currentView === 'edit' && <EditRouteForm route={editingRoute} onSave={handleSaveRoute} onCancel={() => setCurrentView('list')} />}

            {currentView === 'list' && (
                <RouteList
                    routes={routes}
                    selectedRouteID={selectedRouteID}
                    onAdd={() => setCurrentView('create')}
                    onAddSchedule={() => {
                        setEditingSchedule(null)
                        setShowSchedulePopUp(true)
                    }}
                    onEdit={(r) => { setEditingRoute(r); setCurrentView('edit'); }}
                    onDelete={(id) => {
                        setRouteToDelete(routes.find(r => getRouteId(r) === id));
                        setShowDeleteDialog(true);
                    }}
                    onSelect={setSelectedRouteID}
                />
            )}

            {showSchedulePopUp && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <ScheduleForm
                                routes={routes}
                                onSave={handleSaveSchedule}
                                scheduleToEdit={editingSchedule}
                                initialRouteId={selectedRouteID}
                                onCancel={() => { setShowSchedulePopUp(false); setEditingSchedule(null); }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-5">
                <ScheduleList
                    route={currentSelectedRoute}
                    schedules={schedules}
                    onEdit={(s) => { setEditingSchedule(s); setShowSchedulePopUp(true); }}
                    onDelete={async (id) => { 
                        await deleteSchedule(id); 
                        fetchSchedules(selectedRouteID); 
                        toast.info("Schedule deleted");
                    }}
                />
            </div>

            <DeleteRouteDialog
                route={routeToDelete}
                isOpen={showDeleteDialog}
                onConfirm={async (id) => { 
                    await deleteRoute(id); 
                    if(selectedRouteID === id) setSelectedRouteID(null);
                    fetchRoutes(); 
                    setShowDeleteDialog(false); 
                }}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </div>
    )
}

export default RouteScheduleDashboard