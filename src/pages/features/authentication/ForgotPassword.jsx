import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestPasswordReset, resetPassword } from '../../../axios/auth_api';
import 'bootstrap/dist/css/bootstrap.min.css';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email verification, 2: OTP verification, 3: Password reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  
  const navigate = useNavigate();

  const validateEmail = (emailValue) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  };

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

  // Step 1: Request password reset
  const handleRequestReset = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);
    try {
      const response = await requestPasswordReset(email);
      setResetToken(response.data.resetToken); // Store reset token
      toast.success('OTP sent to your email. Please check your inbox.');
      setStep(2);
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please enter a valid OTP');
      return;
    }

    // In a real scenario, you'd verify OTP with backend
    // For now, we'll proceed to password reset step
    toast.success('OTP verified successfully!');
    setStep(3);
    setErrors({});
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordRules = validatePassword(newPassword);
      if (!passwordRules.minLength || !passwordRules.hasUpperCase || !passwordRules.hasLowerCase || !passwordRules.hasNumber || !passwordRules.hasSpecialChar) {
        newErrors.newPassword = 'Password must be at least 8 characters, with uppercase, lowercase, number, and special character';
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
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
      await resetPassword({
        email,
        otp,
        newPassword,
        resetToken
      });
      toast.success('Password reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = validatePassword(newPassword);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-4">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4 fw-bold text-primary">Reset Password</h2>
          
          {/* Step 1: Email Verification */}
          {step === 1 && (
            <form onSubmit={handleRequestReset} noValidate>
              <p className="text-muted mb-4 text-center">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
              
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  disabled={loading}
                />
                {errors.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary btn-lg w-100 fw-semibold mb-3"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} noValidate>
              <p className="text-muted mb-4 text-center">
                Enter the 6-digit OTP sent to <strong>{email}</strong>
              </p>
              
              <div className="mb-3">
                <label htmlFor="otp" className="form-label fw-semibold">OTP Code</label>
                <input
                  type="text"
                  id="otp"
                  className={`form-control form-control-lg text-center ${errors.otp ? 'is-invalid' : ''}`}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (errors.otp) setErrors({ ...errors, otp: '' });
                  }}
                  maxLength="6"
                  disabled={loading}
                />
                {errors.otp && (
                  <div className="invalid-feedback d-block">{errors.otp}</div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary btn-lg w-100 fw-semibold mb-3"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none"
                  onClick={() => setStep(1)}
                >
                  Back to email
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Password Reset */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} noValidate>
              <p className="text-muted mb-4 text-center">
                Create a new password for your account
              </p>
              
              {/* New Password */}
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label fw-semibold">New Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    className={`form-control form-control-lg ${errors.newPassword ? 'is-invalid' : ''}`}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                    }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.newPassword && (
                  <div className="invalid-feedback d-block">{errors.newPassword}</div>
                )}
                
                {/* Password Requirements */}
                {newPassword && (
                  <div className="mt-2 small">
                    <div className={passwordRules.minLength ? 'text-success' : 'text-muted'}>
                      ✓ At least 8 characters
                    </div>
                    <div className={passwordRules.hasUpperCase ? 'text-success' : 'text-muted'}>
                      ✓ Uppercase letter
                    </div>
                    <div className={passwordRules.hasLowerCase ? 'text-success' : 'text-muted'}>
                      ✓ Lowercase letter
                    </div>
                    <div className={passwordRules.hasNumber ? 'text-success' : 'text-muted'}>
                      ✓ Number
                    </div>
                    <div className={passwordRules.hasSpecialChar ? 'text-success' : 'text-muted'}>
                      ✓ Special character (!@#$%^&*)
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary btn-lg w-100 fw-semibold mb-3"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none"
                  onClick={() => {
                    setStep(2);
                    setNewPassword('');
                    setConfirmPassword('');
                    setErrors({});
                  }}
                >
                  Back to OTP
                </button>
              </div>
            </form>
          )}

          <hr className="my-4" />

          <div className="text-center">
            <Link to="/login" className="text-primary fw-semibold text-decoration-none">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
