import React, { useEffect, useState } from 'react';
import { getOperationalDashboard } from '../../../axios/report_analytics_api';
import './ReportDashboard.css';

const ReportDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getOperationalDashboard();

      // ✅ IMPORTANT FIX (Map response)
      setDashboard(res.data);
    } catch (err) {
      setError(
        err?.message || 'Failed to fetch dashboard. Check backend at 8081'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  if (error)
    return (
      <div className="error-section">
        <div className="error">{error}</div>
        <button className="retry-btn" onClick={fetchDashboard}>
          Retry
        </button>
      </div>
    );

  return (
    <div className="report-dashboard">
      <div className="dashboard-header">
        <h3>Operational Dashboard</h3>
        <button className="refresh-btn" onClick={fetchDashboard}>
          Refresh
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Active Routes</h4>
          <p className="metric-value">{dashboard?.activeRoutes}</p>
        </div>

        <div className="metric-card">
          <h4>Total Tickets</h4>
          <p className="metric-value">{dashboard?.totalTickets}</p>
        </div>

        <div className="metric-card">
          <h4>Compliance Alerts</h4>
          <p className="metric-value">{dashboard?.complianceAlerts}</p>
        </div>

        <div className="metric-card">
          <h4>Program Efficiency</h4>
          <p className="metric-value">
            {dashboard?.programEfficiency?.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;