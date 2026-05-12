import api from '../config/axios.config';

// Make payment for a ticket
export const processPayment = async (ticketId, paymentMethod) => {
  return api.post(`/ticket/${ticketId}/payment`, null, {
    params: { paymentMethod }
  })
}

// Get payment status
export const getPaymentStatus = async (ticketId) => {
  return api.get(`/payment/ticket/${ticketId}`)
}
