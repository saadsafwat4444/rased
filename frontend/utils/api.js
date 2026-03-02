// Global fetch configuration for production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555';

// Enhanced fetch function that automatically uses the correct API URL
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add auth token if available
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${user.token}`
      };
    }
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};
