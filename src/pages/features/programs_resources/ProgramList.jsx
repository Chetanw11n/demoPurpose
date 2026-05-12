import React, { useEffect, useState } from 'react'
import { getPrograms, submitProgramForApproval, approveProgram } from '../../../axios/program_resource_api'
import { toast } from "react-toastify"
import { logout } from "../../../utils/authUtil"
import { useDispatch } from 'react-redux'
import { useRole } from '../../../hooks/useRole'
import { ROLES } from '../../../config/roleConfig'
import ViewProgram from './ViewProgram'
import UpdateProgram from './UpdateProgram'
import ProgramResourceUtilization from './ProgramResourceUtilization'
import CreateResource from './CreateResource'
import CreateProgram from './CreateProgram'
import { Button } from 'react-bootstrap'

function ProgramList({ onShowResources }) {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const { canPerform, role } = useRole()
  const [showViewModal, setShowViewModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showUtilizationModal, setShowUtilizationModal] = useState(false)
  const [showCreateResourceModal, setShowCreateResourceModal] = useState(false)
  const [showCreateProgramModal, setShowCreateProgramModal] = useState(false)
  const [selectedProgramId, setSelectedProgramId] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchPrograms = async () => {
    try {
      const response = await getPrograms()
      setPrograms(response.data.data || response.data)
      setError(null)
      console.log(response)
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        setError('Unauthorized access. Please log in again.')
        toast.error('Unauthorized access. Please log in again.')
        logout()
      } else {
        setError('Failed to fetch programs. Please try again later.')
        toast.error('Failed to fetch programs')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  // Open view modal
  const handleView = (programId) => {
    setSelectedProgramId(programId)
    setShowViewModal(true)
  }

  const handleUtilization = (programId) => {
    setSelectedProgramId(programId)
    setShowUtilizationModal(true)
  }

  // Close view modal
  const handleClose = () => {
    setShowViewModal(false)
    setSelectedProgramId(null)
  }

  const handleUtilizationClose = () => {
    setShowUtilizationModal(false)
    setSelectedProgramId(null)
  }

  // Open update modal
  const handleUpdate = (programId) => {
    setSelectedProgramId(programId)
    setShowUpdateModal(true)
  }

  // Close update modal
  const handleUpdateClose = () => {
    setShowUpdateModal(false)
    setSelectedProgramId(null)
  }

  // Handle successful update
  const handleUpdateSuccess = () => {
    fetchPrograms()
  }

  const handleDelete = (programId) => {
    toast.info('Delete functionality coming soon')
  }

  const handleCreateProgram = () => {
    setShowCreateProgramModal(true)
  }

  const handleCreateProgramClose = () => {
    setShowCreateProgramModal(false)
  }

  const handleCreateProgramSuccess = () => {
    handleCreateProgramClose()
    fetchPrograms()
    toast.success('Program created successfully')
  }

  const handleSubmitForApproval = async (programId) => {
    try {
      setActionLoading(true)
      await submitProgramForApproval(programId)
      toast.success('Program submitted for approval')
      fetchPrograms()
    } catch (err) {
      toast.error('Failed to submit program for approval')
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleApproveProgram = async (programId) => {
    try {
      setActionLoading(true)
      await approveProgram(programId)
      toast.success('Program approved successfully')
      fetchPrograms()
    } catch (err) {
      toast.error('Failed to approve program')
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const statusColors = {
      DRAFT: 'secondary',
      SUBMITTED: 'info',
      APPROVED: 'success',
      IN_PROGRESS: 'primary',
      COMPLETED: 'success',
      ON_HOLD: 'warning',
      CANCELLED: 'danger'
    }
    return statusColors[status] || 'secondary'
  }

  const getStatusLabel = (status) => {
    const statusLabels = {
      DRAFT: 'Draft',
      SUBMITTED: 'Submitted',
      APPROVED: 'Approved',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      ON_HOLD: 'On Hold',
      CANCELLED: 'Cancelled'
    }
    return statusLabels[status] || status
  }

  const handleShowResources = (programId) => {
    if (onShowResources) {
      onShowResources(programId)
    }
  }

  const handleAddResource = (programId) => {
    setSelectedProgramId(programId)
    setShowCreateResourceModal(true)
  }

  const handleCreateResourceClose = () => {
    setShowCreateResourceModal(false)
    setSelectedProgramId(null)
  }

  const handleCreateResourceSuccess = () => {
    handleCreateResourceClose()
    toast.success('Resource added successfully')
  }

  const canSubmitForApproval = (program) => {
    return (role === ROLES.TRANSPORT_OFFICER || role === ROLES.PROGRAM_MANAGER) && 
           program.status === 'DRAFT'
  }

  const canApprove = (program) => {
    return role === ROLES.PROGRAM_MANAGER && program.status === 'SUBMITTED'
  }

  const canCreateProgram = () => {
    return role === ROLES.TRANSPORT_OFFICER || role === ROLES.PROGRAM_MANAGER || role === ROLES.ADMINISTRATOR
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Program List</h2>
        {canCreateProgram() && (
          <Button variant="primary" onClick={handleCreateProgram}>
            + Create Program
          </Button>
        )}
      </div>

      {loading ? (
        <p>Loading programs...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : programs.length === 0 ? (
        <p className="text-muted">No programs found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.programId}>
                  <td>{program.programId}</td>
                  <td>{program.title}</td>
                  <td>
                    {new Date(program.startDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td>
                    {new Date(program.endDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td>
                    <span className={`badge bg-${getStatusColor(program.status)}`}>
                      {getStatusLabel(program.status)}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleView(program.programId)}
                        title="View program details"
                      >
                        View
                      </button>
                      <button
                        className="btn btn-info"
                        onClick={() => handleUtilization(program.programId)}
                        title="View resource utilization"
                      >
                        Utilization
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => handleShowResources(program.programId)}
                        title="Show resources of this program"
                      >
                        Resources
                      </button>

                      {/* Workflow Actions */}
                      {canSubmitForApproval(program) && (
                        <button
                          className="btn btn-warning"
                          onClick={() => handleSubmitForApproval(program.programId)}
                          disabled={actionLoading}
                          title="Submit for approval"
                        >
                          Submit
                        </button>
                      )}

                      {canApprove(program) && (
                        <button
                          className="btn btn-success"
                          onClick={() => handleApproveProgram(program.programId)}
                          disabled={actionLoading}
                          title="Approve program"
                        >
                          Approve
                        </button>
                      )}

                      {/* Resource Management */}
                      {canPerform('manageVehicles') && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleAddResource(program.programId)}
                          title="Add new resource for this program"
                        >
                          + Resource
                        </button>
                      )}

                      {/* Edit/Update */}
                      {program.status === 'DRAFT' && (
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => handleUpdate(program.programId)}
                          title="Edit program"
                        >
                          Edit
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(program.programId)}
                        title="Delete program"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Program Modal */}
      <ViewProgram
        programId={selectedProgramId}
        onClose={handleClose}
        show={showViewModal}
      />

      {/* Update Program Modal */}
      <UpdateProgram
        programId={selectedProgramId}
        onClose={handleUpdateClose}
        show={showUpdateModal}
        onUpdate={handleUpdateSuccess}
      />

      {/* Utilization Modal */}
      <ProgramResourceUtilization
        programId={selectedProgramId}
        onClose={handleUtilizationClose}
        show={showUtilizationModal}
      />

      {/* Create Resource Modal */}
      {canPerform('manageVehicles') && (
        <CreateResource
          onClose={handleCreateResourceClose}
          show={showCreateResourceModal}
          onSuccess={handleCreateResourceSuccess}
          defaultProgramId={selectedProgramId}
        />
      )}

      {/* Create Program Modal */}
      {canCreateProgram() && (
        <CreateProgram
          onClose={handleCreateProgramClose}
          show={showCreateProgramModal}
          onSuccess={handleCreateProgramSuccess}
        />
      )}
    </div>
  )
}

export default ProgramList
