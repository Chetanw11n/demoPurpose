import React, { useState } from 'react';
import { getFullAnalytics } from '../../../axios/report_analytics_api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './FullAnalytics.css';
 
const COLORS = ['#4CAF50', '#2196F3', '#FFC107'];
 
const FullAnalytics = () => {
 
  const [programId, setProgramId] = useState('');
  const [data, setData] = useState(null);
 
  const fetchData = async () => {
    try {
      const res = await getFullAnalytics(programId);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };
 
  const coreData = data ? [
    { name: 'Routes', value: data.activeRoutes },
    { name: 'Tickets', value: data.totalTickets },
    { name: 'Alerts', value: data.complianceAlerts }
  ] : [];
 
  const efficiencyData = data ? [
    { name: 'Ticket/Route', value: data.ticketPerRoute },
    { name: 'Resource %', value: data.resourceEfficiency },
    { name: 'Budget %', value: data.budgetEfficiency }
  ] : [];
 
  return (
    <div className="analytics-page">
 
      {/* HEADER */}
      <div className="analytics-header">
        <h2>📊 Program Analytics Dashboard</h2>
 
        <div className="input-group">
          <input
            type="number"
            placeholder="Enter Program ID"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
          />
          <button onClick={fetchData}>Fetch</button>
        </div>
      </div>
 
      {data && (
        <>
          {/* ✅ CARDS */}
          <div className="cards">
            <div className="card blue">
              <h4>Active Routes</h4>
              <p>{data.activeRoutes}</p>
            </div>
 
            <div className="card green">
              <h4>Total Tickets</h4>
              <p>{data.totalTickets}</p>
            </div>
 
            <div className="card orange">
              <h4>Compliance Alerts</h4>
              <p>{data.complianceAlerts}</p>
            </div>
          </div>
 
          {/* ✅ TABLE */}
          <div className="section">
            <h3>📋 Program Utilization</h3>
            <table>
              <tbody>
                <tr><td>Title</td><td>{data.programUtilization.title}</td></tr>
                <tr><td>Allocated Budget</td><td>{data.programUtilization.allocatedBudget}</td></tr>
                <tr><td>Used Budget</td><td>{data.programUtilization.utilizedBudget}</td></tr>
                <tr><td>Remaining Budget</td><td>{data.programUtilization.remainingBudget}</td></tr>
                <tr><td>Budget Utilization %</td><td>{data.programUtilization.budgetUtilizationPercentage}</td></tr>
              </tbody>
            </table>
          </div>
 
          {/* ✅ CHART GRID */}
          <div className="chart-grid">
 
            <div className="chart-box">
              <h3>📊 Efficiency</h3>
              <BarChart width={500} height={300} data={efficiencyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2196F3" />
              </BarChart>
            </div>
 
            <div className="chart-box">
              <h3>🥧 Distribution</h3>
              <PieChart width={400} height={300}>
                <Pie data={coreData} dataKey="value" outerRadius={100}>
                  {coreData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </div>
 
          </div>
        </>
      )}
    </div>
  );
};
 
export default FullAnalytics;
 
 