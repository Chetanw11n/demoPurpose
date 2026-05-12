import React, { useState } from 'react'
import { toast } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fix the errors below')
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Message sent successfully! We will contact you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <section className="py-5" style={{background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)'}}>
        <div className="container text-white">
          <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
          <p className="lead">We're here to help. Reach out to us with any questions or feedback.</p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body">
                  <h3 className="text-primary mb-3">📞</h3>
                  <h5 className="card-title">Phone</h5>
                  <p className="card-text">
                    <a href="tel:+919876543210" className="text-decoration-none">
                      +91 98765 43210
                    </a>
                  </p>
                  <small className="text-muted">Available 24/7</small>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body">
                  <h3 className="text-primary mb-3">📧</h3>
                  <h5 className="card-title">Email</h5>
                  <p className="card-text">
                    <a href="mailto:support@transpogov.com" className="text-decoration-none">
                      support@transpogov.com
                    </a>
                  </p>
                  <small className="text-muted">Response within 24 hours</small>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body">
                  <h3 className="text-primary mb-3">📍</h3>
                  <h5 className="card-title">Address</h5>
                  <p className="card-text small">
                    TranspoGov Headquarters,<br />
                    Transport Building,<br />
                    New Delhi, India
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body">
                  <h3 className="text-primary mb-3">🕐</h3>
                  <h5 className="card-title">Hours</h5>
                  <p className="card-text small">
                    Mon - Fri: 9:00 AM - 6:00 PM<br />
                    Sat - Sun: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-5">
            {/* Contact Form */}
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4 text-primary">Send us a Message</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.name && (
                    <div className="invalid-feedback d-block">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label fw-semibold">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback d-block">{errors.phone}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label fw-semibold">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className={`form-control form-control-lg ${errors.subject ? 'is-invalid' : ''}`}
                    placeholder="Message subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.subject && (
                    <div className="invalid-feedback d-block">{errors.subject}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="form-label fw-semibold">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className={`form-control form-control-lg ${errors.message ? 'is-invalid' : ''}`}
                    placeholder="Your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                  ></textarea>
                  {errors.message && (
                    <div className="invalid-feedback d-block">{errors.message}</div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-100 fw-semibold"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Additional Information */}
            <div className="col-lg-6">
              <div className="bg-light p-5 rounded-lg h-100">
                <h3 className="fw-bold mb-4 text-primary">Get in Touch</h3>
                
                <div className="mb-4">
                  <h5 className="fw-bold text-primary mb-2">Customer Support</h5>
                  <p className="text-muted">For general inquiries and customer support, contact our support team.</p>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold text-primary mb-2">Technical Support</h5>
                  <p className="text-muted">For technical issues and system problems, reach our technical team.</p>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold text-primary mb-2">Partnership & Business</h5>
                  <p className="text-muted">Interested in partnership opportunities? Contact our business team.</p>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold text-primary mb-2">Feedback</h5>
                  <p className="text-muted">We value your feedback and suggestions to improve our services.</p>
                </div>

                <hr />

                <h5 className="fw-bold text-primary mb-3">Follow Us</h5>
                <div className="d-flex gap-3">
                  <a href="#" className="btn btn-outline-primary btn-sm">
                    <i className="fab fa-facebook"></i> Facebook
                  </a>
                  <a href="#" className="btn btn-outline-primary btn-sm">
                    <i className="fab fa-twitter"></i> Twitter
                  </a>
                  <a href="#" className="btn btn-outline-primary btn-sm">
                    <i className="fab fa-linkedin"></i> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5 text-primary">Frequently Asked Questions</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      What are your business hours?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      We are open Monday to Friday from 9:00 AM to 6:00 PM, and Saturday to Sunday from 10:00 AM to 4:00 PM.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      How can I track my support ticket?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      After submitting a support request, you will receive a ticket ID via email that you can use to track your case.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      What payment methods do you accept?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      We accept credit cards, debit cards, digital wallets, and cash payments through our integrated payment gateway.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                      How do I report a technical issue?
                    </button>
                  </h2>
                  <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      You can report technical issues using our contact form, email us directly, or call our technical support team.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
