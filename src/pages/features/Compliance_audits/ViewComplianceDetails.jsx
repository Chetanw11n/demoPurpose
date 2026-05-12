import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getComplianceById } from "../../../axios/compliance_audit";
import ProgramEntity from "./entities/ProgramEntity";
import TicketEntity from "./entities/TicketEntity";
import RouteEntity from "./entities/RouteEntity";

const ViewComplianceDetails = ({ show, onHide, complianceId, loading, onEdit, onDelete }) => {
  const [compliance, setCompliance] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [localLoading, setLocalLoading] = React.useState(false);
  
  const fetchComplianceDetails = async (id) => {
    setLocalLoading(true);
    setError(null);
    try {
      const response = await getComplianceById(id);
      console.log("Compliance details:", response.data);
      setCompliance(response.data);
    } catch (err) {
      console.error("Error fetching compliance details:", err);
      setError("Failed to fetch compliance details");
    } finally {
      setLocalLoading(false);
    }
  };

  React.useEffect(() => {
    if (complianceId && show) {
      fetchComplianceDetails(complianceId);
    }
  }, [complianceId, show]);

  const isLoading = loading || localLoading;
  const complianceType = compliance?.type;

  const getResultBadgeVariant = (result) => {
    switch (result) {
      case "COMPLIANT":
      case "PASS":
        return "success";
      case "NON_COMPLIANT":
      case "FAIL":
        return "danger";
      case "OBSERVATION":
        return "warning";
      case "NA":
        return "secondary";
      default:
        return "info";
    }
  };

  const renderEntitySection = () => {
    const entity = compliance?.entityData;
    
    switch (complianceType) {
      case "PROGRAM":
        return <ProgramEntity entity={entity} />;

      case "TICKET":
        return <TicketEntity entity={entity} />;

      case "ROUTE":
        return <RouteEntity entity={entity} />;

      default:
        return (
          <div className="detail-section">
            <h5>Entity Information</h5>
            <div className="detail-row">
              <span className="label">Entity ID:</span>
              <span className="value">{compliance?.entityId || "N/A"}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Compliance Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <Spinner animation="border" />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : compliance ? (
          <div className="compliance-details">
            <div className="detail-section">
              <h5>Compliance Information</h5>
              <div className="detail-row">
                <span className="label">Compliance ID:</span>
                <span className="value">{compliance.complianceId}</span>
              </div>
              <div className="detail-row">
                <span className="label">Compliance Date:</span>
                <span className="value">
                  {new Date(compliance.complianceDate).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Type:</span>
                <span className="value">{compliance.type}</span>
              </div>
              <div className="detail-row">
                <span className="label">Result:</span>
                <span className={`badge bg-${getResultBadgeVariant(compliance.result)}`}>
                  {compliance.result}
                </span>
              </div>
            </div>

            {renderEntitySection()}

            <div className="detail-section">
              <h5>Notes</h5>
              <p>{compliance.notes || "No notes available"}</p>
            </div>
          </div>
        ) : (
          <div className="alert alert-info">No compliance data available</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="warning" 
          onClick={() => onEdit(compliance?.complianceId)}
          disabled={!compliance}
        >
          <FaEdit /> Edit
        </Button>
        {/* <Button 
          variant="danger" 
          onClick={() => onDelete(compliance?.complianceId)}
          disabled={!compliance}
        >
          <FaTrash /> Delete
        </Button> */}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewComplianceDetails;
