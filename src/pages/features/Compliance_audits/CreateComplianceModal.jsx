import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { createCompliance } from "../../../axios/compliance_audit";

const CreateComplianceModal = ({ show, onHide, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: "",
    entityId: "",
    result: "",
    notes: "",
    complianceDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      await createCompliance(formData);
      console.log("Compliance created successfully");
      setSuccess(true);
      setTimeout(() => {
        setFormData({
          type: "",
          entityId: "",
          result: "",
          notes: "",
          complianceDate: ""
        });
        onSuccess();
        onHide();
      }, 1500);
    } catch (err) {
      console.error("Error creating compliance:", err);
      setError("Failed to create compliance record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Compliance Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Compliance record created successfully!</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Type</option>
              <option value="PROGRAM">PROGRAM</option>
              <option value="TICKET">TICKET</option>
              <option value="ROUTE">ROUTE</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Entity ID</Form.Label>
            <Form.Control
              type="number"
              name="entityId"
              value={formData.entityId}
              onChange={handleInputChange}
              placeholder="Enter entity ID..."
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Result</Form.Label>
            <Form.Select
              name="result"
              value={formData.result}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Result</option>
              <option value="COMPLIANT">COMPLIANT</option>
              <option value="NON_COMPLIANT">NON COMPLIANT</option>
              <option value="FAIL">FAIL</option>
              <option value="OBSERVATION">OBSERVATION</option>
              <option value="NA">NA</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Compliance Date</Form.Label>
            <Form.Control
              type="date"
              name="complianceDate"
              value={formData.complianceDate}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={5}
              placeholder="Enter compliance notes..."
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
                "Create Compliance"
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

export default CreateComplianceModal;
