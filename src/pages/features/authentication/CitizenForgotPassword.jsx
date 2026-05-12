import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import api from '../../../config/axios.config';
import './CitizenForgotPassword.css';

const CitizenForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email input, 2: New password
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const validateEmail = (emailValue) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  };

  const validatePhone = (phoneValue) => {
    return /^\d{10}$/.test(phoneValue);
  };

  // Step 1: Send reset request
  const handleSendResetRequest = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate either email or phone
    if (!email.trim() && !phone.trim()) {
      newErrors.email = 'Please provide either email or phone number';
      newErrors.phone = 'Please provide either email or phone number';
    } else {
      if (email.trim() && !validateEmail(email)) {
        newErrors.email = 'Please provide a valid email address';
      }
      if (phone.trim() && !validatePhone(phone)) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      // Use the citizen forgot password endpoint
      // The backend expects phone and newPassword
      // We'll send a request to get citizen by email first, then use phone for reset
      let citizenPhone = phone;

      if (email && !phone) {
        // Get citizen by email to get phone number
        const citizenResponse = await api.get(`/citizen/email/${email}`);
        citizenPhone = citizenResponse.data.phone;
      }

      // For now, we'll just show the email input and proceed to password reset
      // In a real implementation, you'd send an email with a reset link/token
      toast.success(`Password reset instructions sent to your email: ${email || 'associated with phone ' + citizenPhone}`);
      setStep(2);
      setErrors({});

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset request. Please try again.';
      toast.error(errorMessage);
      console.error('Reset request error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordRules = validatePassword(newPassword);
      if (!passwordRules.minLength || !passwordRules.hasUpperCase ||
          !passwordRules.hasLowerCase || !passwordRules.hasNumber ||
          !passwordRules.hasSpecialChar) {
        newErrors.newPassword = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      // Call the reset password endpoint
      const resetData = {
        email: email,
        newPassword: newPassword
      };

      await api.post('/auth/reset-password', resetData);

      toast.success('Password reset successful! You can now login with your new password.');
      navigate('/login');

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(value);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    } else {
      navigate('/citizen/signup');
    }
  };

  const passwordRules = validatePassword(newPassword);

  return (
    <div className="citizen-forgot-password-container">
      <div className="citizen-forgot-password-card">
        <div className="forgot-password-header">
          <button className="back-button" onClick={goBack}>
            <FaArrowLeft />
          </button>
          <div className="logo-section">
            <FaLock className="logo-icon" />
          </div>
          <h2 className="forgot-title">
            {step === 1 ? 'Reset Password' : 'Set New Password'}
          </h2>
          <p className="forgot-subtitle">
            {step === 1
              ? 'Enter your email or phone to receive reset instructions'
              : 'Create a strong new password for your account'
            }
          </p>
        </div>

        <form
          onSubmit={step === 1 ? handleSendResetRequest : handleResetPassword}
          className="forgot-password-form"
        >
          {step === 1 ? (
            /* Step 1: Email/Phone Input */
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope className="input-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  disabled={loading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="or-divider">
                <span>OR</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope className="input-icon" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={handleInputChange(setPhone)}
                  disabled={loading}
                  maxLength="10"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
          ) : (
            /* Step 2: New Password */
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  <FaLock className="input-icon" />
                  New Password *
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    className={`form-input ${errors.newPassword ? 'error' : ''}`}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={handleInputChange(setNewPassword)}
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
                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}

                {/* Password Strength Indicator */}
                {newPassword && (
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
                  Confirm New Password *
                </label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={handleInputChange(setConfirmPassword)}
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
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="reset-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                {step === 1 ? 'Sending...' : 'Resetting...'}
              </>
            ) : (
              step === 1 ? 'Send Reset Instructions' : 'Reset Password'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="forgot-password-links">
          <p className="login-link">
            Remember your password? <Link to="/login">Sign In</Link>
          </p>
          <p className="signup-link">
            Don't have an account? <Link to="/citizen/signup">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CitizenForgotPassword;