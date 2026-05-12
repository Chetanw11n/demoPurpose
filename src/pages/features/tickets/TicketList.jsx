import React, { useEffect, useState } from 'react'
import { getMyTickets } from '../../../axios/ticket_api'
import { toast } from 'react-toastify'
import { TICKET_STATUS_COLORS, TICKET_STATUS_LABELS } from '../../../utils/ticketConstants'
import ViewTicket from './ViewTicket'

const TicketList = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await getMyTickets()
      const ticketsData = response.data.data || response.data || []
      setTickets(Array.isArray(ticketsData) ? ticketsData : [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch tickets:', err)
      setError('Failed to fetch tickets. Please try again later.')
      toast.error('Failed to fetch tickets')
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return dateString
    }
  }

  const handleView = (ticketId) => {
    setSelectedTicketId(ticketId)
    setShowViewModal(true)
  }

  const handleViewClose = () => {
    setShowViewModal(false)
    setSelectedTicketId(null)
  }

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h4>My Booked Tickets</h4>
        <p className="text-muted">View and manage all your booked tickets</p>
      </div>

      {loading ? (
        <div className="alert alert-info">
          <i className="fas fa-spinner fa-spin me-2"></i>
          Loading tickets...
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : tickets.length === 0 ? (
        <div className="alert alert-warning">
          <i className="fas fa-info-circle me-2"></i>
          No tickets booked yet. Book your first ticket now!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Ticket ID</th>
                <th>Route</th>
                <th>Date & Time</th>
                <th>Fare</th>
                <th>Status</th>
                <th>Booked On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.ticketId}>
                  <td>
                    <strong>#{ticket.ticketId}</strong>
                  </td>
                  <td>
                    <strong>{ticket.route?.title}</strong>
                    <br />
                    <small className="text-muted">
                      {ticket.route?.startPoint} → {ticket.route?.endPoint}
                    </small>
                  </td>
                  <td>{formatDate(ticket.date)}</td>
                  <td>
                    <strong>₹{parseFloat(ticket.fareAmount).toFixed(2)}</strong>
                  </td>
                  <td>
                    <span className={`badge bg-${TICKET_STATUS_COLORS[ticket.status] || 'secondary'}`}>
                      {TICKET_STATUS_LABELS[ticket.status] || ticket.status}
                    </span>
                  </td>
                  <td>
                    <small className="text-muted">{formatDate(ticket.createdAt)}</small>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleView(ticket.ticketId)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ViewTicket
        ticketId={selectedTicketId}
        show={showViewModal}
        onClose={handleViewClose}
        onSuccess={fetchTickets}
      />
    </div>
  )
}

export default TicketList
