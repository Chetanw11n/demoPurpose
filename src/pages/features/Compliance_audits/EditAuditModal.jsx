import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { updateAudit } from "../../../axios/audits_api";

const EditAuditModal = ({ show, onHide, auditData, onSuccess }) => {
  const [formData, setFormData] = useState({
    scope: "",
    status: "",
    findings: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (auditData) {
      setFormData({
        scope: auditData.scope || "",
        status: auditData.status || "",
        findings: auditData.findings || ""
      });
      setError(null);
      setSuccess(false);
    }
  }, [auditData, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateAudit(auditData.id, formData);
      console.log("Audit updated successfully");
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onHide();
      }, 1500);
    } catch (err) {
      console.error("Error updating audit:", err);
      setError("Failed to update audit record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Audit Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Audit record updated successfully!</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Audit ID</Form.Label>
            <Form.Control
              type="text"
              value={auditData?.id || ""}
              disabled
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Scope</Form.Label>
            <Form.Select
              name="scope"
              value={formData.scope}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Scope</option>
              <option value="PROGRAM">PROGRAM</option>
              <option value="TICKET">TICKET</option>
              <option value="ROUTE">ROUTE</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Status</option>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DELETED">DELETED</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Findings</Form.Label>
            <Form.Control
              as="textarea"
              name="findings"
              value={formData.findings}
              onChange={handleInputChange}
              rows={5}
              placeholder="Enter audit findings..."
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditAuditModal;
