import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Spinner, Alert } from "react-bootstrap";
import { getAllAudits, getAuditById, deleteAudit } from "../../../axios/audits_api";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ViewAuditDetails from "./ViewAuditDetails";
import EditAuditModal from "./EditAuditModal";
import CreateAuditModal from "./CreateAuditModal";
import "./auditsList.css";

const AuditsList = () => {
  const [auditsData, setAuditsData] = useState([]);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAudits = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllAudits();
      console.log("Audits data fetched:", response.data);
      setAuditsData(response.data);
    } catch (err) {
      console.error("Error fetching audits:", err);
      setError("Failed to fetch audits data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAuditById(id);
      console.log("Audit details:", response.data);
      setSelectedAudit(response.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("Error fetching audit details:", err);
      setError("Failed to fetch audit details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (id) => {
    setLoading(true);
    try {
      const response = await getAuditById(id);
      setSelectedAudit(response.data);
      setShowViewModal(false);
      setShowEditModal(true);
    } catch (err) {
      console.error("Error fetching audit for edit:", err);
      setError("Failed to load audit for editing");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this audit?")) {
      try {
        await deleteAudit(id);
        setError(null);
        fetchAudits();
      } catch (err) {
        console.error("Error deleting audit:", err);
        setError("Failed to delete audit");
      }
    }
  };

  const handleEditSuccess = () => {
    fetchAudits();
  };

  const handleCreateSuccess = () => {
    fetchAudits();
  };

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

  useEffect(() => {
    fetchAudits();
  }, []);

  if (loading && auditsData.length === 0) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="audits-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Audits</h2>
        <Button 
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Audit
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead className="table-header">
          <tr>
            <th>ID</th>
            <th>Scope</th>
            <th>Status</th>
            <th>Officer ID</th>
            <th>Started Date</th>
            <th>Closed Date</th>
            <th>Findings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {auditsData.map((audit) => (
            <tr key={audit.id}>
              <td>{audit.id}</td>
              <td>{audit.scope}</td>
              <td>
                <Badge bg={getStatusBadgeVariant(audit.status)}>
                  {audit.status}
                </Badge>
              </td>
              <td>{audit.officer_id}</td>
              <td>{formatDate(audit.startedAt)}</td>
              <td>{formatDate(audit.closedAt)}</td>
              <td>{audit.findings || "N/A"}</td>
              <td className="action-buttons">
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleViewDetails(audit.id)}
                  title="View Details"
                >
                  <FaEye /> View
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditClick(audit.id)}
                  title="Edit"
                >
                  <FaEdit /> Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(audit.id)}
                  title="Delete"
                >
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ViewAuditDetails
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        auditId={selectedAudit?.id}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <EditAuditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        auditData={selectedAudit}
        onSuccess={handleEditSuccess}
      />

      <CreateAuditModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default AuditsList;
