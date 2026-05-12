import React, { useState } from 'react'
import { Table, Button, Card, Alert, Nav, Tab } from 'react-bootstrap'
import PendingUsers from './PendingUsers'
import ActiveUsers from './ActiveUsers'
import AllUsers from './AllUsers'
import './UserManagement.css'

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('pending')
  const users = []

  const handleActionComplete = () => {
    // Navigate to All Users tab after approve/reject
    setActiveTab('all')
  }

  return (
    <div className="user-management-container">
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-4 user-management-tabs">
          <Nav.Item>
            <Nav.Link eventKey="pending" className="tab-link">
              Pending Users
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="active" className="tab-link">
              Active Users
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="all" className="tab-link">
              All Users
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="pending">
            <PendingUsers onActionComplete={handleActionComplete} />
          </Tab.Pane>

          <Tab.Pane eventKey="active">
            <ActiveUsers />
          </Tab.Pane>

          <Tab.Pane eventKey="all">
            <AllUsers />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  )
}

export default UserManagement