import React from 'react'
import { STATUS_COLORS, STATUS_LABELS } from '../../../utils/statusConstants'
import { getRouteId } from '../../../utils/routeUtils'
 
const RouteList = ({ routes, onEdit, onDelete, onAdd, onAddSchedule, onSelect, selectedRouteID }) => {
    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center bg-white py-3">
                <h5 className="mb-0 fw-bold">Routes</h5>
                <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm" onClick={onAddSchedule}>+ Add Schedule</button>
                    <button className="btn btn-primary btn-sm" onClick={onAdd}>+ Add New Route</button>
                </div>
            </div>
            <div className="card-body table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Route</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.map(route => {
                            const isSelected = getRouteId(route) === selectedRouteID;
                            return (
                                <tr
                                    key={getRouteId(route)}
                                    onClick={() => onSelect(getRouteId(route))}
                                    style={{ cursor: 'pointer' }}
                                    className={isSelected ? 'table-primary' : ''}
                                >
                                    <td>{getRouteId(route)}</td>
                                    <td className="fw-bold">{route.title}</td>
                                    <td>{route.type}</td>
                                    <td>{route.startPoint} → {route.endPoint}</td>
                                    <td>
                                        <span className={`badge bg-${STATUS_COLORS[route.status] || 'secondary'}`}>
                                            {STATUS_LABELS[route.status] || route.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-warning me-2" onClick={(e) => { e.stopPropagation(); onEdit(route); }}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); onDelete(getRouteId(route)); }}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
 
export default RouteList