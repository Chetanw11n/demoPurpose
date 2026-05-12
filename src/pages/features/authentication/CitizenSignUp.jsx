import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaCalendar, FaMapMarker, FaVenusMars } from 'react-icons/fa';
import api from '../../../config/axios.config';
import './CitizenSignUp.css';

const CitizenSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Password validation rules
  const validatePassword = (password) => {
    const rules = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password)
    };
    return rules;
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dob = 'You must be at least 18 years old';
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else {
      const passwordRules = validatePassword(formData.password);
      if (!passwordRules.minLength || !passwordRules.hasUpperCase ||
          !passwordRules.hasLowerCase || !passwordRules.hasNumber ||
          !passwordRules.hasSpecialChar) {
        newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      const citizenData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        status: 'ACTIVE' // Default status for new citizens
      };

      const response = await api.post('/auth/citizen/signup', citizenData);

      if (response.status === 201) {
        toast.success('Registration successful! You can now login.');
        navigate('/login');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = validatePassword(formData.password);

  return (
    <div className="citizen-signup-container">
      <div className="citizen-signup-card">
        <div className="citizen-signup-header">
          <div className="logo-section">
            <FaUser className="logo-icon" />
          </div>
          <h2 className="signup-title">Join Transport Gov</h2>
          <p className="signup-subtitle">Create your citizen account</p>
        </div>

        <form onSubmit={handleSubmit} className="citizen-signup-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h4 className="section-title">Personal Information</h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="input-icon" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope className="input-icon" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaPhone className="input-icon" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength="10"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaCalendar className="input-icon" />
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  className={`form-input ${errors.dob ? 'error' : ''}`}
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={loading}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.dob && <span className="error-message">{errors.dob}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaVenusMars className="input-icon" />
                  Gender *
                </label>
                <select
                  name="gender"
                  className={`form-input ${errors.gender ? 'error' : ''}`}
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaMapMarker className="input-icon" />
                  Address *
                </label>
                <textarea
                  name="address"
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={loading}
                  rows="2"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
            </div>
          </div>

          {/* Account Security Section */}
          <div className="form-section">
            <h4 className="section-title">Account Security</h4>

            <div className="form-group">
              <label className="form-label">
                <FaLock className="input-icon" />
                Password *
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-rules">
                    <span className={passwordRules.minLength ? 'valid' : 'invalid'}>
                      ✓ At least 8 characters
                    </span>
                    <span className={passwordRules.hasUpperCase ? 'valid' : 'invalid'}>
                      ✓ One uppercase letter
                    </span>
                    <span className={passwordRules.hasLowerCase ? 'valid' : 'invalid'}>
                      ✓ One lowercase letter
                    </span>
                    <span className={passwordRules.hasNumber ? 'valid' : 'invalid'}>
                      ✓ One number
                    </span>
                    <span className={passwordRules.hasSpecialChar ? 'valid' : 'invalid'}>
                      ✓ One special character
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaLock className="input-icon" />
                Confirm Password *
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              'Create Citizen Account'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="signup-links">
          <p className="login-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
          <p className="forgot-password-link">
            Forgot your password? <Link to="/citizen/forgot-password">Reset Password</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CitizenSignUp;