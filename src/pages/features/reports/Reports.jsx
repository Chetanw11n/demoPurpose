import React, { useState } from 'react';
import ReportDashboard from './ReportDashboard';
import CustomReportGenerator from './CustomReportGenerator';
import FullAnalytics from './FullAnalytics';
import './Reports.css';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="reports-container">
      <h2>Reports & Analytics</h2>

      {/* ✅ TAB BUTTONS */}
      <div className="tab-navbar">
        <button
          className={activeTab === 'dashboard' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>

        <button
          className={activeTab === 'custom' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('custom')}
        >
          Custom Report
        </button>

        <button
          className={activeTab === 'analytics' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('analytics')}
        >
          Program Analytics
        </button>
      </div>

      {/* ✅ IMPORTANT FIX — ONLY ONE SHOWS */}
      <div className="tab-content">
        {activeTab === 'dashboard' && <ReportDashboard />}
        {activeTab === 'custom' && <CustomReportGenerator />}
        {activeTab === 'analytics' && <FullAnalytics />}
      </div>
    </div>
  );
};

export default Reports;
