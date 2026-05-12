import React, { useState, useEffect } from 'react'
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { bookTicket } from '../../../axios/ticket_api'
import { getRoutes, getRouteFare } from '../../../axios/route_schedule_api'
import PaymentProcess from './PaymentProcess'

const BookTicketForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    routeId: '',
    date: '',
    fareAmount: ''
  })
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [bookedTicketId, setBookedTicketId] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedRouteDetails, setSelectedRouteDetails] = useState(null)
  const [fareLoading, setFareLoading] = useState(false)

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      setFetchLoading(true)
      const response = await getRoutes()
      const routesData = response.data.data || response.data || []
      setRoutes(Array.isArray(routesData) ? routesData : [])
    } catch (err) {
      console.error('Failed to fetch routes:', err)
      toast.error('Failed to load routes')
      setRoutes([])
    } finally {
      setFetchLoading(false)
    }
  }

  const fetchRouteFare = async (routeId) => {
    try {
      setFareLoading(true)
      const response = await getRouteFare(routeId)
      const routeData = response.data.data || response.data

      // Set the fare from database and update formData with route ID
      setFormData(prev => ({
        ...prev,
        routeId: routeId, // Ensure routeId is preserved
        fareAmount: routeData.fares || ''
      }))

      setSelectedRouteDetails(routeData)
      console.log('Route fare fetched:', routeData)
    } catch (err) {
      console.error('Failed to fetch route fare:', err)
      toast.error('Failed to load fare information')
      setFormData(prev => ({
        ...prev,
        fareAmount: ''
      }))
    } finally {
      setFareLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.routeId) {
      newErrors.routeId = 'Please select a route'
    }

    if (!formData.date) {
      newErrors.date = 'Date and time are required'
    } else if (new Date(formData.date) <= new Date()) {
      newErrors.date = 'Please select a future date and time'
    }

    if (!formData.fareAmount) {
      newErrors.fareAmount = 'Fare amount is required'
    } else if (isNaN(formData.fareAmount) || parseFloat(formData.fareAmount) <= 0) {
      newErrors.fareAmount = 'Fare amount must be positive'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'routeId') {
      // Update formData immediately with the selected routeId
      setFormData(prev => ({
        ...prev,
        routeId: value,
        fareAmount: '' // Clear fare until it's fetched
      }))

      // Fetch fare when route is selected
      if (value) {
        fetchRouteFare(value)
      } else {
        setSelectedRouteDetails(null)
      }
    } else if (name === 'fareAmount') {
      // Don't allow manual changes to fare
      return
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

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
        routeId: parseInt(formData.routeId),
        date: formData.date,
        fareAmount: parseFloat(formData.fareAmount)
      }

      const response = await bookTicket(payload)
      const ticketData = response.data.data || response.data

      toast.success('Ticket booked successfully! Proceeding to payment...')
      setBookedTicketId(ticketData.ticketId)
      setShowPayment(true)
    } catch (err) {
      console.error('Error booking ticket:', err)
      toast.error(err.response?.data?.message || 'Failed to book ticket')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setFormData({
      routeId: '',
      date: '',
      fareAmount: ''
    })
    setErrors({})
    setBookedTicketId(null)
    setShowPayment(false)
    setSelectedRouteDetails(null)
    if (onSuccess) onSuccess()
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setBookedTicketId(null)
  }

  if (showPayment && bookedTicketId) {
    return (
      <PaymentProcess
        ticketId={bookedTicketId}
        fareAmount={formData.fareAmount}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    )
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
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
            <Form.Label>Select Route *</Form.Label>
            {fetchLoading ? (
              <Form.Control disabled placeholder="Loading routes..." />
            ) : (
              <Form.Select
                name="routeId"
                value={formData.routeId}
                onChange={handleChange}
                isInvalid={!!errors.routeId}
                required
              >
                <option value="">Choose a route...</option>
                {routes.map(route => (
                  <option key={route.routeId} value={route.routeId}>
                    {route.title} ({route.type}) - {route.startPoint} to {route.endPoint}
                  </option>
                ))}
              </Form.Select>
            )}
            <Form.Control.Feedback type="invalid">
              {errors.routeId}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Route Details Display */}
          {selectedRouteDetails && formData.routeId && (
            <Alert variant="info" className="mb-3">
              <h6 className="mb-2">
                <strong>Selected Route Details</strong>
              </h6>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Route:</strong> {selectedRouteDetails.title}</p>
                  <p className="mb-0"><strong>Type:</strong> {selectedRouteDetails.type}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>From:</strong> {selectedRouteDetails.startPoint}</p>
                  <p className="mb-0"><strong>To:</strong> {selectedRouteDetails.endPoint}</p>
                </div>
              </div>
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Date & Time *</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              isInvalid={!!errors.date}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.date}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fare Amount (₹) - Auto-calculated</Form.Label>
            <div className="input-group">
              <Form.Control
                type="number"
                name="fareAmount"
                value={formData.fareAmount}
                onChange={handleChange}
                placeholder="Fare will be auto-loaded from database"
                step="0.01"
                min="0"
                isInvalid={!!errors.fareAmount}
                disabled={true}
                readOnly
                className="bg-light"
                required
              />
              {fareLoading && (
                <span className="input-group-text">
                  <Spinner animation="border" size="sm" />
                </span>
              )}
            </div>
            <Form.Text className="text-muted">
              Fare is automatically fetched from the database based on the selected route. You cannot modify this value.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.fareAmount}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading || fetchLoading || fareLoading}
            size="lg"
            className="w-100"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Booking...
              </>
            ) : (
              'Proceed to Booking'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default BookTicketForm
