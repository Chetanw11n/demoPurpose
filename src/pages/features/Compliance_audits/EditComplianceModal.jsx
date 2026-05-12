import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { updateCompliance } from "../../../axios/compliance_audit";

const EditComplianceModal = ({ show, onHide, complianceData, onSuccess }) => {
  const [formData, setFormData] = useState({
    result: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (complianceData) {
      setFormData({
        result: complianceData.result || "",
        notes: complianceData.notes || ""
      });
      setError(null);
      setSuccess(false);
    }
  }, [complianceData, show]);

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
      await updateCompliance(complianceData.complianceId, formData);
      console.log("Compliance updated successfully");
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onHide();
      }, 1500);
    } catch (err) {
      console.error("Error updating compliance:", err);
      setError("Failed to update compliance record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Compliance Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Compliance record updated successfully!</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Compliance ID</Form.Label>
            <Form.Control
              type="text"
              value={complianceData?.complianceId || ""}
              disabled
              readOnly
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

export default EditComplianceModal;
