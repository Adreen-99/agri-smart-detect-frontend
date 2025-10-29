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