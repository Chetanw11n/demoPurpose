import React, { useEffect, useState } from 'react'
import { getRouteId } from '../../../utils/routeUtils'
 
const SCHEDULE_STATUS_OPTIONS = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'COMPLETED', label: 'Completed' }
]
 
const ScheduleForm = ({ routes, onSave, scheduleToEdit, onCancel, initialRouteId }) => {
    const [schedule, setSchedule] = useState({
        routeId: initialRouteId || '',
        date: '',
        time: '',
        status: 'SCHEDULED'
    })
 
    useEffect(() => {
        if (scheduleToEdit) {
            setSchedule({
                routeId: scheduleToEdit.routeId || initialRouteId || '',
                date: scheduleToEdit.date || '',
                time: scheduleToEdit.time || '',
                status: scheduleToEdit.status || 'SCHEDULED'
            })
        }
    }, [scheduleToEdit, initialRouteId])
 
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!schedule.routeId) {
            alert("Please select a route first!")
            return
        }
        onSave(schedule)
    }
 
    return (
        <div className="p-4">
            <h5 className="mb-4 fw-bold">{scheduleToEdit ? 'Edit Schedule' : 'Add New Schedule'}</h5>
           
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Select Route</label>
                    <select
                        className="form-select"
                        value={schedule.routeId}
                        onChange={(e) => setSchedule({...schedule, routeId: e.target.value})}
                        required
                    >
                        <option value="">-- Choose a Route --</option>
                        {routes.map(r => (
                            <option key={getRouteId(r)} value={getRouteId(r)}>
                                {r.title} ({r.startPoint} → {r.endPoint})
                            </option>
                        ))}
                    </select>
                </div>
 
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold small">Date</label>
                        <input type="date" className="form-control" value={schedule.date} onChange={(e) => setSchedule({...schedule, date: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold small">Time</label>
                        <input type="time" className="form-control" value={schedule.time} onChange={(e) => setSchedule({...schedule, time: e.target.value})} required />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label fw-bold small">Status</label>
                        <select className="form-select" value={schedule.status} onChange={(e) => setSchedule({...schedule, status: e.target.value})}>
                            {SCHEDULE_STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
 
                <div className="mt-4 d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-success px-4">Save Schedule</button>
                </div>
            </form>
        </div>
    )
}
 
export default ScheduleForm