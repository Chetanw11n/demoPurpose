import React, { useEffect, useState } from 'react'
import { Modal, Button, Spinner, Alert } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getTicketById, checkTicket, cancelTicket } from '../../../axios/ticket_api'
import { TICKET_STATUS_COLORS, TICKET_STATUS_LABELS, PAYMENT_METHODS } from '../../../utils/ticketConstants'
import PaymentModal from './PaymentModal'

const ViewTicket = ({ ticketId, show, onClose, onSuccess }) => {
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    if (show && ticketId) {
      fetchTicketDetails()
    }
  }, [show, ticketId])

  const fetchTicketDetails = async () => {
    try {
      setLoading(true)
      const response = await getTicketById(ticketId)
      setTicket(response.data.data || response.data)
    } catch (err) {
      console.error('Failed to fetch ticket details:', err)
      toast.error('Failed to fetch ticket details')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckTicket = async () => {
    try {
      setActionLoading(true)
      await checkTicket(ticketId)
      toast.success('Ticket confirmed successfully!')
      fetchTicketDetails()
      onSuccess()
    } catch (err) {
      console.error('Error confirming ticket:', err)
      toast.error(err.response?.data?.message || 'Failed to confirm ticket')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelTicket = async () => {
    if (window.confirm('Are you sure you want to cancel this ticket?')) {
      try {
        setActionLoading(true)
        await cancelTicket(ticketId)
        toast.success('Ticket cancelled successfully!')
        fetchTicketDetails()
        onSuccess()
      } catch (err) {
        console.error('Error cancelling ticket:', err)
        toast.error(err.response?.data?.message || 'Failed to cancel ticket')
      } finally {
        setActionLoading(false)
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <>
      <Modal show={show} onHide={onClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3 text-muted">Loading ticket details...</p>
            </div>
          ) : ticket ? (
            <div>
              <div className="alert alert-info mb-3">
                <strong>Ticket ID:</strong> #{ticket.ticketId}
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <h6 className="text-muted">Route Details</h6>
                  <p className="mb-1"><strong>{ticket.route?.title}</strong></p>
                  <p className="mb-1 text-muted">{ticket.route?.type}</p>
                  <p className="mb-0">
                    <strong>{ticket.route?.startPoint}</strong> → <strong>{ticket.route?.endPoint}</strong>
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">Travel Date & Time</h6>
                  <p className="mb-0"><strong>{formatDate(ticket.date)}</strong></p>
                </div>
              </div>

              <hr />

              <div className="row mb-3">
                <div className="col-md-6">
                  <h6 className="text-muted">Fare Amount</h6>
                  <p className="mb-0"><strong>₹{parseFloat(ticket.fareAmount).toFixed(2)}</strong></p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">Status</h6>
                  <p className="mb-0">
                    <span className={`badge bg-${TICKET_STATUS_COLORS[ticket.status] || 'secondary'} fs-6`}>
                      {TICKET_STATUS_LABELS[ticket.status] || ticket.status}
                    </span>
                  </p>
                </div>
              </div>

              <hr />

              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-muted">Booked On</h6>
                  <p className="mb-0">{formatDate(ticket.createdAt)}</p>
                </div>
              </div>

              {ticket.status === 'PENDING_PAYMENT' && (
                <Alert variant="warning" className="mt-3">
                  <strong>Action Required:</strong> Please complete the payment to confirm your ticket.
                </Alert>
              )}
            </div>
          ) : (
            <Alert variant="warning">Ticket not found</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={actionLoading}>
            Close
          </Button>
          {ticket && ticket.status === 'PENDING_PAYMENT' && (
            <Button
              variant="success"
              onClick={() => setShowPaymentModal(true)}
              disabled={actionLoading}
            >
              Make Payment
            </Button>
          )}
          {ticket && ticket.status !== 'CANCELLED' && ticket.status !== 'EXPIRED' && (
            <>
              {ticket.status === 'PENDING_PAYMENT' && (
                <Button
                  variant="primary"
                  onClick={handleCheckTicket}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Confirming...' : 'Confirm Ticket'}
                </Button>
              )}
              <Button
                variant="danger"
                onClick={handleCancelTicket}
                disabled={actionLoading}
              >
                {actionLoading ? 'Cancelling...' : 'Cancel Ticket'}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <PaymentModal
        ticketId={ticketId}
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        onSuccess={() => {
          fetchTicketDetails()
          onSuccess()
          setShowPaymentModal(false)
        }}
      />
    </>
  )
}

export default ViewTicket
