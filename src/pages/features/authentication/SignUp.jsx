import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import RoleDropdown from '../../../components/RoleDropdown';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'TRANSPORT_OFFICER',
    status: 'ACTIVE'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else {
      const passwordRules = validatePassword(formData.password);
      if (!passwordRules.minLength || !passwordRules.hasUpperCase || !passwordRules.hasLowerCase || !passwordRules.hasNumber || !passwordRules.hasSpecialChar) {
        newErrors.password = 'Password must be at least 8 characters, with uppercase, lowercase, number, and special character';
      }
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
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

    const signupData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
      status: formData.status
    };

    const result = await dispatch(registerUser(signupData));
    
    if (registerUser.fulfilled.match(result)) {
      toast.success('Signup successful! You can now login.');
      navigate('/login');
    } else if (registerUser.rejected.match(result)) {
      toast.error(result.payload || 'Signup failed. Please try again.');
    }
  };

  const passwordRules = validatePassword(formData.password);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-4">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4 fw-bold text-primary">Create Account</h2>
          
          <form onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.name && (
                <div className="invalid-feedback d-block">{errors.name}</div>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && (
                <div className="invalid-feedback d-block">{errors.email}</div>
              )}
            </div>

            {/* Phone Field */}
            <div className="mb-3">
              <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.phone && (
                <div className="invalid-feedback d-block">{errors.phone}</div>
              )}
            </div>

            {/* Role Selection */}
            <div className="mb-3">
              <label htmlFor="role" className="form-label fw-semibold">User Role</label>
              <RoleDropdown
                value={formData.role}
                onChange={(role) => handleChange({ target: { name: 'role', value: role } })}
                disabled={loading}
                placeholder="Select Role"
              />
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
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
              {errors.password && (
                <div className="invalid-feedback d-block">{errors.password}</div>
              )}
              
              {/* Password Requirements */}
              {formData.password && (
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

            {/* Confirm Password Field */}
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary btn-lg w-100 fw-semibold mb-3"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <hr className="my-4" />

          {/* Login Link */}
          <div className="text-center">
            <p className="text-muted mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
