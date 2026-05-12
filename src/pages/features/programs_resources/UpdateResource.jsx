import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getResourceById } from '../../../axios/program_resource_api'

function UpdateResource({ resourceId, onClose, show, onSuccess }) {
  const [formData, setFormData] = useState({
    programId: '',
    type: 'FUNDS',
    quantity: '',
    status: 'AVAILABLE',
    budget: ''
  })

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const resourceTypes = ['FUNDS', 'VEHICLES']
  const resourceStatuses = ['AVAILABLE', 'ASSIGNED', 'IN_USE', 'IN_PROCUREMENT', 'DAMAGED', 'RETIRED']

  const fetchResourceDetails = async () => {
    try {
      setFetchLoading(true)
      const response = await getResourceById(resourceId)
      const resource = response.data.data || response.data
      setFormData({
        programId: resource.programId,
        type: resource.type,
        quantity: resource.quantity,
        status: resource.status,
        budget: resource.budget
      })
      setErrors({})
    } catch (err) {
      toast.error('Failed to fetch resource details')
      console.error(err)
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    if (show && resourceId) {
      fetchResourceDetails()
    }
  }, [show, resourceId])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.quantity || formData.quantity.toString().trim() === '') {
      newErrors.quantity = 'Quantity is required'
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number'
    }

    if (!formData.budget || formData.budget.toString().trim() === '') {
      newErrors.budget = 'Budget is required'
    } else if (isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      // TODO: Implement update resource API call
      toast.success('Resource updated successfully')
      onSuccess()
    } catch (err) {
      toast.error('Failed to update resource')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Resource</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fetchLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="mb-3">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="text-muted">Loading resource details...</p>
          </div>
        ) : (
          <>
            {Object.keys(errors).length > 0 && (
              <Alert variant="danger" className="mb-3">
                <strong>Please fix the following errors:</strong>
                <ul className="mb-0 mt-2">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Program ID (Read-only)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.programId}
                  disabled
                />
              </Form.Group>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Resource Type (Read-only)</Form.Label>
                    <Form.Select
                      value={formData.type}
                      disabled
                    >
                      {resourceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Quantity *</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      isInvalid={!!errors.quantity}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.quantity}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Budget *</Form.Label>
                    <Form.Control
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      isInvalid={!!errors.budget}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.budget}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {resourceStatuses.map(status => (
                        <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
            </Form>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={fetchLoading || loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={fetchLoading || loading}
        >
          {loading ? 'Updating...' : 'Update Resource'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UpdateResource
