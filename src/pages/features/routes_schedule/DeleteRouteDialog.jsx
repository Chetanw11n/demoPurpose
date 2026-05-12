import React from 'react'
import { getRouteId } from '../../../utils/routeUtils'
 
const DeleteRouteDialog = ({ route, isOpen, onConfirm, onCancel }) => {
    if (!isOpen || !route) return null
 
    const routeId = getRouteId(route)
 
    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-danger text-white">
                        <h5 className="modal-title">Delete Route</h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onCancel}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="alert alert-danger">
                            <strong>Warning!</strong> This action cannot be undone.
                        </div>
                        <p>Are you sure you want to delete the following route?</p>
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title">{route.title}</h6>
                                <p className="card-text mb-1">
                                    <strong>ID:</strong> {routeId}
                                </p>
                                <p className="card-text mb-1">
                                    <strong>Type:</strong> {route.type}
                                </p>
                                <p className="card-text mb-1">
                                    <strong>Route:</strong> {route.startPoint} → {route.endPoint}
                                </p>
                                <p className="card-text mb-0">
                                    <strong>Status:</strong> {route.status}
                                </p>
                            </div>
                        </div>
                        <p className="mt-3 text-muted">
                            <small>All associated schedules will also be deleted.</small>
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => onConfirm(routeId)}
                        >
                            Delete Route
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default DeleteRouteDialog