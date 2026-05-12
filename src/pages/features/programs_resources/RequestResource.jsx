import React, { useState } from 'react'
import { Modal, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap'
import { toast } from 'react-toastify'

function RequestResource({ onClose, show, resource, onApprove, onReject }) {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')

  const handleApprove = async () => {
    try {
      setLoading(true)
      if (onApprove) await onApprove(resource?.resourceId, notes)
      toast.success('Resource approved')
      onClose()
    } catch (err) {
      toast.error('Failed to approve resource')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!notes.trim()) {
      toast.warning('Please provide rejection notes')
      return
    }
    try {
      setLoading(true)
      if (onReject) await onReject(resource?.resourceId, notes)
      toast.success('Resource rejected')
      onClose()
    } catch (err) {
      toast.error('Failed to reject resource')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Resource Request Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {resource && (
          <Tabs defaultActiveKey="details" className="mb-3">
            <Tab eventKey="details" title="Details">
              <div className="mt-3">
                <p className="mb-2"><strong>Resource ID:</strong> {resource.resourceId}</p>
                <p className="mb-2"><strong>Type:</strong> {resource.type}</p>
                <p className="mb-2"><strong>Quantity:</strong> {resource.quantity}</p>
                <p className="mb-2"><strong>Budget:</strong> ${parseFloat(resource.budget).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p className="mb-2"><strong>Status:</strong> <span className="badge bg-info">{resource.status}</span></p>
              </div>
            </Tab>

            <Tab eventKey="approval" title="Approval">
              <div className="mt-3">
                <Form.Group className="mb-3">
                  <Form.Label>Approval Notes *</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add approval or rejection notes"
                    rows={4}
                  />
                </Form.Group>

                <Alert variant="warning">
                  Provide notes before approving or rejecting this resource request
                </Alert>

                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    onClick={handleApprove}
                    disabled={loading}
                    className="flex-grow-1"
                  >
                    {loading ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleReject}
                    disabled={loading || !notes.trim()}
                    className="flex-grow-1"
                  >
                    {loading ? 'Processing...' : 'Reject'}
                  </Button>
                </div>
              </div>
            </Tab>
          </Tabs>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default RequestResource
