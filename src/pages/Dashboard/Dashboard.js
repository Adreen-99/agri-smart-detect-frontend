import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, historyData] = await Promise.all([
          api.getDashboardStats(),
          api.getScanHistory(),
        ]);
        setStats(statsData);
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        // Fallback to mock data
        setStats({
          totalScans: 12,
          healthyPlants: 8,
          diseasesDetected: 4,
          yieldImpact: 15,
        });
        setHistory([
          { plantName: 'Cassava', status: 'Healthy', confidence: 96, date: '2 hours ago' },
          { plantName: 'Maize', status: 'Rust Detected', confidence: 87, date: '1 day ago' },
          { plantName: 'Tomato', status: 'Healthy', confidence: 94, date: '2 days ago' },
        ]);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-page">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome to Your Farm Dashboard</h1>
        <p>Hello, {currentUser.name}! Here's your farming overview.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total Scans</h3>
            <p className="stat-number">{stats.totalScans}</p>
            <p className="stat-label">This month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌿</div>
          <div className="stat-info">
            <h3>Healthy Plants</h3>
            <p className="stat-number">{stats.healthyPlants}</p>
            <p className="stat-label">{stats.healthyPlants / stats.totalScans * 100}% success rate</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Diseases Detected</h3>
            <p className="stat-number">{stats.diseasesDetected}</p>
            <p className="stat-label">Requires attention</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>Yield Impact</h3>
            <p className="stat-number">+{stats.yieldImpact}%</p>
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
          {history.map((item, index) => (
            <div className="activity-item" key={index}>
              <div className="activity-icon">🔍</div>
              <div className="activity-info">
                <p><strong>{item.plantName} Scan</strong> - {item.status}</p>
                <small>{item.date} • {item.confidence}% confidence</small>
              </div>
            </div>
          ))}
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