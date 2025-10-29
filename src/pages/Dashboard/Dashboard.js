import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

const Dashboard = () => {
  // Define the state variables and their setters
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats using api service
      const statsData = await api.getDashboardStats();
      setStats(statsData);

      // Fetch recent scans using api service
      const scansData = await api.getScanHistory(3);
      setRecentScans(scansData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run once when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Render state data
  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      {stats && (
        <div>
          <h2>Stats</h2>
          <p>Total Scans: {stats.total_scans}</p>
          <p>Accurate Scans: {stats.accurate_scans}</p>
          <p>Accuracy Rate: {stats.accuracy_rate}%</p>
          <p>Unique Diseases Detected: {stats.unique_diseases}</p>
        </div>
      )}

      {recentScans.length > 0 && (
        <div>
          <h2>Recent Scans</h2>
          <ul>
            {recentScans.map((scan) => (
              <li key={scan.id}>Report ID: {scan.id} - Confidence: {scan.confidence_score}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
