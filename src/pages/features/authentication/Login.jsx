import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

//Login form page. This will be a simple form with fields for phone number and password, and a submit button.
//use boostrap classes for styling and form validation. On submit, it will dispatch the loginUser action and handle loading and error states.
// should be good ui and user friendly. with react toastify for error and success messages. also should have a link to registration page.
function Login() {
  const [credentials, setCredentials] = useState({
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(credentials.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors below');
      return;
    }

    const result = await dispatch(loginUser(credentials));
    
    if (loginUser.fulfilled.match(result)) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else if (loginUser.rejected.match(result)) {
      // Check if error is related to PENDING status
      const errorMessage = result.payload || 'Login failed. Please try again.';
      if (errorMessage.includes('PENDING') || errorMessage.includes('pending') || errorMessage.includes('approval')) {
        toast.warning('⏳ Your account is awaiting admin approval. Please check back later.');
      } else if (errorMessage.includes('SUSPENDED')) {
        toast.error('❌ Your account has been suspended.');
      } else if (errorMessage.includes('INACTIVE')) {
        toast.error('❌ Your account is inactive.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4 fw-bold text-primary">TranspoGov Login</h2>
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="Enter 10-digit phone number"
                value={credentials.phone}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.phone && (
                <div className="invalid-feedback d-block">{errors.phone}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.password && (
                <div className="invalid-feedback d-block">{errors.password}</div>
              )}
            </div>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary btn-lg w-100 fw-semibold mb-3"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <hr className="my-4" />

          <div className="text-center">
            <p className="text-muted mb-0">
              Don't have an account?{' '}
              <Link to="/signup-selection" className="text-primary fw-semibold text-decoration-none">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="text-center mt-3">
            <Link to="/forgot-password" className="text-muted small text-decoration-none">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
