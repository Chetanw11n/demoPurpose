import React, { useEffect, useState } from 'react'
import { getAllResources, getResourcesByProgram, getPrograms } from '../../../axios/program_resource_api'
import { toast } from 'react-toastify'
import { useRole } from '../../../hooks/useRole'
import ViewResource from './ViewResource'
import CreateResource from './CreateResource'
import UpdateResource from './UpdateResource'
import { Button, Table, Alert, Spinner, Form, Row, Col } from 'react-bootstrap'
import './ResourceList.css'

function ResourceList({ selectedProgramId = null, onBackToProgramList }) {
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [programs, setPrograms] = useState([])
  const { canPerform, role } = useRole()

  const [showViewModal, setShowViewModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedResourceId, setSelectedResourceId] = useState(null)

  // Filter states
  const [filterProgramId, setFilterProgramId] = useState(selectedProgramId || 'ALL')
  const [searchTitle, setSearchTitle] = useState('')

  const fetchPrograms = async () => {
    try {
      const response = await getPrograms()
      setPrograms(response.data.data || response.data)
    } catch (err) {
      console.error('Failed to fetch programs:', err)
    }
  }

  const fetchResources = async () => {
    try {
      setLoading(true)
      let response
      
      if (selectedProgramId && selectedProgramId !== 'ALL') {
        response = await getResourcesByProgram(selectedProgramId)
      } else {
        response = await getAllResources()
      }
      
      setResources(response.data.data || response.data)
      setError(null)
      applyFilters(response.data.data || response.data, filterProgramId, '')
    } catch (err) {
      setError('Failed to fetch resources. Please try again later.')
      toast.error('Failed to fetch resources')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
    if (selectedProgramId) {
      setFilterProgramId(selectedProgramId)
    }
  }, [selectedProgramId])

  useEffect(() => {
    fetchResources()
  }, [selectedProgramId])

  const applyFilters = (data, programId, title) => {
    let filtered = data

    if (programId !== 'ALL') {
      filtered = filtered.filter(r => r.programId === parseInt(programId))
    }

    if (title.trim() !== '') {
      filtered = filtered.filter(r => {
        const program = programs.find(p => p.programId === r.programId)
        return program && program.title.toLowerCase().includes(title.toLowerCase())
      })
    }

    setFilteredResources(filtered)
  }

  const handleProgramChange = (e) => {
    const programId = e.target.value
    setFilterProgramId(programId)
    setSearchTitle('')
    applyFilters(resources, programId, '')
  }

  const handleSearchChange = (e) => {
    const searchValue = e.target.value
    setSearchTitle(searchValue)
    applyFilters(resources, filterProgramId, searchValue)
  }

  const handleView = (resourceId) => {
    setSelectedResourceId(resourceId)
    setShowViewModal(true)
  }

  const handleCreate = () => {
    setShowCreateModal(true)
  }

  const handleUpdate = (resourceId) => {
    setSelectedResourceId(resourceId)
    setShowUpdateModal(true)
  }

  const handleDelete = (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      toast.info('Delete functionality coming soon')
    }
  }

  const handleCreateClose = () => {
    setShowCreateModal(false)
  }

  const handleViewClose = () => {
    setShowViewModal(false)
    setSelectedResourceId(null)
  }

  const handleUpdateClose = () => {
    setShowUpdateModal(false)
    setSelectedResourceId(null)
  }

  const handleCreateSuccess = () => {
    fetchResources()
    handleCreateClose()
  }

  const handleUpdateSuccess = () => {
    fetchResources()
    handleUpdateClose()
  }

  const handleRefresh = () => {
    fetchResources()
  }

  const getResourceTypeColor = (type) => {
    const colors = {
      FUNDS: 'info',
      VEHICLES: 'success'
    }
    return colors[type] || 'secondary'
  }

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: 'success',
      ASSIGNED: 'primary',
      IN_USE: 'warning',
      IN_PROCUREMENT: 'info',
      DAMAGED: 'danger',
      RETIRED: 'secondary'
    }
    return colors[status] || 'secondary'
  }

  const getStatusLabel = (status) => {
    return status?.replace(/_/g, ' ') || 'Unknown'
  }

  const selectedProgram = programs.find(p => p.programId === parseInt(filterProgramId))

  return (
    <div className="resource-list-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {selectedProgramId && (
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={onBackToProgramList}
              className="me-2"
            >
              ← Back to Programs
            </Button>
          )}
          <h2 className="d-inline">
            {selectedProgramId ? `Resources for: ${selectedProgram?.title || 'Program'}` : 'Resource Management'}
          </h2>
        </div>
        {canPerform('manageVehicles') && (
          <Button variant="primary" onClick={handleCreate}>
            + Add Resource
          </Button>
        )}
      </div>

      {/* Filter Section */}
      {!selectedProgramId && (
        <div className="filter-section mb-4 p-3 bg-white rounded border">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Filter by Program</Form.Label>
                <Form.Select
                  value={filterProgramId}
                  onChange={handleProgramChange}
                  className="form-control-sm"
                >
                  <option value="ALL">All Programs</option>
                  {programs.map(program => (
                    <option key={program.programId} value={program.programId}>
                      {program.programId} - {program.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Search by Program Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type program title..."
                  value={searchTitle}
                  onChange={handleSearchChange}
                  className="form-control-sm"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="text-muted">Loading resources...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <Alert variant="info">
          No resources found. {canPerform('manageVehicles') && 'Click "Add Resource" to create one.'}
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="resource-table">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Program</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => {
                const program = programs.find(p => p.programId === resource.programId)
                return (
                  <tr key={resource.resourceId}>
                    <td>{resource.resourceId}</td>
                    <td>{program?.title || resource.programId}</td>
                    <td>
                      <span className={`badge bg-${getResourceTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                    </td>
                    <td>{resource.quantity}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(resource.status)}`}>
                        {getStatusLabel(resource.status)}
                      </span>
                    </td>
                    <td>${parseFloat(resource.budget).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleView(resource.resourceId)}
                      >
                        View
                      </Button>
                      {canPerform('manageVehicles') && (
                        <>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleUpdate(resource.resourceId)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(resource.resourceId)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modals */}
      <ViewResource
        resourceId={selectedResourceId}
        onClose={handleViewClose}
        show={showViewModal}
        onRefresh={handleRefresh}
      />

      {canPerform('manageVehicles') && (
        <>
          <CreateResource
            onClose={handleCreateClose}
            show={showCreateModal}
            onSuccess={handleCreateSuccess}
            defaultProgramId={selectedProgramId}
          />

          <UpdateResource
            resourceId={selectedResourceId}
            onClose={handleUpdateClose}
            show={showUpdateModal}
            onSuccess={handleUpdateSuccess}
          />
        </>
      )}
    </div>
  )
}

export default ResourceList
