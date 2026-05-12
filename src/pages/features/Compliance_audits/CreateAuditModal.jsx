import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { createAudit } from "../../../axios/audits_api";
import { decodeJwt } from "../../../services/AuthService";

const CreateAuditModal = ({ show, onHide, onSuccess }) => {
  const [formData, setFormData] = useState({
    scope: "",
    officerId: "",
    findings: "" // Add findings field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded && decoded.id) {
        setFormData((prev) => ({
          ...prev,
          officerId: decoded.id // Set officerId from the decoded JWT
        }));
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.findings.trim()) {
      setError("Findings must not be blank");
      setLoading(false);
      return;
    }

    try {
      await createAudit(formData);
      console.log("Audit created successfully");
      setSuccess(true);
      setTimeout(() => {
        setFormData({
          scope: "",
          officerId: "",
          findings: "" // Reset findings field
        });
        onSuccess();
        onHide();
      }, 1500);
    } catch (err) {
      console.error("Error creating audit:", err);
      setError("Failed to create audit record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="md">
      <Modal.Header closeButton>
        <Modal.Title>Create New Audit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Audit record created successfully!</Alert>}

        <Form onSubmit={handleSubmit}>
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

          {/* <Form.Group className="mb-3">
            <Form.Label>Officer ID</Form.Label>
            <Form.Control
              type="number"
              name="officerId"
              value={formData.officerId}
              onChange={handleInputChange}
              placeholder="Enter officer ID..."
              required
              disabled // Disable manual editing of officerId
            />
          </Form.Group> */}

          <Form.Group className="mb-3">
            <Form.Label>Findings</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="findings"
              value={formData.findings}
              onChange={handleInputChange}
              placeholder="Enter findings..."
              required
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
                  Creating...
                </>
              ) : (
                "Create Audit"
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

export default CreateAuditModal;
