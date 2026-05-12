import React, { useEffect, useState } from 'react'
import { ROUTE_STATUS, STATUS_LABELS, STATUS_OPTIONS } from '../../../utils/statusConstants'
import { toast } from 'react-toastify'

const ROUTE_TYPES = ['Bus', 'Metro', 'Train']

const EditRouteForm = ({ route, onSave, onCancel }) => {
    const [editedRoute, setEditedRoute] = useState({
        title: '',
        type: 'Bus',
        startPoint: '',
        endPoint: '',
        status: ROUTE_STATUS.DRAFT
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (route) {
            setEditedRoute({
                title: route.title || '',
                type: route.type || 'Bus',
                startPoint: route.startPoint || '',
                endPoint: route.endPoint || '',
                status: route.status || ROUTE_STATUS.DRAFT
            })
            setErrors({})
        }
    }, [route])

    const validateForm = () => {
        const newErrors = {}

        if (!editedRoute.title || editedRoute.title.trim() === '') {
            newErrors.title = 'Route title is required'
        }

        if (!editedRoute.type) {
            newErrors.type = 'Route type is required'
        }

        if (!editedRoute.startPoint || editedRoute.startPoint.trim() === '') {
            newErrors.startPoint = 'Start point is required'
        }

        if (!editedRoute.endPoint || editedRoute.endPoint.trim() === '') {
            newErrors.endPoint = 'End point is required'
        }

        if (editedRoute.startPoint === editedRoute.endPoint) {
            newErrors.endPoint = 'Start and end points must be different'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditedRoute(prev => ({ ...prev, [name]: value }))
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

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
                {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger mb-3">
                        <strong>Please fix the following errors:</strong>
                        <ul className="mb-0 mt-2">
                            {Object.values(errors).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Route Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={editedRoute.title}
                                onChange={handleChange}
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                placeholder="e.g. Downtown Circular"
                                required
                            />
                            {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Transport Type *</label>
                            <select
                                name="type"
                                value={editedRoute.type}
                                onChange={handleChange}
                                className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                                required
                            >
                                {ROUTE_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.type && <div className="invalid-feedback d-block">{errors.type}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Start Point *</label>
                            <input
                                type="text"
                                name="startPoint"
                                value={editedRoute.startPoint}
                                onChange={handleChange}
                                className={`form-control ${errors.startPoint ? 'is-invalid' : ''}`}
                                placeholder="Enter start point"
                                required
                            />
                            {errors.startPoint && <div className="invalid-feedback d-block">{errors.startPoint}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">End Point *</label>
                            <input
                                type="text"
                                name="endPoint"
                                value={editedRoute.endPoint}
                                onChange={handleChange}
                                className={`form-control ${errors.endPoint ? 'is-invalid' : ''}`}
                                placeholder="Enter end point"
                                required
                            />
                            {errors.endPoint && <div className="invalid-feedback d-block">{errors.endPoint}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Status *</label>
                            <select
                                name="status"
                                value={editedRoute.status}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                {STATUS_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
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
