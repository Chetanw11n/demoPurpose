import React, { useState } from 'react'
import { Nav, Tab, Row, Col } from 'react-bootstrap'
import ProgramList from './ProgramList'
import ResourceList from './ResourceList'
import './ProgramsResources.css'

const ProgramsResources = () => {
  const [activeKey, setActiveKey] = useState('programs')
  const [selectedProgramForResources, setSelectedProgramForResources] = useState(null)

  const handleShowResources = (programId) => {
    setSelectedProgramForResources(programId)
    setActiveKey('resources')
  }

  const handleBackToProgramList = () => {
    setSelectedProgramForResources(null)
    setActiveKey('programs')
  }

  return (
    <div className="programs-resources-container">
      <h2 className="mb-4">Programs & Resources Management</h2>

      <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
        <Row className="mb-3">
          <Col sm={12}>
            <Nav variant="tabs" className="border-bottom">
              <Nav.Item>
                <Nav.Link eventKey="programs" className="fw-bold">
                  Programs
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="resources" className="fw-bold">
                  Resources
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <Tab.Content>
              <Tab.Pane eventKey="programs">
                <ProgramList onShowResources={handleShowResources} />
              </Tab.Pane>
              <Tab.Pane eventKey="resources">
                <ResourceList 
                  selectedProgramId={selectedProgramForResources}
                  onBackToProgramList={handleBackToProgramList}
                />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  )
}

export default ProgramsResources