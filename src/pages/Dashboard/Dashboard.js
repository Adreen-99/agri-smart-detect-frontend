import React, { useEffect, useState } from "react";

const Dashboard = () => {
  // Define the state variables and their setters
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('agri_smart_detect_token');
      
      // Fetch stats
      const statsResponse = await fetch('https://agri-smart-detect-backend.onrender.com/api/reports/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch recent scans
      const scansResponse = await fetch('https://agri-smart-detect-backend.onrender.com/api/reports?page=1&per_page=3', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const scansData = await scansResponse.json();
      setRecentScans(scansData.reports);

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
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
      )}

      {recentScans.length > 0 && (
        <div>
          <h2>Recent Scans</h2>
          <ul>
            {recentScans.map((scan) => (
              <li key={scan.id}>{scan.crop_name} - {scan.result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
