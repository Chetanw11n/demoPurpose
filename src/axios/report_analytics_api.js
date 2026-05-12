//report api calls

import api from '../config/axios.config';
 
/* ================= REPORT APIs ================= */
 
// ✅ GET Dashboard
export const getOperationalDashboard = async () => {
  try {
    return await api.get('/report/operations');
  } catch (error) {
    console.error('Dashboard API error:', error);
    throw error.response?.data || error;
  }
};
 
// ✅ POST Run Report
export const runCustomReport = async (scope) => {
  try {
    return await api.post('/report/custom/run', { scope });
  } catch (error) {
    console.error('Run report API error:', error);
    throw error.response?.data || error;
  }
};
 
// ✅ GET Job Status
export const getJobStatus = async (jobId) => {
  try {
    return await api.get(`/report/custom/jobs/${jobId}`);
  } catch (error) {
    console.error('Job status API error:', error);
    throw error.response?.data || error;
  }
};
// ✅ FULL ANALYTICS API
export const getFullAnalytics = async (programId) => {
  try {
    return await api.get(`/report/full-analytics/${programId}`);
  } catch (error) {
    console.error('Full Analytics API error:', error);
    throw error;
  }
};
 
 