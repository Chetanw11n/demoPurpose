import React, { useEffect, useState } from "react";
import { Table, Button, Alert, Spinner, Form, Row, Col } from "react-bootstrap";
import { getAllCompliance, getComplianceById, deleteCompliance, getComplianceByType } from "../../../axios/compliance_audit";
import { FaEye, FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import ViewComplianceDetails from "./ViewComplianceDetails";
import EditComplianceModal from "./EditComplianceModal";
import CreateComplianceModal from "./CreateComplianceModal";
import "./complianceList.css";

const COMPLIANCE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'ROUTE', label: 'Route' },
  { value: 'TICKET', label: 'Ticket' },
  { value: 'PROGRAM', label: 'Program' }
];

const ComplianceList = () => {
  const [complianceData, setComplianceData] = useState([]);
  const [selectedCompliance, setSelectedCompliance] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('');

  const fetchComplianceData = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (filterType) {
        response = await getComplianceByType(filterType);
      } else {
        response = await getAllCompliance();
      }
      console.log("Compliance data fetched:", response.data);
      setComplianceData(response.data);
    } catch (err) {
      console.error("Error fetching compliance data:", err);
      setError("Failed to fetch compliance data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getComplianceById(id);
      console.log("Compliance details:", response.data);
      setSelectedCompliance(response.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("Error fetching compliance details:", err);
      setError("Failed to fetch compliance details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (id) => {
    setLoading(true);
    try {
      const response = await getComplianceById(id);
      setSelectedCompliance(response.data);
      setShowViewModal(false);
      setShowEditModal(true);
    } catch (err) {
      console.error("Error fetching compliance for edit:", err);
      setError("Failed to load compliance for editing");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this compliance record?")) {
      try {
        await deleteCompliance(id);
        setError(null);
        fetchComplianceData();
      } catch (err) {
        console.error("Error deleting compliance:", err);
        setError("Failed to delete compliance record");
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleEditSuccess = () => {
    fetchComplianceData();
  };

  const handleCreateSuccess = () => {
    fetchComplianceData();
  };

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

  useEffect(() => {
    fetchComplianceData();
  }, [filterType]);

  if (loading && complianceData.length === 0) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="compliance-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Compliance Audits</h2>
        <Button 
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          Add New Compliance
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filter Section */}
      <div className="filter-section mb-4">
        <Row className="align-items-end">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold">
                <FaFilter className="me-2" />
                Filter by Entity Type
              </Form.Label>
              <Form.Select
                value={filterType}
                onChange={handleFilterChange}
                className="filter-select"
              >
                {COMPLIANCE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={8} className="text-end">
            <small className="text-muted">
              Total Records: <strong>{complianceData.length}</strong>
            </small>
          </Col>
        </Row>
      </div>

      {complianceData.length === 0 ? (
        <Alert variant="info">
          No compliance records found{filterType ? ` for type: ${filterType}` : ''}
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover responsive>
            <thead className="table-header">
              <tr>
                <th>ID</th>
                <th>Entity Type</th>
                <th>Result</th>
                <th>Compliance Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complianceData.map((compliance) => (
                <tr key={compliance.complianceId}>
                  <td>{compliance.complianceId}</td>
                  <td>
                    <span className={`badge bg-${getTypeColorBadge(compliance.type)}`}>
                      {compliance.type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${getResultBadgeVariant(compliance.result)}`}>
                      {compliance.result}
                    </span>
                  </td>
                  <td>{new Date(compliance.complianceDate).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewDetails(compliance.complianceId)}
                      title="View Details"
                    >
                      <FaEye /> View
                    </Button>
                    <Button 
                      variant="warning" 
                      size="sm" 
                      onClick={() => handleEditClick(compliance.complianceId)}
                      title="Edit"
                    >
                      <FaEdit /> Edit
                    </Button>
                    {/* <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDeleteClick(compliance.complianceId)}
                      title="Delete"
                    >
                      <FaTrash /> Delete
                    </Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <ViewComplianceDetails
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        complianceId={selectedCompliance?.complianceId}
        compliance={selectedCompliance}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <EditComplianceModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        complianceData={selectedCompliance}
        onSuccess={handleEditSuccess}
      />

      <CreateComplianceModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

const getTypeColorBadge = (type) => {
  switch (type) {
    case 'ROUTE':
      return 'primary';
    case 'TICKET':
      return 'success';
    case 'PROGRAM':
      return 'warning';
    default:
      return 'secondary';
  }
};

export default ComplianceList;