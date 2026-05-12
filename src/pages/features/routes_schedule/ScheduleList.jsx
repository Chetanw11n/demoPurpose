import React from 'react'
import { getRouteId, normalizeId } from '../../../utils/routeUtils'
 
const SCHEDULE_STATUS_COLORS = {
    SCHEDULED: 'primary',
    CANCELLED: 'danger',
    COMPLETED: 'success'
}
 
const SCHEDULE_STATUS_LABELS = {
    SCHEDULED: 'Scheduled',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed'
}
 
const ScheduleList = ({ route, schedules, onEdit, onDelete }) => {
    const routeKey = getRouteId(route)
    const routeSchedules = schedules.filter(
        schedule => normalizeId(schedule.routeId ?? schedule.routeID) === routeKey
    )
 
    const formatTime = (timeString) => {
        if (!timeString) return 'N/A'
        // If it's in HH:mm:ss format, keep as is; if in other format, try to parse
        return timeString.substring(0, 5) // Get HH:mm
    }
 
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        } catch (e) {
            return dateString
        }
    }
 
    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light">
                <h5 className="mb-0">
                    Schedules for {route ? route.title : 'selected route'}
                </h5>
            </div>
            <div className="card-body table-responsive">
                {route ? (
                    <>
                        {routeSchedules.length === 0 ? (
                            <div className="alert alert-info mb-0">
                                No schedules have been created for this route yet.
                            </div>
                        ) : (
                            <table className="table table-striped table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Schedule ID</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {routeSchedules.map(schedule => (
                                        <tr key={schedule.scheduleId ?? schedule.id}>
                                            <td>{schedule.scheduleId ?? schedule.id}</td>
                                            <td>{formatDate(schedule.date)}</td>
                                            <td>{formatTime(schedule.time)}</td>
                                            <td>
                                                <span
                                                    className={`badge bg-${
                                                        SCHEDULE_STATUS_COLORS[schedule.status] || 'secondary'
                                                    }`}
                                                >
                                                    {SCHEDULE_STATUS_LABELS[schedule.status] || schedule.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-warning me-2"
                                                    onClick={() => onEdit(schedule)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => onDelete(schedule.scheduleId ?? schedule.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                ) : (
                    <div className="alert alert-info mb-0">
                        Select a route to see and manage its schedules.
                    </div>
                )}
            </div>
        </div>
    )
}
 
export default ScheduleList
 