import React, { useState, useEffect } from 'react'
import { Modal, Spinner, Alert, Card, Row, Col, ProgressBar } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getProgramUtilization } from '../../../axios/program_resource_api'

function ProgramResourceUtilization({ programId, onClose, show }) {
  const [utilization, setUtilization] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch (e) {
      return dateString
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'secondary',
      SUBMITTED: 'info',
      APPROVED: 'success',
      IN_PROGRESS: 'primary',
      COMPLETED: 'success',
      ON_HOLD: 'warning',
      CANCELLED: 'danger'
    }
    return colors[status] || 'secondary'
  }

  const getStatusLabel = (status) => {
    return status?.replace(/_/g, ' ') || 'Unknown'
  }

  const fetchUtilization = async () => {
    try {
      setLoading(true)
      const response = await getProgramUtilization(programId)
      setUtilization(response.data.data || response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch resource utilization')
      toast.error('Failed to fetch resource utilization')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (show && programId) {
      fetchUtilization()
    }
  }, [show, programId])

  const getProgressColor = (percentage) => {
    if (percentage <= 25) return 'success'
    if (percentage <= 50) return 'info'
    if (percentage <= 75) return 'warning'
    return 'danger'
  }

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Program Resource Utilization</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="mb-3">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="text-muted">Loading utilization details...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : utilization ? (
          <div>
            {/* Program Overview */}
            <Card className="mb-4 border-0 bg-light">
              <Card.Body>
                <h6 className="mb-3">{utilization.title}</h6>
                <p className="mb-2"><strong>Description:</strong> {utilization.description}</p>
                <Row>
                  <Col md={4}>
                    <p className="mb-0"><strong>Start Date:</strong></p>
                    <p className="text-muted">{formatDate(utilization.startDate)}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0"><strong>End Date:</strong></p>
                    <p className="text-muted">{formatDate(utilization.endDate)}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0"><strong>Status:</strong></p>
                    <p>
                      <span className={`badge bg-${getStatusColor(utilization.status)}`}>
                        {getStatusLabel(utilization.status)}
                      </span>
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Budget Utilization */}
            <h6 className="mb-3">Financial Utilization</h6>
            <Row className="mb-4">
              <Col md={6}>
                <Card className="mb-3 border-info">
                  <Card.Body>
                    <p className="text-muted mb-2">Total Budget</p>
                    <h5>${parseFloat(utilization.allocatedBudget).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h5>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-3 border-success">
                  <Card.Body>
                    <p className="text-muted mb-2">Used Budget</p>
                    <h5>${parseFloat(utilization.utilizedBudget).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h5>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Card className="mb-3 border-warning">
                  <Card.Body>
                    <p className="text-muted mb-2">Remaining Budget</p>
                    <h5>${parseFloat(utilization.remainingBudget).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h5>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-3 border-secondary">
                  <Card.Body>
                    <p className="text-muted mb-2">Budget Utilization %</p>
                    <h5>{utilization.budgetUtilizationPercentage?.toFixed(2) || 0}%</h5>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Budget Progress Bar */}
            <div className="mb-4">
              <p className="mb-2"><strong>Budget Utilization Progress</strong></p>
              <ProgressBar
                now={utilization.budgetUtilizationPercentage || 0}
                variant={getProgressColor(utilization.budgetUtilizationPercentage || 0)}
                label={`${(utilization.budgetUtilizationPercentage || 0).toFixed(2)}%`}
                style={{ height: '25px' }}
              />
            </div>

            {/* Resource Utilization */}
            <h6 className="mb-3">Resource Utilization</h6>
            <Row>
              <Col md={4}>
                <Card className="mb-3 border-primary">
                  <Card.Body>
                    <p className="text-muted mb-2">Total Allocated</p>
                    <h5>{utilization.totalResourcesAllocated}</h5>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-3 border-success">
                  <Card.Body>
                    <p className="text-muted mb-2">Total Used</p>
                    <h5>{utilization.totalResourcesUsed}</h5>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-3 border-info">
                  <Card.Body>
                    <p className="text-muted mb-2">Remaining</p>
                    <h5>{(utilization.totalResourcesAllocated || 0) - (utilization.totalResourcesUsed || 0)}</h5>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Resource Progress Bar */}
            <div className="mt-4">
              <p className="mb-2"><strong>Resource Utilization Progress</strong></p>
              <ProgressBar
                now={utilization.totalResourcesAllocated > 0 ? ((utilization.totalResourcesUsed / utilization.totalResourcesAllocated) * 100) : 0}
                variant={getProgressColor(utilization.totalResourcesAllocated > 0 ? ((utilization.totalResourcesUsed / utilization.totalResourcesAllocated) * 100) : 0)}
                label={`${utilization.totalResourcesAllocated > 0 ? ((utilization.totalResourcesUsed / utilization.totalResourcesAllocated) * 100).toFixed(2) : 0}%`}
                style={{ height: '25px' }}
              />
            </div>
          </div>
        ) : (
          <Alert variant="warning">Utilization data not found</Alert>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ProgramResourceUtilization
