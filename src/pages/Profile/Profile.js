import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import './Profile.css';

const Profile = () => {
  const { currentUser, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    phone_number: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        country: currentUser.country || '',
        phone_number: currentUser.phone_number || ''
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await api.updateProfile(currentUser.id, formData);

      // Update local storage and context
      localStorage.setItem('agri_smart_detect_user', JSON.stringify(updatedUser));
      login(updatedUser.email, ''); // This will refresh the context

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Reset form data to current user data
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        country: currentUser.country || '',
        phone_number: currentUser.phone_number || ''
      });
    }
  };

  if (!currentUser) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-content">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>

          <div className="profile-info">
            {!isEditing ? (
              <div className="profile-display">
                <div className="info-group">
                  <label>Full Name</label>
                  <p>{currentUser.name || 'Not provided'}</p>
                </div>

                <div className="info-group">
                  <label>Email</label>
                  <p>{currentUser.email || 'Not provided'}</p>
                </div>

                <div className="info-group">
                  <label>Country</label>
                  <p>{currentUser.country || 'Not provided'}</p>
                </div>

                <div className="info-group">
                  <label>Phone Number</label>
                  <p>{currentUser.phone_number || 'Not provided'}</p>
                </div>

                <div className="profile-actions">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="edit-btn"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Enter your country"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone_number">Phone Number</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-btn"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
