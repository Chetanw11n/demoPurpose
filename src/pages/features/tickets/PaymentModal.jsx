import React, { useState } from 'react'
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { makePayment } from '../../../axios/ticket_api'
import { PAYMENT_METHODS } from '../../../utils/ticketConstants'

const PaymentModal = ({ ticketId, show, onHide, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!paymentMethod) {
      setError('Please select a payment method')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await makePayment(ticketId, paymentMethod)
      toast.success(`Payment processed via ${paymentMethod}!`)
      setPaymentMethod('CASH')
      onSuccess()
    } catch (err) {
      console.error('Payment error:', err)
      const errorMessage = err.response?.data?.message || 'Payment failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Payment Method</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Payment Method *</Form.Label>
            {PAYMENT_METHODS.map(method => (
              <Form.Check
                key={method.value}
                type="radio"
                id={`payment-${method.value}`}
                name="paymentMethod"
                label={method.label}
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mb-2"
              />
            ))}
          </Form.Group>

          <div className="alert alert-info">
            <small>
              <strong>Note:</strong> Your ticket will be confirmed once payment is processed successfully.
            </small>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PaymentModal
