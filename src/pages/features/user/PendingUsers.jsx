import React, { useState, useEffect } from 'react'
import { Table, Button, Card, Alert, Spinner, Badge, Modal, Form } from 'react-bootstrap'
import { FaCheck, FaTimes, FaEye, FaTrash } from 'react-icons/fa'
import { pendingUsers } from '../../../axios/auth_api'
import api from '../../../config/axios.config'
import { useSelector } from 'react-redux'
import './PendingUsers.css'

const PendingUsers = ({ onActionComplete }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [approving, setApproving] = useState(false)
  
  // Get admin ID from Redux store
  const authState = useSelector(state => state.auth)
  const adminId = authState?.user?.id || 1

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await pendingUsers()
      setUsers(response.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending users')
      console.error('Error fetching pending users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setActionType('view')
    setShowModal(true)
  }

  const handleApprove = (user) => {
    setSelectedUser(user)
    setActionType('approve')
    setShowModal(true)
  }

  const handleReject = (user) => {
    setSelectedUser(user)
    setActionType('reject')
    setShowModal(true)
  }

  const handleConfirmAction = async () => {
    try {
      setApproving(true)
      const status = actionType === 'approve' ? 'ACTIVE' : 'SUSPENDED'
      const userId = selectedUser.userId
      
      console.log(`Calling: /users/${adminId}/${status}/${userId}`)
      
      // Call backend endpoint: PUT /users/{adminId}/{status}/{userId}
      const response = await api.put(
        `/users/${adminId}/${status}/${userId}`
      )
      
      if (response.status === 200) {
        alert(`User ${selectedUser.name} ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`)
        setShowModal(false)
        setError(null)
        // Call navigation callback to switch to All Users tab
        if (onActionComplete) {
          onActionComplete()
        }
        // Refresh the list after action
        fetchPendingUsers()
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to process action'
      setError(errorMsg)
      console.error('Error:', err)
      alert(`Error: ${errorMsg}`)
    } finally {
      setApproving(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedUser(null)
    setActionType(null)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div className="pending-users-container">
      <div className="pending-users-header">
        <h3 className="mb-0">Pending User Approvals</h3>
        <Button variant="primary" onClick={fetchPendingUsers} size="sm">
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="pending-users-card">
        <Card.Body>
          {users.length === 0 ? (
            <Alert variant="info" className="mb-0">
              No pending users to approve
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="pending-users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td className="user-name">{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <Badge bg="info">{user.role?.replace(/_/g, ' ')}</Badge>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge bg="warning" text="dark">
                          {user.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            title="View Details"
                            onClick={() => handleViewDetails(user)}
                            className="action-btn"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            title="Approve"
                            onClick={() => handleApprove(user)}
                            className="action-btn"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="REJECT"
                            onClick={() => handleReject(user)}
                            className="action-btn"
                          >
                            <FaTimes />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal for View/Approve/Reject */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === 'view' && 'User Details'}
            {actionType === 'approve' && 'Approve User'}
            {actionType === 'reject' && 'Reject User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="user-details">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedUser.name}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={selectedUser.email}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Phone:</Form.Label>
                  <Form.Control
                    type="tel"
                    value={selectedUser.phone}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Role:</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedUser.role?.replace(/_/g, ' ')}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Status:</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedUser.status}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Created Date:</Form.Label>
                  <Form.Control
                    type="text"
                    value={new Date(selectedUser.createdAt).toLocaleString()}
                    disabled
                  />
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {actionType !== 'view' && (
            <Button
              variant={actionType === 'approve' ? 'success' : 'danger'}
              onClick={handleConfirmAction}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default PendingUsers
