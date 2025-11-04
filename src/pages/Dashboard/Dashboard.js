import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const API_BASE_URL = 'https://clean-backend-6rgv.onrender.com';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, healthy: 0, diseased: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, history, tips, weather

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('agri_smart_detect_token');
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
        
        // Calculate stats
        const total = data.reports.length;
        const healthy = data.reports.filter(r => r.is_healthy).length;
        const diseased = total - healthy;
        setStats({ total, healthy, diseased });
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const farmingTips = [
    {
      icon: '💧',
      title: 'Watering Schedule',
      tip: 'Water your crops early morning or late evening to reduce evaporation and maximize absorption.',
      category: 'Water Management'
    },
    {
      icon: '🌱',
      title: 'Crop Rotation',
      tip: 'Rotate crops seasonally to prevent soil depletion and reduce disease buildup in the soil.',
      category: 'Soil Health'
    },
    {
      icon: '🐛',
      title: 'Natural Pest Control',
      tip: 'Introduce beneficial insects like ladybugs and use neem oil spray for organic pest management.',
      category: 'Pest Management'
    },
    {
      icon: '🌾',
      title: 'Mulching Benefits',
      tip: 'Apply organic mulch around plants to retain moisture, regulate temperature, and suppress weeds.',
      category: 'Soil Care'
    },
    {
      icon: '📊',
      title: 'Monitor Plant Health',
      tip: 'Regularly inspect leaves for early signs of disease. Early detection means easier treatment.',
      category: 'Disease Prevention'
    },
    {
      icon: '🌿',
      title: 'Companion Planting',
      tip: 'Plant marigolds near tomatoes to repel pests, or beans near corn for natural nitrogen fixation.',
      category: 'Planting Strategy'
    }
  ];

  const renderOverview = () => (
    <>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total Scans</h3>
            <p className="stat-number">{stats.total}</p>
            <p className="stat-label">All time</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">🌿</div>
          <div className="stat-info">
            <h3>Healthy Plants</h3>
            <p className="stat-number">{stats.healthy}</p>
            <p className="stat-label">
              {stats.total > 0 ? Math.round((stats.healthy / stats.total) * 100) : 0}% success rate
            </p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Diseases Detected</h3>
            <p className="stat-number">{stats.diseased}</p>
            <p className="stat-label">Requires attention</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">🔬</div>
          <div className="stat-info">
            <h3>AI Powered</h3>
            <p className="stat-number">Plant.id</p>
            <p className="stat-label">Real-time analysis</p>
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

          <button className="action-card" onClick={() => setActiveTab('history')}>
            <div className="action-icon">📋</div>
            <h3>Scan History</h3>
            <p>View your previous crop analyses</p>
          </button>

          <button className="action-card" onClick={() => setActiveTab('tips')}>
            <div className="action-icon">💡</div>
            <h3>Farming Tips</h3>
            <p>Get personalized recommendations</p>
          </button>

          <button className="action-card" onClick={() => setActiveTab('weather')}>
            <div className="action-icon">🌧️</div>
            <h3>Weather</h3>
            <p>Check local weather conditions</p>
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {loading ? (
          <div className="loading-state">Loading your scan history...</div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No scans yet. Start by scanning your first crop!</p>
            <Link to="/scan" className="btn-primary">Scan Now</Link>
          </div>
        ) : (
          <div className="activity-list">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="activity-item">
                <div className={`activity-icon ${report.is_healthy ? 'healthy' : 'diseased'}`}>
                  {report.is_healthy ? '✅' : '⚠️'}
                </div>
                <div className="activity-info">
                  <p>
                    <strong>{report.crop_name}</strong> - {report.is_healthy ? 'Healthy' : report.disease_name || 'Disease Detected'}
                  </p>
                  <small>{formatDate(report.created_at)} • {Math.round(report.confidence * 100)}% confidence</small>
                </div>
              </div>
            ))}
          </div>
        )}
        {reports.length > 5 && (
          <button className="view-all-btn" onClick={() => setActiveTab('history')}>
            View All Scans →
          </button>
        )}
      </div>
    </>
  );

  const renderHistory = () => (
    <div className="history-section">
      <div className="section-header">
        <button className="back-btn" onClick={() => setActiveTab('overview')}>
          ← Back to Dashboard
        </button>
        <h2>Scan History</h2>
      </div>

      {loading ? (
        <div className="loading-state">Loading scan history...</div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Scan History</h3>
          <p>You haven't scanned any crops yet. Start by uploading your first image!</p>
          <Link to="/scan" className="btn-primary">Start Scanning</Link>
        </div>
      ) : (
        <div className="history-grid">
          {reports.map((report) => (
            <div key={report.id} className={`history-card ${report.is_healthy ? 'healthy' : 'diseased'}`}>
              <div className="history-header">
                <h3>{report.crop_name}</h3>
                <span className={`status-badge ${report.is_healthy ? 'success' : 'warning'}`}>
                  {report.is_healthy ? '✅ Healthy' : '⚠️ Diseased'}
                </span>
              </div>
              
              {!report.is_healthy && report.disease_name && (
                <div className="disease-info">
                  <strong>Disease:</strong> {report.disease_name}
                </div>
              )}
              
              <div className="report-meta">
                <div className="meta-item">
                  <span className="meta-label">Confidence:</span>
                  <span className="meta-value">{Math.round(report.confidence * 100)}%</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Scanned:</span>
                  <span className="meta-value">{formatDate(report.created_at)}</span>
                </div>
              </div>

              {report.recommended_treatment && (
                <div className="treatment-preview">
                  <strong>Treatment:</strong>
                  <p>{report.recommended_treatment.substring(0, 100)}...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTips = () => (
    <div className="tips-section">
      <div className="section-header">
        <button className="back-btn" onClick={() => setActiveTab('overview')}>
          ← Back to Dashboard
        </button>
        <h2>Farming Tips & Best Practices</h2>
        <p>Expert advice to help you grow healthier crops</p>
      </div>

      <div className="tips-grid">
        {farmingTips.map((tip, index) => (
          <div key={index} className="tip-card">
            <div className="tip-icon-large">{tip.icon}</div>
            <div className="tip-category">{tip.category}</div>
            <h3>{tip.title}</h3>
            <p>{tip.tip}</p>
          </div>
        ))}
      </div>

      <div className="tips-footer">
        <div className="tip-cta">
          <h3>Need Personalized Advice?</h3>
          <p>Scan your crops regularly to get AI-powered recommendations specific to your plants.</p>
          <Link to="/scan" className="btn-primary">Scan Your Crops</Link>
        </div>
      </div>
    </div>
  );

  const renderWeather = () => (
    <div className="weather-section">
      <div className="section-header">
        <button className="back-btn" onClick={() => setActiveTab('overview')}>
          ← Back to Dashboard
        </button>
        <h2>Weather Information</h2>
        <p>Local weather conditions for {currentUser.country || 'your area'}</p>
      </div>

      <div className="weather-widget">
        <div className="weather-current">
          <div className="weather-icon">🌤️</div>
          <div className="weather-temp">
            <h1>28°C</h1>
            <p>Partly Cloudy</p>
          </div>
        </div>

        <div className="weather-details">
          <div className="weather-detail">
            <span className="detail-icon">💧</span>
            <span className="detail-label">Humidity</span>
            <span className="detail-value">65%</span>
          </div>
          <div className="weather-detail">
            <span className="detail-icon">💨</span>
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">12 km/h</span>
          </div>
          <div className="weather-detail">
            <span className="detail-icon">🌧️</span>
            <span className="detail-label">Rainfall</span>
            <span className="detail-value">40% chance</span>
          </div>
          <div className="weather-detail">
            <span className="detail-icon">☀️</span>
            <span className="detail-label">UV Index</span>
            <span className="detail-value">7 (High)</span>
          </div>
        </div>
      </div>

      <div className="weather-forecast">
        <h3>7-Day Forecast</h3>
        <div className="forecast-grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="forecast-day">
              <div className="forecast-day-name">{day}</div>
              <div className="forecast-icon">
                {index % 3 === 0 ? '☀️' : index % 3 === 1 ? '🌤️' : '🌧️'}
              </div>
              <div className="forecast-temp">
                <span className="temp-high">{27 + index}°</span>
                <span className="temp-low">{18 + index}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="weather-tips">
        <h3>Farming Recommendations Based on Weather</h3>
        <div className="weather-tip-card">
          <span className="tip-icon">💧</span>
          <div>
            <strong>Watering:</strong> Rain expected tomorrow. Skip watering to avoid overwatering.
          </div>
        </div>
        <div className="weather-tip-card">
          <span className="tip-icon">☀️</span>
          <div>
            <strong>UV Protection:</strong> High UV index. Consider shade cloth for sensitive plants.
          </div>
        </div>
        <div className="weather-tip-card">
          <span className="tip-icon">🌡️</span>
          <div>
            <strong>Temperature:</strong> Ideal conditions for most crops. Good time for planting.
          </div>
        </div>
      </div>

      <div className="weather-note">
        <p><em>Note: Weather data is simulated. For real-time weather, integrate with a weather API service.</em></p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome Back, {currentUser.name}!</h1>
        <p>Here's your farming overview and insights</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 Scan History
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          💡 Farming Tips
        </button>
        <button 
          className={`tab-btn ${activeTab === 'weather' ? 'active' : ''}`}
          onClick={() => setActiveTab('weather')}
        >
          🌧️ Weather
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'tips' && renderTips()}
        {activeTab === 'weather' && renderWeather()}
      </div>
    </div>
  );
};

export default Dashboard;
