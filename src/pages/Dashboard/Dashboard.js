import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome to Your Farm Dashboard</h1>
        <p>Hello, {currentUser.name}! Here's your farming overview.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total Scans</h3>
            <p className="stat-number">12</p>
            <p className="stat-label">This month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌿</div>
          <div className="stat-info">
            <h3>Healthy Plants</h3>
            <p className="stat-number">8</p>
            <p className="stat-label">67% success rate</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Diseases Detected</h3>
            <p className="stat-number">4</p>
            <p className="stat-label">Requires attention</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>Yield Impact</h3>
            <p className="stat-number">+15%</p>
            <p className="stat-label">Since using Agri Smart Detect</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/scan" className="action-card primary">
            <div className="action-icon">🔍</div>
            <h3>Scan New Crop</h3>
            <p>Upload images for AI disease detection</p>
          </Link>

          <div className="action-card">
            <div className="action-icon">📋</div>
            <h3>Scan History</h3>
            <p>View your previous crop analyses</p>
          </div>

          <div className="action-card">
            <div className="action-icon">💡</div>
            <h3>Farming Tips</h3>
            <p>Get personalized recommendations</p>
          </div>

          <div className="action-card">
            <div className="action-icon">🌧️</div>
            <h3>Weather</h3>
            <p>Check local weather conditions</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🔍</div>
            <div className="activity-info">
              <p><strong>Cassava Scan</strong> - Healthy</p>
              <small>2 hours ago • 96% confidence</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">🔍</div>
            <div className="activity-info">
              <p><strong>Maize Scan</strong> - Rust Detected</p>
              <small>1 day ago • 87% confidence</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">🔍</div>
            <div className="activity-info">
              <p><strong>Tomato Scan</strong> - Healthy</p>
              <small>2 days ago • 94% confidence</small>
            </div>
          </div>
        </div>
      </div>

      <div className="farm-info">
        <h2>Your Farm Information</h2>
        <div className="farm-details">
          <div className="detail-item">
            <label>Farm Name:</label>
            <span>{currentUser.farmName || 'Green Valley Farm'}</span>
          </div>
          <div className="detail-item">
            <label>Farm Size:</label>
            <span>{currentUser.farmSize || '5'} acres</span>
          </div>
          <div className="detail-item">
            <label>Location:</label>
            <span>{currentUser.location || 'Nigeria'}</span>
          </div>
          <div className="detail-item">
            <label>Member Since:</label>
            <span>January 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;