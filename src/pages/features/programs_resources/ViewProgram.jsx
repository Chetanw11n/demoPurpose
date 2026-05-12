//  it is model that open in popup when user click on view button in program list page
// has close button to close the modal
import { toast } from "react-toastify"
import { getProgramById, changeProgramStatus, approveProgram, submitProgramForApproval } from "../../../axios/program_resource_api"
import { useState, useEffect } from "react"
import { Modal, Button, Form, Tab, Tabs, Alert } from "react-bootstrap"
import { useRole } from "../../../hooks/useRole"
import { ROLES } from "../../../config/roleConfig"

function ViewProgram({ programId, onClose, show, onRefresh }) {
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const { role } = useRole()
  const [newStatus, setNewStatus] = useState('')

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch (e) {
      return dateString
    }
  }

  const fetchProgramDetails = async () => {
    try {
      setLoading(true)
      const response = await getProgramById(programId)
      setProgram(response.data.data || response.data)
      setNewStatus((response.data.data || response.data).status)
      setError(null)
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        setError('Unauthorized access. Please log in again.')
        toast.error('Unauthorized access')
      } else {
        setError('Failed to fetch program details. Please try again later.')
        toast.error('Failed to fetch program details')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (show && programId) {
      fetchProgramDetails()
    }
  }, [programId, show])

  const handleChangeStatus = async (newStatus) => {
    try {
      setUpdating(true)
      await changeProgramStatus(programId, newStatus)
      setProgram(prev => ({ ...prev, status: newStatus }))
      setNewStatus(newStatus)
      toast.success('Program status updated successfully')
      if (onRefresh) onRefresh()
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        setError('Unauthorized access. Please log in again.')
        toast.error('Unauthorized access')
      } else {
        setError('Failed to update program status. Please try again later.')
        toast.error('Failed to update program status')
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleSubmitForApproval = async () => {
    try {
      setUpdating(true)
      await submitProgramForApproval(programId)
      setProgram(prev => ({ ...prev, status: 'SUBMITTED' }))
      setNewStatus('SUBMITTED')
      toast.success('Program submitted for approval')
      if (onRefresh) onRefresh()
    } catch (err) {
      toast.error('Failed to submit program for approval')
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const handleApproveProgram = async () => {
    try {
      setUpdating(true)
      await approveProgram(programId)
      setProgram(prev => ({ ...prev, status: 'APPROVED' }))
      setNewStatus('APPROVED')
      toast.success('Program approved successfully')
      if (onRefresh) onRefresh()
    } catch (err) {
      toast.error('Failed to approve program')
      console.error(err)
    } finally {
      setUpdating(false)
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

  const canSubmitForApproval = program?.status === 'DRAFT' && 
    (role === ROLES.TRANSPORT_OFFICER || role === ROLES.PROGRAM_MANAGER)

  const canApprove = program?.status === 'SUBMITTED' && role === ROLES.PROGRAM_MANAGER

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Program Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : program ? (
          <Tabs defaultActiveKey="details" className="mb-3">
            {/* Details Tab */}
            <Tab eventKey="details" title="Details">
              <div className="mt-3">
                <h6 className="mb-3">{program.title}</h6>
                <p className="mb-2"><strong>Description:</strong> {program.description}</p>
                <p className="mb-2"><strong>Start Date:</strong> {new Date(program.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="mb-2"><strong>End Date:</strong> {new Date(program.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="mb-2"><strong>Budget:</strong> ${parseFloat(program.budget).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="mb-2">
                  <strong>Status:</strong>
                  <span className={`badge bg-${getStatusColor(program.status)} ms-2`}>
                    {getStatusLabel(program.status)}
                  </span>
                </p>
              </div>
            </Tab>

            {/* Workflow Tab */}
            <Tab eventKey="workflow" title="Workflow">
              <div className="mt-3">
                <Alert variant="info">
                  <strong>Program Status:</strong> {getStatusLabel(program.status)}
                </Alert>

                {canSubmitForApproval && (
                  <div className="mb-3 p-3 border rounded bg-light">
                    <h6 className="mb-2">Submit for Approval</h6>
                    <p className="text-muted mb-3">Submit this program to Program Manager for approval</p>
                    <Button
                      variant="warning"
                      onClick={handleSubmitForApproval}
                      disabled={updating}
                      className="w-100"
                    >
                      {updating ? 'Submitting...' : 'Submit for Approval'}
                    </Button>
                  </div>
                )}

                {canApprove && (
                  <div className="mb-3 p-3 border rounded bg-light">
                    <h6 className="mb-2">Approval Actions</h6>
                    <p className="text-muted mb-3">Review and approve or reject this program</p>
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        onClick={handleApproveProgram}
                        disabled={updating}
                        className="flex-grow-1"
                      >
                        {updating ? 'Approving...' : 'Approve Program'}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleChangeStatus('ON_HOLD')}
                        disabled={updating}
                        className="flex-grow-1"
                      >
                        {updating ? 'Rejecting...' : 'Hold/Reject'}
                      </Button>
                    </div>
                  </div>
                )}

                {!canSubmitForApproval && !canApprove && (
                  <Alert variant="secondary">
                    No workflow actions available for this program status
                  </Alert>
                )}

                {/* Status History Info */}
                <div className="mt-3 p-3 border rounded">
                  <h6 className="mb-2">Status Information</h6>
                  <ul className="mb-0">
                    <li><strong>DRAFT:</strong> Initial state, can be edited and submitted</li>
                    <li><strong>SUBMITTED:</strong> Waiting for Program Manager approval</li>
                    <li><strong>APPROVED:</strong> Program is approved and active</li>
                    <li><strong>ON_HOLD:</strong> Program is on hold pending review</li>
                  </ul>
                </div>
              </div>
            </Tab>
          </Tabs>
        ) : (
          <p className="text-center">Program not found.</p>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ViewProgram