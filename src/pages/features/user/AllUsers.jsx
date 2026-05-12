import React, { useState, useEffect } from 'react'
import { Table, Card, Alert, Spinner, Badge, Button, Modal, Form } from 'react-bootstrap'
import { FaEye } from 'react-icons/fa'
import api from '../../../config/axios.config'
import './UsersList.css'

const AllUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/users/')
      setUsers(response.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch all users')
      console.error('Error fetching all users:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'ACTIVE':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'REJECT':
        return 'danger'
      case 'SUSPENDED':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedUser(null)
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
    <div className="users-container">
      <div className="users-header">
        <h3 className="mb-0">All Users</h3>
        <div className="d-flex gap-2">
          <Badge bg="success">{users.filter(u => u.status === 'ACTIVE').length} Active</Badge>
          <Badge bg="warning">{users.filter(u => u.status === 'PENDING').length} Pending</Badge>
          <Badge bg="danger">{users.filter(u => u.status === 'REJECT').length} Rejected</Badge>
        </div>
        <Button variant="primary" onClick={fetchAllUsers} size="sm">
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="users-card">
        <Card.Body>
          {users.length === 0 ? (
            <Alert variant="info" className="mb-0">
              No users found
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="users-table">
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
                        <Badge bg={getStatusBadgeColor(user.status)}>
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

      {/* Modal for View Details */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
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
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AllUsers
