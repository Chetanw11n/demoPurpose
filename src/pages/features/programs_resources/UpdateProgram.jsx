import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getProgramById, updateProgram } from '../../../axios/program_resource_api'

function UpdateProgram({ programId, onClose, show, onUpdate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'DRAFT'
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [fetchLoading, setFetchLoading] = useState(false)

  const programStatuses = [
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'IN_PROGRESS',
    'COMPLETED',
    'ON_HOLD',
    'CANCELLED'
  ]

  const getStatusLabel = (status) => {
    const statusLabels = {
      DRAFT: 'Draft',
      SUBMITTED: 'Submitted',
      APPROVED: 'Approved',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      ON_HOLD: 'On Hold',
      CANCELLED: 'Cancelled'
    }
    return statusLabels[status] || status
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    } catch (e) {
      return dateString
    }
  }

  useEffect(() => {
    if (show && programId) {
      fetchProgramDetails()
    }
  }, [show, programId])

  const fetchProgramDetails = async () => {
    try {
      setFetchLoading(true)
      const response = await getProgramById(programId)
      const program = response.data.data || response.data
      
      setFormData({
        title: program.title || '',
        description: program.description || '',
        startDate: formatDateForInput(program.startDate) || '',
        endDate: formatDateForInput(program.endDate) || '',
        budget: program.budget || '',
        status: program.status || 'DRAFT'
      })
      setErrors({})
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        toast.error('Unauthorized access')
      } else {
        toast.error('Failed to fetch program details')
      }
      console.error(err)
    } finally {
      setFetchLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Please provide title'
    }

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Please provide description'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start Date should be provided'
    } 

    if (!formData.endDate) {
      newErrors.endDate = 'End Date should be provided'
    } else if (new Date(formData.endDate) <= new Date()) {
      newErrors.endDate = 'End Date should be future date'
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End Date should be after Start Date'
      }
    }

    if (!formData.budget) {
      newErrors.budget = 'Budget should be provided'
    } else if (isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget should be positive'
    } else if (parseFloat(formData.budget) < 1000) {
      newErrors.budget = 'Budget should be at least 1000'
    }

    if (!formData.status) {
      newErrors.status = 'Status should be provided'
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
    // Clear error for this field
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
      const response = await updateProgram(programId, formData)
      toast.success('Program updated successfully')
      onUpdate()
      onClose()
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        toast.error('Unauthorized access')
      } else {
        toast.error('Failed to update program')
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Program</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fetchLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="mb-3">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="text-muted">Loading program details...</p>
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
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter program title"
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter program description"
                  rows={3}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      isInvalid={!!errors.startDate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.startDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>End Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      isInvalid={!!errors.endDate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.endDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Budget (Min: 1000) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Enter budget amount"
                      step="0.01"
                      min="1000"
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
                      {programStatuses.map(status => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.status}
                    </Form.Control.Feedback>
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
          {loading ? 'Updating...' : 'Update Program'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UpdateProgram
