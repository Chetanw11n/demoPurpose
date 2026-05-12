import React, { useEffect, useMemo, useState } from 'react'
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
import ViewRoute from './ViewRoute'
import DeleteRouteDialog from './DeleteRouteDialog'
import ScheduleForm from './ScheduleForm'
import ScheduleList from './ScheduleList'
import { getRouteId, normalizeId } from '../../../utils/routeUtils'

const RouteScheduleDashboard = () => {
    const [routes, setRoutes] = useState([])
    const [schedules, setSchedules] = useState([])
    const [selectedRouteID, setSelectedRouteID] = useState(null)
    const [editingRoute, setEditingRoute] = useState(null)
    const [editingSchedule, setEditingSchedule] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Route management states
    const [currentView, setCurrentView] = useState('list') // 'list', 'create', 'edit', 'view'
    const [routeToDelete, setRouteToDelete] = useState(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const fetchRoutes = async () => {
        try {
            setLoading(true)
            const response = await getRoutes()
            const routesData = response.data.data || response.data || []
            setRoutes(Array.isArray(routesData) ? routesData : [])
            setError(null)
        } catch (err) {
            console.error('❌ Error fetching routes:', err.message)
            setError('Failed to fetch routes')
            toast.error('Failed to fetch routes')
            setRoutes([])
        } finally {
            setLoading(false)
        }
    }

    const fetchSchedulesByRouteId = async (routeID) => {
        try {
            const response = await getSchedulesByRouteId(routeID)
            const schedulesData = response.data.data || response.data || []
            setSchedules(Array.isArray(schedulesData) ? schedulesData : [])
        } catch (err) {
            console.error('❌ Error fetching schedules for route:', routeID, err.message)
            toast.error('Failed to fetch schedules')
            setSchedules([])
        }
    }

    useEffect(() => {
        fetchRoutes()
    }, [])

    useEffect(() => {
        if (selectedRouteID) {
            fetchSchedulesByRouteId(selectedRouteID)
        } else {
            setSchedules([])
        }
    }, [selectedRouteID])

    const handleSaveRoute = async (route) => {
        try {
            if (editingRoute) {
                // Update existing route
                const routeId = getRouteId(editingRoute)
                console.log('📝 Updating route:', { id: routeId, route })
                
                // Send only the fields that should be updated, not the entire object
                const updatePayload = {
                    title: route.title,
                    type: route.type,
                    startPoint: route.startPoint,
                    endPoint: route.endPoint,
                    status: route.status
                }
                
                await updateRoute(routeId, updatePayload)
                
                // Update the local state with the new route data
                setRoutes(prev => prev.map(item => 
                    getRouteId(item) === routeId ? { ...item, ...updatePayload } : item
                ))
                
                toast.success('Route updated successfully.')
            } else {
                // Create new route
                console.log('✅ Creating new route:', route)
                const response = await createRoute(route)
                const newRoute = response.data.data || response.data || route
                setRoutes(prev => [newRoute, ...prev])
                toast.success('Route created successfully.')
            }
            
            setEditingRoute(null)
            setCurrentView('list')
        } catch (err) {
            console.error('❌ Error saving route:', err.message)
            toast.error(err.response?.data?.message || 'Failed to save route.')
        }
    }

    const handleAddRoute = () => {
        setEditingRoute(null)
        setEditingSchedule(null)
        setCurrentView('create')
    }

    const handleEditRoute = (route) => {
        setEditingRoute(route)
        setEditingSchedule(null)
        setCurrentView('edit')
    }

    const handleViewRoute = (route) => {
        setEditingRoute(route)
        setCurrentView('view')
    }

    const handleDeleteRoute = (routeID) => {
        const route = routes.find(r => getRouteId(r) === routeID)
        setRouteToDelete(route)
        setShowDeleteDialog(true)
    }

    const confirmDeleteRoute = async (routeID) => {
        try {
            const normalizedId = normalizeId(routeID)
            console.log('🗑️ Deleting route:', normalizedId)

            await deleteRoute(normalizedId)
            setRoutes(prev => prev.filter(route => getRouteId(route) !== normalizedId))
            setSchedules(prev => prev.filter(schedule => normalizeId(schedule.routeID ?? schedule.routeId) !== normalizedId))

            if (selectedRouteID === normalizedId) {
                setSelectedRouteID(null)
                setEditingSchedule(null)
            }

            setShowDeleteDialog(false)
            setRouteToDelete(null)
            setCurrentView('list')
            toast.info('Route removed. Associated schedules were also removed.')
        } catch (err) {
            console.error('❌ Error deleting route:', { routeID, error: err.message })
            toast.error('Failed to delete route')
        }
    }

    const cancelDeleteRoute = () => {
        setShowDeleteDialog(false)
        setRouteToDelete(null)
    }

    const handleSaveSchedule = async (schedule) => {
        try {
            if (editingSchedule) {
                console.log('📝 Updating schedule:', schedule)
                await updateSchedule(schedule.scheduleID, schedule)
                setSchedules(prev => prev.map(item => (item.scheduleID === schedule.scheduleID ? schedule : item)))
                toast.success('Schedule updated successfully.')
            } else {
                const routeKey = normalizeId(schedule.routeID ?? schedule.routeId)
                console.log('✅ Creating schedule for route:', routeKey)
                const response = await createSchedule(routeKey, schedule)
                const createdSchedule = response.data.data || response.data || schedule
                setSchedules(prev => [createdSchedule, ...prev])
                toast.success('Schedule created successfully.')
            }
            setEditingSchedule(null)
        } catch (err) {
            console.error('❌ Error saving schedule:', { schedule, error: err.message })
            toast.error('Failed to save schedule')
        }
    }

    const handleEditSchedule = (schedule) => {
        setEditingSchedule(schedule)
    }

    const handleDeleteSchedule = async (scheduleID) => {
        try {
            console.log('🗑️ Deleting schedule:', scheduleID)
            await deleteSchedule(scheduleID)
            setSchedules(prev => prev.filter(schedule => normalizeId(schedule.scheduleID ?? schedule.id) !== normalizeId(scheduleID)))
            
            if (normalizeId(editingSchedule?.scheduleID ?? editingSchedule?.id) === normalizeId(scheduleID)) {
                setEditingSchedule(null)
            }
            toast.info('Schedule deleted successfully.')
        } catch (err) {
            console.error('❌ Error deleting schedule:', { scheduleID, error: err.message })
            toast.error('Failed to delete schedule')
        }
    }

    const selectedRoute = useMemo(
        () => routes.find(route => normalizeId(route.routeID ?? route.id) === normalizeId(selectedRouteID)) ?? null,
        [routes, selectedRouteID]
    )

    if (loading) {
        return (
            <div className="container py-4">
                <div className="alert alert-info">Loading routes and schedules...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger">{error}</div>
            </div>
        )
    }

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h1 className="mb-1">Route & Schedule Management</h1>
                <p className="text-muted">Manage transport routes, configure schedule timings, and track availability across buses, metros, and trains.</p>
            </div>

            {/* Route Management Section */}
            {currentView === 'create' && (
                <CreateRouteForm
                    onSave={handleSaveRoute}
                    onCancel={() => setCurrentView('list')}
                />
            )}

            {currentView === 'edit' && (
                <EditRouteForm
                    route={editingRoute}
                    onSave={handleSaveRoute}
                    onCancel={() => setCurrentView('list')}
                />
            )}

            {currentView === 'view' && (
                <ViewRoute
                    route={editingRoute}
                    onEdit={handleEditRoute}
                    onDelete={handleDeleteRoute}
                    onClose={() => setCurrentView('list')}
                />
            )}

            {currentView === 'list' && (
                <RouteList
                    routes={routes}
                    selectedRouteID={selectedRouteID}
                    onEdit={handleEditRoute}
                    onDelete={handleDeleteRoute}
                    onSelect={setSelectedRouteID}
                    onAdd={handleAddRoute}
                    onView={handleViewRoute}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteRouteDialog
                route={routeToDelete}
                isOpen={showDeleteDialog}
                onConfirm={confirmDeleteRoute}
                onCancel={cancelDeleteRoute}
            />

            {/* Schedule Management Section */}
            <div className="row">
                <div className="col-lg-5">
                    <ScheduleForm
                        route={selectedRoute}
                        onSave={handleSaveSchedule}
                        scheduleToEdit={editingSchedule}
                        onCancel={() => setEditingSchedule(null)}
                    />
                </div>
                <div className="col-lg-7">
                    <ScheduleList
                        route={selectedRoute}
                        schedules={schedules}
                        onEdit={handleEditSchedule}
                        onDelete={handleDeleteSchedule}
                    />
                </div>
            </div>
        </div>
    )
}

export default RouteScheduleDashboard