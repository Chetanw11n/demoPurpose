import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

const Home = () => {
  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-5" style={{background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)'}}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4">TranspoGov</h1>
              <p className="lead mb-4">
                Transform your city's public transport with intelligent governance, seamless citizen engagement, and real-time compliance monitoring.
              </p>
              <div className="d-flex gap-3">
                <Link to="/login" className="btn btn-light btn-lg fw-bold">
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg fw-bold">
                  Register
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <div className="bg-white bg-opacity-10 p-5 rounded-lg">
                  <h3 className="mb-3">🚌 Smart Public Transport</h3>
                  <p>Real-time route tracking, intelligent ticketing, and seamless mobility solutions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5 text-primary">Why Choose TranspoGov?</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body">
                  <h3 className="text-primary mb-3">📱</h3>
                  <h5 className="card-title">Easy Ticketing</h5>
                  <p className="card-text small">Book and manage transport tickets with just a few clicks.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body">
                  <h3 className="text-primary mb-3">🗺️</h3>
                  <h5 className="card-title">Route Tracking</h5>
                  <p className="card-text small">Real-time tracking and schedule updates for all routes.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body">
                  <h3 className="text-primary mb-3">💰</h3>
                  <h5 className="card-title">Transparent Pricing</h5>
                  <p className="card-text small">Clear and fair fare structure with multiple payment options.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body">
                  <h3 className="text-primary mb-3">✅</h3>
                  <h5 className="card-title">Compliance</h5>
                  <p className="card-text small">Ensures all transport operations meet regulatory standards.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Portals */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center fw-bold mb-5 text-primary">Tailored Solutions for Every Role</h2>
          <div className="row g-4">
            {/* Citizen Portal */}
            <div className="col-lg-6">
              <div className="card shadow-sm h-100 border-start border-primary border-5">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <h3 className="mb-0">👤</h3>
                    <h5 className="card-title ms-3 mb-0">Citizen Portal</h5>
                  </div>
                  <p className="card-text mb-3">Access all transport services and manage your journey with ease.</p>
                  <ul className="list-unstyled mb-3">
                    <li className="mb-2">✓ Book and track tickets</li>
                    <li className="mb-2">✓ View available routes</li>
                    <li className="mb-2">✓ Receive real-time alerts</li>
                    <li className="mb-2">✓ Manage your profile</li>
                  </ul>
                  <Link to="/login" className="btn btn-primary btn-sm">
                    Access Portal
                  </Link>
                </div>
              </div>
            </div>

            {/* Officer Dashboard */}
            <div className="col-lg-6">
              <div className="card shadow-sm h-100 border-start border-success border-5">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <h3 className="mb-0">🚔</h3>
                    <h5 className="card-title ms-3 mb-0">Officer Dashboard</h5>
                  </div>
                  <p className="card-text mb-3">Manage routes, validate operations, and monitor compliance.</p>
                  <ul className="list-unstyled mb-3">
                    <li className="mb-2">✓ Manage routes & schedules</li>
                    <li className="mb-2">✓ Validate tickets</li>
                    <li className="mb-2">✓ Track compliance</li>
                    <li className="mb-2">✓ Generate reports</li>
                  </ul>
                  <Link to="/login" className="btn btn-success btn-sm">
                    Access Portal
                  </Link>
                </div>
              </div>
            </div>

            {/* Manager Console */}
            <div className="col-lg-6">
              <div className="card shadow-sm h-100 border-start border-info border-5">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <h3 className="mb-0">📊</h3>
                    <h5 className="card-title ms-3 mb-0">Manager Console</h5>
                  </div>
                  <p className="card-text mb-3">Oversee transport programs and optimize resource allocation.</p>
                  <ul className="list-unstyled mb-3">
                    <li className="mb-2">✓ Monitor budgets</li>
                    <li className="mb-2">✓ Track performance</li>
                    <li className="mb-2">✓ Analyze metrics</li>
                    <li className="mb-2">✓ Manage resources</li>
                  </ul>
                  <Link to="/login" className="btn btn-info btn-sm">
                    Access Portal
                  </Link>
                </div>
              </div>
            </div>

            {/* Admin Panel */}
            <div className="col-lg-6">
              <div className="card shadow-sm h-100 border-start border-danger border-5">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <h3 className="mb-0">⚙️</h3>
                    <h5 className="card-title ms-3 mb-0">Admin Panel</h5>
                  </div>
                  <p className="card-text mb-3">Configure system workflows and manage all user accounts.</p>
                  <ul className="list-unstyled mb-3">
                    <li className="mb-2">✓ User management</li>
                    <li className="mb-2">✓ System configuration</li>
                    <li className="mb-2">✓ Audit logs</li>
                    <li className="mb-2">✓ System monitoring</li>
                  </ul>
                  <Link to="/login" className="btn btn-danger btn-sm">
                    Access Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-5" style={{background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)'}}>
        <div className="container">
          <div className="row text-white text-center g-4">
            <div className="col-md-3">
              <h2 className="fw-bold">300K+</h2>
              <p>Concurrent Users</p>
            </div>
            <div className="col-md-3">
              <h2 className="fw-bold">99.9%</h2>
              <p>Uptime SLA</p>
            </div>
            <div className="col-md-3">
              <h2 className="fw-bold">24/7</h2>
              <p>Support</p>
            </div>
            <div className="col-md-3">
              <h2 className="fw-bold">8</h2>
              <p>Core Modules</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center fw-bold mb-5 text-primary">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3 text-center">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px', margin: '0 auto'}}>
                1
              </div>
              <h5 className="fw-bold">Register</h5>
              <p className="small">Create your account and verify your identity.</p>
            </div>
            <div className="col-md-6 col-lg-3 text-center">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px', margin: '0 auto'}}>
                2
              </div>
              <h5 className="fw-bold">Browse Routes</h5>
              <p className="small">Explore available transport routes and schedules.</p>
            </div>
            <div className="col-md-6 col-lg-3 text-center">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px', margin: '0 auto'}}>
                3
              </div>
              <h5 className="fw-bold">Book Ticket</h5>
              <p className="small">Select your route and book your ticket easily.</p>
            </div>
            <div className="col-md-6 col-lg-3 text-center">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px', margin: '0 auto'}}>
                4
              </div>
              <h5 className="fw-bold">Travel</h5>
              <p className="small">Travel with confidence and track your journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Get Started with TranspoGov Today</h2>
          <p className="fs-5 mb-4">Join thousands of users transforming urban mobility.</p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/register" className="btn btn-light btn-lg fw-bold">
              Create Account
            </Link>
            <Link to="/about" className="btn btn-outline-light btn-lg fw-bold">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
