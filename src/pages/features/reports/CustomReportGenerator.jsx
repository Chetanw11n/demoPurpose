import React, { useState } from 'react';
import {
  runCustomReport,
  getJobStatus,
} from '../../../axios/report_analytics_api';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import './CustomReportGenerator.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomReportGenerator = () => {
  const [scope, setScope] = useState('ROUTE');
  const [report, setReport] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [error, setError] = useState('');

  const scopes = ['ROUTE', 'TICKET', 'PROGRAM', 'COMPLIANCE'];

  // ✅ Generate Report
  const handleGenerate = async () => {
    try {
      setError('');
     const res = await runCustomReport(scope);

// ✅ ONLY SAVE jobId
setJobId(res.data.reportId);

// ✅ CLEAR previous report
setReport(null);

    } catch (err) {
      setError(err?.message || 'Error generating report');
    }
  };

  // ✅ Check Status
  const handleStatus = async () => {
    try {
      const res = await getJobStatus(jobId);
      setReport(res.data);
    } catch (err) {
      setError(err?.message || 'Error checking status');
    }
  };

  // ✅ Convert metrics JSON → object
  const getMetricsObject = () => {
    try {
      return report?.metrics ? JSON.parse(report.metrics) : {};
    } catch {
      return {};
    }
  };

  const metrics = getMetricsObject();

  // ✅ Convert metrics → chart format
  const chartData = Object.keys(metrics).map((key) => ({
    name: key,
    value: metrics[key],
  }));

  return (
    <div className="custom-report-generator">
      <h3>Generate Custom Report</h3>

      {/* SELECT */}
      <select value={scope} onChange={(e) => setScope(e.target.value)}>
        
        {scopes.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      
{/* ✅ PLACE INPUT HERE (CORRECT) */}
<div style={{ marginTop: '10px' }}>
  <input
    type="number"
    placeholder="Enter Report ID"
    value={jobId || ''}
    onChange={(e) => setJobId(e.target.value)}
    style={{ padding: '6px', width: '200px' }}
  />
</div>


      {/* BUTTONS */}
      <div className="button-group">
        <button onClick={handleGenerate}>Generate</button>
        <button onClick={handleStatus} disabled={!jobId}>
          Check Status
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* SHOW WHEN REPORT IS JUST CREATED */}
      {jobId && !report && (
  <div className="report-result">
    <h4>Report Started</h4>
    <p><b>Job ID:</b> {jobId}</p>
    <p><b>Status:</b> IN_PROGRESS</p>
    <p>Click "Check Status" to load report...</p>
  </div>
)}
{/* SHOW FINAL REPORT */}
      {report && (
        <div className="report-result">
          <h4>Report Details</h4>

          <p><b>ID:</b> {report.reportId}</p>
          <p><b>Scope:</b> {report.scope}</p>
          <p><b>Status:</b> {report.status}</p>
          <p>
            <b>Date:</b>{' '}
            {new Date(report.generatedDate).toLocaleString()}
          </p>

          {/* ✅ TABLE VIEW */}
          <h4>Metrics Table</h4>
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(metrics).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ PIE CHART */}
          <h4>Metrics Pie Chart</h4>

          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

        </div>
      )}
    </div>
  );
};

export default CustomReportGenerator;