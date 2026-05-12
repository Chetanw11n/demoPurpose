//compliance Audit api calls// compliance-audits.api.js
import api from '../config/axios.config';

/* ================= COMPLIANCE AUDITS APIs ================= */

export const getAllCompliance = () =>
  api.get('/compliance/');

export const getComplianceById = (id) =>
  api.get(`/compliance/${id}`);

export const getComplianceByType = (type) =>
  api.get(`/compliance/type/${type}`);

export const createCompliance = (complianceData) =>
  api.post('/compliance/save', complianceData);

export const updateCompliance = (id, complianceData) =>
  api.put(`/compliance/update/${id}`, complianceData);

export const deleteCompliance = (id) =>
  api.delete(`/compliance/delete/${id}`);

export const getComplianceByEntityId = (entityId) =>
  api.get(`/compliance/getByEntity/${entityId}`);

export const getComplianceSummary = () =>
  api.get('/compliance/summary');
