import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create a custom axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout limit
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexus_token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Sends logs to the backend for AI analysis.
 * @param {string} logs - The raw log string to be analyzed.
 * @returns {Promise<Object>} The analysis results.
 */
export const analyzeLogs = async (logs) => {
  try {
    const response = await apiClient.post('/analyze', { logs });
    return response.data;
  } catch (error) {
    // 1. Handle Timeouts
    if (error.code === 'ECONNABORTED') {
      throw new Error('Analysis request timed out. The server took too long to respond.');
    }
    
    // 2. Handle standard HTTP Errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    } 
    // 3. Handle Network Errors (No response)
    else if (error.request) {
      throw new Error('No response from server. Please check your network connection or ensure the server is running.');
    } 
    // 4. Handle Setup Errors
    else {
      throw new Error(`Error processing the request: ${error.message}`);
    }
  }
};
