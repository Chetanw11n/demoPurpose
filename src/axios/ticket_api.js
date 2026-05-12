import api from '../config/axios.config';

// Get all tickets for the current citizen
export const getMyTickets = async () => {
  return api.get('/ticket/citizen')
}

// Get ticket by ID
export const getTicketById = async (ticketId) => {
  return api.get(`/ticket/${ticketId}`)
}

// Book a new ticket
export const bookTicket = async (ticketData) => {
  return api.post('/ticket/book', ticketData)
}

// Check/Confirm ticket
export const checkTicket = async (ticketId) => {
  return api.put(`/ticket/check/${ticketId}`)
}

// Cancel ticket
export const cancelTicket = async (ticketId) => {
  return api.put(`/ticket/cancel/${ticketId}`)
}

// Make payment for ticket
export const makePayment = async (ticketId, paymentMethod) => {
  return api.post(`/ticket/${ticketId}/payment`, null, {
    params: { paymentMethod }
  })
}

// Get total ticket count
export const getTicketCount = async () => {
  return api.get('/ticket/count')
}
