const BACKEND_URL = 'https://agri-smart-detect-backend-3-m0y3.onrender.com/';
const TOKEN_KEY = 'agri_smart_detect_token'; // Updated to match usage in components

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  async getDashboardStats() {
    try {
      const response = await fetch(`${BACKEND_URL}/reports`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const reports = await response.json();
      // Compute basic stats from reports
      const totalScans = reports.length;
      const accurateScans = reports.filter(r => r.is_accurate).length;
      const accuracyRate = totalScans > 0 ? (accurateScans / totalScans * 100).toFixed(2) : 0;
      const uniqueDiseases = new Set(reports.map(r => r.disease_id)).size;

      return {
        total_scans: totalScans,
        accurate_scans: accurateScans,
        accuracy_rate: accuracyRate,
        unique_diseases: uniqueDiseases,
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw error;
    }
  },

  async getScanHistory(limit = 20) {
    try {
      const response = await fetch(`${BACKEND_URL}/reports`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const reports = await response.json();
      return reports.slice(0, limit); // Limit to recent ones
    } catch (error) {
      console.error('Scan history error:', error);
      throw error;
    }
  },

  async saveScanResult(scanData) {
    try {
      const response = await fetch(`${BACKEND_URL}/reports`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(scanData),
      });

      if (!response.ok) {
        throw new Error('Failed to save scan result');
      }

      return await response.json();
    } catch (error) {
      console.error('Save scan error:', error);
      throw error;
    }
  },

  async getCrops() {
    try {
      const response = await fetch(`${BACKEND_URL}/crops`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch crops');
      }

      return await response.json();
    } catch (error) {
      console.error('Crops fetch error:', error);
      throw error;
    }
  },

  async updateProfile(userId, profileData) {
    try {
      const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },
};
