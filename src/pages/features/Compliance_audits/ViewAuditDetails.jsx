import React from "react";
import { Modal, Button, Spinner, Badge } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAuditById } from "../../../axios/audits_api";

const ViewAuditDetails = ({ show, onHide, auditId, loading, onEdit, onDelete }) => {
  const [audit, setAudit] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [localLoading, setLocalLoading] = React.useState(false);

  const fetchAuditDetails = async (id) => {
    setLocalLoading(true);
    setError(null);
    try {
      const response = await getAuditById(id);
      console.log("Audit details:", response.data);
      setAudit(response.data);
    } catch (err) {
      console.error("Error fetching audit details:", err);
      setError("Failed to fetch audit details");
    } finally {
      setLocalLoading(false);
    }
  };

  React.useEffect(() => {
    if (auditId && show) {
      fetchAuditDetails(auditId);
    }
  }, [auditId, show]);

  const isLoading = loading || localLoading;

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "OPEN":
        return "primary";
      case "CLOSED":
        return "success";
      case "DELETED":
        return "danger";
      case "IN_PROGRESS":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Audit Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <Spinner animation="border" />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : audit ? (
          <div className="compliance-details">
            <div className="detail-section">
              <h5>Audit Information</h5>
              <div className="detail-row">
                <span className="label">Audit ID:</span>
                <span className="value">{audit.id}</span>
              </div>
              <div className="detail-row">
                <span className="label">Scope:</span>
                <span className="value">{audit.scope || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span>
                  <Badge bg={getStatusBadgeVariant(audit.status)}>
                    {audit.status}
                  </Badge>
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Officer ID:</span>
                <span className="value">{audit.officer_id || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Started Date:</span>
                <span className="value">{formatDate(audit.startedAt)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Closed Date:</span>
                <span className="value">{formatDate(audit.closedAt)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h5>Findings</h5>
              <p>{audit.findings || "No findings available"}</p>
            </div>
          </div>
        ) : (
          <div className="alert alert-info">No audit data available</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="warning" 
          onClick={() => onEdit(audit?.id)}
          disabled={!audit}
        >
          <FaEdit /> Edit
        </Button>
        <Button 
          variant="danger" 
          onClick={() => onDelete(audit?.id)}
          disabled={!audit}
        >
          <FaTrash /> Delete
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewAuditDetails;
