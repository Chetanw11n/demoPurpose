// audits.api.js
import api from '../config/axios.config';

/* ================= AUDITS APIs ================= */

export const getAllAudits = () =>
  api.get('/audit/');

export const getAuditById = (id) =>
  api.get(`/audit/${id}`);

export const createAudit = (auditData) =>
  api.post('/audit/', auditData);

export const updateAudit = (id, auditData) =>
  api.patch(`/audit/update/${id}`, auditData);

export const deleteAudit = (id) =>
  api.delete(`/audit/${id}`);

export const getAuditsByOfficer = (officerId) =>
  api.get(`/audit/officer/${officerId}`);

export const getAuditsByStatus = (status) =>
  api.get('/audit/', {
    params: { status }
  });
