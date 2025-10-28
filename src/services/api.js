const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const TOKEN_KEY = 'authToken';

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
      const response = await fetch(`${BACKEND_URL}/api/dashboard/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw error;
    }
  },

  async getScanHistory() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/scans/history`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scan history');
      }

      return await response.json();
    } catch (error) {
      console.error('Scan history error:', error);
      throw error;
    }
  },

  async saveScanResult(scanData) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/scans`, {
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
};