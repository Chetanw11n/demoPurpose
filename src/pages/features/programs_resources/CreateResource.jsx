import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { addResource, getPrograms } from '../../../axios/program_resource_api'

function CreateResource({ onClose, show, onSuccess, defaultProgramId = null }) {
  const [formData, setFormData] = useState({
    programId: defaultProgramId || '',
    type: 'FUNDS',
    quantity: '',
    status: 'AVAILABLE',
    budget: ''
  })

  const [loading, setLoading] = useState(false)
  const [fetchingPrograms, setFetchingPrograms] = useState(false)
  const [errors, setErrors] = useState({})
  const [programs, setPrograms] = useState([])

  const resourceTypes = ['FUNDS', 'VEHICLES']
  const resourceStatuses = ['AVAILABLE', 'ASSIGNED', 'IN_USE', 'IN_PROCUREMENT', 'DAMAGED', 'RETIRED']

  useEffect(() => {
    if (show) {
      fetchPrograms()
    }
  }, [show])

  useEffect(() => {
    if (defaultProgramId) {
      setFormData(prev => ({
        ...prev,
        programId: defaultProgramId
      }))
    }
  }, [defaultProgramId])

  const fetchPrograms = async () => {
    try {
      setFetchingPrograms(true)
      const response = await getPrograms()
      setPrograms(response.data.data || response.data)
    } catch (err) {
      toast.error('Failed to fetch programs')
      console.error(err)
    } finally {
      setFetchingPrograms(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.programId || formData.programId.toString().trim() === '') {
      newErrors.programId = 'Program is required'
    }

    if (!formData.type) {
      newErrors.type = 'Resource type is required'
    }

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

    if (!formData.status) {
      newErrors.status = 'Status is required'
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
      const payload = {
        programId: parseInt(formData.programId),
        type: formData.type,
        quantity: parseInt(formData.quantity),
        status: formData.status,
        budget: parseFloat(formData.budget)
      }
      await addResource(payload)
      toast.success('Resource created successfully')
      onSuccess()
      resetForm()
    } catch (err) {
      toast.error('Failed to create resource')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      programId: defaultProgramId || '',
      type: 'FUNDS',
      quantity: '',
      status: 'AVAILABLE',
      budget: ''
    })
    setErrors({})
  }

  const selectedProgram = programs.find(p => p.programId === parseInt(formData.programId))

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Resource</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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

        {fetchingPrograms ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" className="mb-2" />
            <p className="text-muted">Loading programs...</p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Program *</Form.Label>
              <Form.Select
                name="programId"
                value={formData.programId}
                onChange={handleChange}
                isInvalid={!!errors.programId}
                disabled={defaultProgramId !== null}
              >
                <option value="">-- Select a Program --</option>
                {programs.map(program => (
                  <option key={program.programId} value={program.programId}>
                    {program.programId} - {program.title}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.programId}
              </Form.Control.Feedback>
              {defaultProgramId && selectedProgram && (
                <Form.Text className="d-block mt-2 text-success">
                  ✓ Creating resource for: <strong>{selectedProgram.title}</strong>
                </Form.Text>
              )}
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Resource Type *</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    isInvalid={!!errors.type}
                  >
                    <option value="">Select Type</option>
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.type}
                  </Form.Control.Feedback>
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
                    placeholder="Enter quantity"
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
                    placeholder="Enter budget"
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
                  <Form.Label>Status *</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    isInvalid={!!errors.status}
                  >
                    <option value="">Select Status</option>
                    {resourceStatuses.map(status => (
                      <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.status}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading || fetchingPrograms}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || fetchingPrograms}
        >
          {loading ? 'Creating...' : 'Create Resource'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateResource
