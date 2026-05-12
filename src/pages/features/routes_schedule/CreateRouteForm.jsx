import React, { useState } from 'react'
import { ROUTE_STATUS, STATUS_OPTIONS } from '../../../utils/statusConstants'

const ROUTE_TYPES = ['Bus', 'Metro', 'Train']

const CreateRouteForm = ({ onSave, onCancel }) => {
    const initialState = {
        title: '',
        type: 'Bus',
        startPoint: '',
        endPoint: '',
        fares: '', // Explicitly added fare
        status: ROUTE_STATUS.DRAFT 
    }

    const [route, setRoute] = useState(initialState)

    const handleChange = (e) => {
        const { name, value } = e.target
        // Convert fare to a number immediately for the backend
        const val = name === 'fare' ? (value === '' ? '' : parseFloat(value)) : value;
        setRoute(prev => ({ ...prev, [name]: val }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Validation: Ensure fare is provided and is a positive number
        if (!route.title || !route.startPoint || !route.endPoint || route.fare === '') {
            alert("Please fill in all fields including a valid Fare");
            return 
        }

        onSave(route)
        setRoute(initialState) 
    }

    return (
        <div className="card mb-4 shadow-sm border-0">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Create New Route</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Route Title</label>
                            <input
                                type="text"
                                name="title"
                                value={route.title}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="e.g. Bangalore Express"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Transport Type</label>
                            <select
                                name="type"
                                value={route.type}
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
                                value={route.startPoint}
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
                                value={route.endPoint}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Fare (Price)</label>
                            <input
                                type="number"
                                name="fares"
                                value={route.fares}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Status</label>
                            <select
                                name="status"
                                value={route.status}
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
                    </div>

                    <div className="mt-4 d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">
                            Create Route
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4"
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

export default CreateRouteForm