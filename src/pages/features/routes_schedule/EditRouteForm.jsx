import React, { useEffect, useState } from 'react'
import { ROUTE_STATUS, STATUS_LABELS, STATUS_OPTIONS } from '../../../utils/statusConstants'
 
const ROUTE_TYPES = ['Bus', 'Metro', 'Train']
 
const EditRouteForm = ({ route, onSave, onCancel }) => {
    const [editedRoute, setEditedRoute] = useState({
        title: '',
        type: 'Bus',
        startPoint: '',
        endPoint: '',
        fares:0,
        status: ROUTE_STATUS.DRAFT
    })
 
    useEffect(() => {
        if (route) {
            setEditedRoute(route)
        }
    }, [route])
 
    const handleChange = (e) => {
        const { name, value } = e.target
        setEditedRoute(prev => ({ ...prev, [name]: value }))
    }
 
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!editedRoute.title || !editedRoute.startPoint || !editedRoute.endPoint) return
 
        onSave(editedRoute)
    }
 
    if (!route) {
        return (
            <div className="alert alert-warning">
                No route selected for editing.
            </div>
        )
    }
 
    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light">
                <h5 className="mb-0">Edit Route</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Route Title</label>
                            <input
                                type="text"
                                name="title"
                                value={editedRoute.title}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="e.g. Downtown Circular"
                                required
                            />
                        </div>
 
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Transport Type</label>
                            <select
                                name="type"
                                value={editedRoute.type}
                                onChange={handleChange}
                                className="form-select"
                            >
                                {ROUTE_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
 
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Start Point</label>
                            <input
                                type="text"
                                name="startPoint"
                                value={editedRoute.startPoint}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
 
                        <div className="col-md-6">
                            <label className="form-label fw-bold">End Point</label>
                            <input
                                type="text"
                                name="endPoint"
                                value={editedRoute.endPoint}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
 
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Status</label>
                            <select
                                name="status"
                                value={editedRoute.status}
                                onChange={handleChange}
                                className="form-select"
                            >
                                {STATUS_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                         <div className="col-md-6">
                            <label className="form-label fw-bold">Fare</label>
                            <input
                                type="number"
                                name="fares"
                                value={editedRoute.fares}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        
                    </div>
 
                    <div className="mt-4 d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
 
export default EditRouteForm