import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
 
export const About = () => {
  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">TranspoGov</h1>
          <p className="lead">
            Public Transport & Mobility Governance System
          </p>
          <p className="fs-5">
            A comprehensive web-based platform for managing public transport systems, urban mobility programs, and governance compliance.
          </p>
        </div>
      </section>
 
      {/* Introduction */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-4 fw-bold text-primary">About TranspoGov</h2>
          <div className="row">
            <div className="col-lg-8">
              <p className="fs-5 mb-3">
                TranspoGov is a comprehensive web-based platform designed for transport departments, municipalities, and government agencies to manage public transport systems, urban mobility programs, and compliance. It enables citizens to access transport services, administrators to oversee operations, and officers to monitor compliance with transport policies.
              </p>
              <p className="fs-5 mb-3">
                The system supports workflows for citizen registration, route and schedule management, ticketing, resource allocation, compliance monitoring, and analytics. It ensures transparency and accountability by maintaining audit trails, dashboards, and performance metrics across transport governance.
              </p>
            </div>
            <div className="col-lg-4">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Key Capabilities</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Citizen Registration & Ticketing</li>
                    <li className="mb-2">✓ Route & Schedule Management</li>
                    <li className="mb-2">✓ Resource Allocation</li>
                    <li className="mb-2">✓ Compliance Monitoring</li>
                    <li className="mb-2">✓ Advanced Analytics</li>
                    <li className="mb-2">✓ Audit Trails</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* User Roles */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="mb-4 fw-bold text-primary">User Roles</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">👤 Citizen/Passenger</h5>
                  <p className="card-text small">Registers, books tickets, and tracks transport services.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">🚔 Transport Officer</h5>
                  <p className="card-text small">Manages routes, validates schedules, and monitors compliance.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">📊 Program Manager</h5>
                  <p className="card-text small">Oversees programs, monitors budgets, and tracks performance.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">⚙️ Administrator</h5>
                  <p className="card-text small">Configures workflows, manages users, and oversees reporting.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">✅ Compliance Officer</h5>
                  <p className="card-text small">Ensures policy adherence, audits records, and monitors compliance.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">📋 Government Auditor</h5>
                  <p className="card-text small">Reviews compliance reports and monitors program utilization.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Modules */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-4 fw-bold text-primary">Core Modules</h2>
          <div className="row g-3">
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-primary fw-bold">Identity & Access Management</h6>
                  <p className="card-text small">Secure authentication and role-based access control with audit logging.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-primary fw-bold">Citizen Registration</h6>
                  <p className="card-text small">Citizen profile management and transport document validation.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-primary fw-bold">Route & Schedule Management</h6>
                  <p className="card-text small">Manage transport routes and define schedules with real-time tracking.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-primary fw-bold">Ticketing & Fare Collection</h6>
                  <p className="card-text small">Online ticket booking, validation, and fare collection tracking.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-primary fw-bold">Transport Programs</h6>
                  <p className="card-text small">Manage programs, resources, and monitor program outcomes.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-primary fw-bold">Compliance & Audit</h6>
                  <p className="card-text small">Policy adherence tracking and comprehensive audit management.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-primary fw-bold">Reporting & Analytics</h6>
                  <p className="card-text small">Advanced dashboards and analytics for transport program efficiency.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-primary fw-bold">Notifications & Alerts</h6>
                  <p className="card-text small">Real-time alerts for route changes, tickets, and compliance updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Architecture */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="mb-4 fw-bold text-primary">Technical Architecture</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">Frontend</h5>
                  <p className="card-text">React for responsive dashboards and intuitive user interfaces.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">Backend</h5>
                  <p className="card-text">REST API-based microservices with Spring Boot or ASP.NET Core.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">Database</h5>
                  <p className="card-text">Relational databases (MySQL, PostgreSQL, SQL Server).</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">Deployment</h5>
                  <p className="card-text">Cloud or on-premise with API Gateway, WAF, and centralized logging.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Non-Functional Requirements */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-4 fw-bold text-primary">Performance & Scalability</h2>
          <div className="row">
            <div className="col-md-6">
              <div className="list-group">
                <div className="list-group-item border-0 mb-3">
                  <h6 className="text-primary fw-bold">📈 Performance</h6>
                  <p className="small mb-0">Handles 300,000 concurrent users across transport networks.</p>
                </div>
                <div className="list-group-item border-0 mb-3">
                  <h6 className="text-primary fw-bold">🔐 Security</h6>
                  <p className="small mb-0">Role-based access, encrypted data storage, and immutable audit logs.</p>
                </div>
                <div className="list-group-item border-0 mb-3">
                  <h6 className="text-primary fw-bold">📊 Scalability</h6>
                  <p className="small mb-0">Supports nationwide rollout across multiple transport programs.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="list-group">
                <div className="list-group-item border-0 mb-3">
                  <h6 className="text-primary fw-bold">⏱️ Availability</h6>
                  <p className="small mb-0">99.9% uptime SLA with redundant infrastructure.</p>
                </div>
                <div className="list-group-item border-0 mb-3">
                  <h6 className="text-primary fw-bold">🔧 Maintainability</h6>
                  <p className="small mb-0">Modular microservices with API versioning and automated migrations.</p>
                </div>
                <div className="list-group-item border-0 mb-3">
                  <h6 className="text-primary fw-bold">📡 Observability</h6>
                  <p className="small mb-0">Centralized logging with KPIs for ticketing, routes, and compliance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Footer CTA */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="mb-3">Ready to Transform Urban Mobility?</h2>
          <p className="fs-5 mb-4">Join TranspoGov and streamline your transport governance today.</p>
          <a href="/register" className="btn btn-light btn-lg fw-bold">Get Started</a>
        </div>
      </section>
    </div>
  );
};
 
 