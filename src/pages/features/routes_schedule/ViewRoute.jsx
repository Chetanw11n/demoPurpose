import React from 'react'
import { STATUS_COLORS, STATUS_LABELS } from '../../../utils/statusConstants'
import { getRouteId } from '../../../utils/routeUtils'

const ViewRoute = ({ route, onEdit, onDelete, onClose }) => {
    if (!route) return <div className="alert alert-info">No route selected.</div>

    const routeId = getRouteId(route)

    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Route Details</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="card-body">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-muted">Route ID</label>
                        <p className="mb-0 fs-5">{routeId}</p>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-muted">Status</label>
                        <p className="mb-0">
                            <span className={`badge bg-${STATUS_COLORS[route.status] || 'secondary'} fs-6`}>
                                {STATUS_LABELS[route.status] || route.status}
                            </span>
                        </p>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-muted">Route Title</label>
                        <p className="mb-0 fs-5">{route.title}</p>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-muted">Fare</label>
                        <p className="mb-0 fs-5 text-success fw-bold">₹{route.fares || 0}</p>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-muted">Transport Type</label>
                        <p className="mb-0 fs-5">{route.type}</p>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-muted">Start Point</label>
                        <p className="mb-0 fs-5">{route.startPoint}</p>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-muted">End Point</label>
                        <p className="mb-0 fs-5">{route.endPoint}</p>
                    </div>
                </div>

                <div className="mt-4 d-flex gap-2">
                    <button className="btn btn-primary" onClick={() => onEdit(route)}>Edit Route</button>
                    <button className="btn btn-danger" onClick={() => onDelete(routeId)}>Delete Route</button>
                    <button className="btn btn-outline-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default ViewRoute