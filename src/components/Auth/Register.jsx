import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../components/Auth/Register.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    farmSize: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create account: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join Agri Smart Detect</h2>
        <p className="auth-subtitle">Create your account to start using AI-powered farming solutions</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="farmName">Farm Name</label>
            <input
              type="text"
              id="farmName"
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              required
              placeholder="Enter your farm name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="farmSize">Farm Size (acres)</label>
            <input
              type="number"
              id="farmSize"
              name="farmSize"
              value={formData.farmSize}
              onChange={handleChange}
              required
              placeholder="Enter farm size in acres"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select your country</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="Ghana">Ghana</option>
              <option value="South Africa">South Africa</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Uganda">Uganda</option>
              <option value="Other">Other African Country</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'SIGN UP NOW'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">LOG IN</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;