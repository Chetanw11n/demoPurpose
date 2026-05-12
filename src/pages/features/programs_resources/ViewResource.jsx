import React, { useState, useEffect } from 'react'
import { Modal, Spinner, Alert, Button, Form, Tab, Tabs, Row, Col, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getResourceById, changeResourceStatus, allocateResource } from '../../../axios/program_resource_api'
import { useRole } from '../../../hooks/useRole'
import './ViewResource.css'

function ViewResource({ resourceId, onClose, show, onRefresh }) {
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const { canPerform } = useRole()

  // Status change state
  const [newStatus, setNewStatus] = useState('')

  // Allocation state
  const [showAllocationForm, setShowAllocationForm] = useState(false)
  const [allocationData, setAllocationData] = useState({
    programId: '',
    quantity: '',
    effectiveFrom: '',
    effectiveTo: '',
    notes: ''
  })
  const [allocationErrors, setAllocationErrors] = useState({})

  const resourceStatuses = ['AVAILABLE', 'ASSIGNED', 'IN_USE', 'IN_PROCUREMENT', 'DAMAGED', 'RETIRED']

  const getStatusLabel = (status) => {
    return status?.replace(/_/g, ' ') || 'Unknown'
  }

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: 'success',
      ASSIGNED: 'primary',
      IN_USE: 'warning',
      IN_PROCUREMENT: 'info',
      DAMAGED: 'danger',
      RETIRED: 'secondary'
    }
    return colors[status] || 'secondary'
  }

  const fetchResourceDetails = async () => {
    try {
      setLoading(true)
      const response = await getResourceById(resourceId)
      const data = response.data.data || response.data
      setResource(data)
      setNewStatus(data.status)
      setError(null)
    } catch (err) {
      setError('Failed to fetch resource details')
      toast.error('Failed to fetch resource details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (show && resourceId) {
      fetchResourceDetails()
    }
  }, [show, resourceId])

  const handleStatusChange = async () => {
    if (newStatus === resource.status) {
      toast.info('Please select a different status')
      return
    }

    try {
      setUpdating(true)
      await changeResourceStatus(resourceId, newStatus)
      setResource(prev => ({ ...prev, status: newStatus }))
      toast.success('Resource status updated successfully')
      if (onRefresh) onRefresh()
    } catch (err) {
      toast.error('Failed to update resource status')
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const validateAllocationForm = () => {
    const errors = {}

    if (!allocationData.quantity || allocationData.quantity.toString().trim() === '') {
      errors.quantity = 'Quantity is required'
    } else if (isNaN(allocationData.quantity) || parseFloat(allocationData.quantity) <= 0) {
      errors.quantity = 'Quantity must be positive'
    } else if (parseFloat(allocationData.quantity) > resource.quantity) {
      errors.quantity = `Quantity cannot exceed available (${resource.quantity})`
    }

    if (!allocationData.effectiveFrom) {
      errors.effectiveFrom = 'Start date is required'
    }

    if (!allocationData.effectiveTo) {
      errors.effectiveTo = 'End date is required'
    }

    if (allocationData.effectiveFrom && allocationData.effectiveTo) {
      if (new Date(allocationData.effectiveFrom) >= new Date(allocationData.effectiveTo)) {
        errors.effectiveTo = 'End date must be after start date'
      }
    }

    setAllocationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAllocationChange = (e) => {
    const { name, value } = e.target
    setAllocationData(prev => ({
      ...prev,
      [name]: value
    }))
    if (allocationErrors[name]) {
      setAllocationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAllocate = async () => {
    if (!validateAllocationForm()) {
      return
    }

    try {
      setUpdating(true)
      const payload = {
        programId: resource.programId,
        quantity: parseFloat(allocationData.quantity),
        effectiveFrom: allocationData.effectiveFrom,
        effectiveTo: allocationData.effectiveTo,
        notes: allocationData.notes
      }
      await allocateResource(resourceId, payload)
      toast.success('Resource allocated successfully')
      setShowAllocationForm(false)
      setAllocationData({
        programId: '',
        quantity: '',
        effectiveFrom: '',
        effectiveTo: '',
        notes: ''
      })
      if (onRefresh) onRefresh()
    } catch (err) {
      toast.error('Failed to allocate resource')
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Resource Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="mb-3">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="text-muted">Loading resource details...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : resource ? (
          <Tabs defaultActiveKey="details" className="mb-3">
            {/* Details Tab */}
            <Tab eventKey="details" title="Details">
              <div className="mt-3">
                <Row className="mb-3">
                  <Col md={6}>
                    <p className="mb-2"><strong>Resource ID:</strong> {resource.resourceId}</p>
                    <p className="mb-2"><strong>Program ID:</strong> {resource.programId}</p>
                    <p className="mb-2"><strong>Type:</strong> <span className="badge bg-info">{resource.type}</span></p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-2"><strong>Quantity:</strong> {resource.quantity}</p>
                    <p className="mb-2"><strong>Budget:</strong> ${parseFloat(resource.budget).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p className="mb-2">
                      <strong>Status:</strong>
                      <span className={`badge bg-${getStatusColor(resource.status)} ms-2`}>
                        {getStatusLabel(resource.status)}
                      </span>
                    </p>
                  </Col>
                </Row>
              </div>
            </Tab>

            {/* Status Management Tab */}
            {canPerform('manageVehicles') && (
              <Tab eventKey="status" title="Manage Status">
                <div className="mt-3">
                  <Card className="mb-3">
                    <Card.Body>
                      <h6 className="mb-3">Change Resource Status</h6>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Status</Form.Label>
                        <Form.Control
                          type="text"
                          value={getStatusLabel(resource.status)}
                          disabled
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>New Status *</Form.Label>
                        <Form.Select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                        >
                          <option value="">Select Status</option>
                          {resourceStatuses.map(status => (
                            <option key={status} value={status}>
                              {getStatusLabel(status)}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Button
                        variant="primary"
                        onClick={handleStatusChange}
                        disabled={updating || !newStatus}
                        className="w-100"
                      >
                        {updating ? 'Updating...' : 'Update Status'}
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              </Tab>
            )}

            {/* Allocation Tab */}
            {canPerform('manageVehicles') && resource.status === 'AVAILABLE' && (
              <Tab eventKey="allocation" title="Allocate">
                <div className="mt-3">
                  {!showAllocationForm ? (
                    <Button
                      variant="success"
                      onClick={() => setShowAllocationForm(true)}
                      className="w-100"
                    >
                      + Allocate Resource
                    </Button>
                  ) : (
                    <Card>
                      <Card.Body>
                        <h6 className="mb-3">Allocate Resource</h6>

                        {Object.keys(allocationErrors).length > 0 && (
                          <Alert variant="danger" className="mb-3">
                            <strong>Please fix errors:</strong>
                            <ul className="mb-0 mt-2">
                              {Object.values(allocationErrors).map((error, idx) => (
                                <li key={idx}>{error}</li>
                              ))}
                            </ul>
                          </Alert>
                        )}

                        <Form.Group className="mb-3">
                          <Form.Label>Quantity to Allocate *</Form.Label>
                          <Form.Control
                            type="number"
                            name="quantity"
                            value={allocationData.quantity}
                            onChange={handleAllocationChange}
                            placeholder="Enter quantity"
                            max={resource.quantity}
                            step="0.01"
                            isInvalid={!!allocationErrors.quantity}
                          />
                          <Form.Text className="d-block text-muted">
                            Available: {resource.quantity}
                          </Form.Text>
                          <Form.Control.Feedback type="invalid">
                            {allocationErrors.quantity}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <div className="row">
                          <div className="col-md-6">
                            <Form.Group className="mb-3">
                              <Form.Label>Effective From *</Form.Label>
                              <Form.Control
                                type="date"
                                name="effectiveFrom"
                                value={allocationData.effectiveFrom}
                                onChange={handleAllocationChange}
                                isInvalid={!!allocationErrors.effectiveFrom}
                              />
                              <Form.Control.Feedback type="invalid">
                                {allocationErrors.effectiveFrom}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-md-6">
                            <Form.Group className="mb-3">
                              <Form.Label>Effective To *</Form.Label>
                              <Form.Control
                                type="date"
                                name="effectiveTo"
                                value={allocationData.effectiveTo}
                                onChange={handleAllocationChange}
                                isInvalid={!!allocationErrors.effectiveTo}
                              />
                              <Form.Control.Feedback type="invalid">
                                {allocationErrors.effectiveTo}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                        </div>

                        <Form.Group className="mb-3">
                          <Form.Label>Notes</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="notes"
                            value={allocationData.notes}
                            onChange={handleAllocationChange}
                            placeholder="Enter allocation notes"
                            rows={3}
                          />
                        </Form.Group>

                        <div className="d-flex gap-2">
                          <Button
                            variant="success"
                            onClick={handleAllocate}
                            disabled={updating}
                            className="flex-grow-1"
                          >
                            {updating ? 'Allocating...' : 'Confirm Allocation'}
                          </Button>
                          <Button
                            variant="outline-secondary"
                            onClick={() => setShowAllocationForm(false)}
                            disabled={updating}
                            className="flex-grow-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  )}
                </div>
              </Tab>
            )}

            {/* Analysis Tab */}
            <Tab eventKey="analysis" title="Analysis">
              <div className="mt-3">
                <Card>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={6}>
                        <p className="text-muted mb-1">Total Budget</p>
                        <h5>${parseFloat(resource.budget).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h5>
                      </Col>
                      <Col md={6}>
                        <p className="text-muted mb-1">Budget per Unit</p>
                        <h5>${(resource.budget / resource.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h5>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <p className="text-muted mb-1">Resource Type</p>
                        <p><strong>{resource.type}</strong></p>
                      </Col>
                      <Col md={6}>
                        <p className="text-muted mb-1">Current Status</p>
                        <p>
                          <span className={`badge bg-${getStatusColor(resource.status)}`}>
                            {getStatusLabel(resource.status)}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            </Tab>
          </Tabs>
        ) : (
          <Alert variant="warning">Resource not found</Alert>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ViewResource
