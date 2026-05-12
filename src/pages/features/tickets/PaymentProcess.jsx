import React, { useState } from 'react'
import { Card, Button, Form, Alert, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { makePayment } from '../../../axios/ticket_api'
import { PAYMENT_METHODS } from '../../../utils/ticketConstants'

const PaymentProcess = ({ ticketId, fareAmount, onSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setPaymentProcessing(true)

      await makePayment(ticketId, paymentMethod)
      
      toast.success('Payment processed successfully!')
      setPaymentMethod('CASH')
      setPaymentProcessing(false)
      
      // Show success message and proceed
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 1500)
    } catch (err) {
      console.error('Payment error:', err)
      const errorMessage = err.response?.data?.message || 'Payment failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
      setPaymentProcessing(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-sm border-primary">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">💳 Payment Process</h5>
      </Card.Header>
      <Card.Body>
        {/* Ticket Summary */}
        <div className="alert alert-info mb-4">
          <h6 className="mb-3">Ticket Summary</h6>
          <div className="row">
            <div className="col-md-6">
              <p className="mb-1"><strong>Ticket ID:</strong> #{ticketId}</p>
            </div>
            <div className="col-md-6 text-end">
              <p className="mb-1"><strong>Amount:</strong> <span className="text-success fs-5">₹{parseFloat(fareAmount).toFixed(2)}</span></p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            <strong>Payment Error:</strong> {error}
          </Alert>
        )}

        {/* Payment Method Selection */}
        <div className="mb-4">
          <h6 className="mb-3">Select Payment Method</h6>
          <Form>
            {PAYMENT_METHODS.map(method => (
              <Form.Check
                key={method.value}
                type="radio"
                id={`payment-${method.value}`}
                name="paymentMethod"
                label={
                  <span className="ms-2">
                    {method.value === 'CASH' && '💵'} 
                    {method.value === 'CARD' && '💳'} 
                    {method.value === 'UPI' && '📱'} 
                    {' '}{method.label}
                  </span>
                }
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mb-2"
              />
            ))}
          </Form>
        </div>

        {/* Payment Method Description */}
        <div className="alert alert-light mb-4 border">
          <h6 className="mb-2">Payment Method Details:</h6>
          {paymentMethod === 'CASH' && (
            <p className="mb-0 small">Pay the fare amount in cash to the conductor at the time of boarding.</p>
          )}
          {paymentMethod === 'CARD' && (
            <p className="mb-0 small">Pay using your debit or credit card. You will be redirected to secure payment gateway.</p>
          )}
          {paymentMethod === 'UPI' && (
            <p className="mb-0 small">Pay using UPI (Google Pay, PhonePe, Paytm, etc.). Quick and secure payment method.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading || paymentProcessing}
            className="flex-grow-1"
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handlePayment}
            disabled={loading || paymentProcessing}
            className="flex-grow-1"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing Payment...
              </>
            ) : (
              <>
                ✓ Confirm Payment (₹{parseFloat(fareAmount).toFixed(2)})
              </>
            )}
          </Button>
        </div>

        {/* Security Notice */}
        <div className="alert alert-light mt-3 mb-0 border-start border-success border-3">
          <small className="text-muted">
            🔒 Your payment information is secure and encrypted. You will receive a payment confirmation via email.
          </small>
        </div>
      </Card.Body>
    </Card>
  )
}

export default PaymentProcess
