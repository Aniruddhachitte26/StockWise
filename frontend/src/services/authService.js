import axios from 'axios';

// API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'; 

// Set up axios default headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Register a new user
const register = async (userData) => {
  try {
    console.log('Registration API call with data:', userData);
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log('Registration API response:', response);
    return response.data;
  } catch (error) {
    console.error('Registration API error:', error.response || error);
    throw handleApiError(error);
  }
};

// Login user
const login = async (credentials) => {
  try {
    console.log('Login API call with credentials:', credentials);
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    console.log('Login API response:', response);
    
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login API error:', error.response || error);
    throw handleApiError(error);
  }
};

// Logout user
const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  setAuthToken(null);
};

// Check if user is logged in
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Returns true if token exists, false otherwise
};

// Get current user token
const getToken = () => {
  return localStorage.getItem('token');
};

// Get current user (requires backend endpoint)
const getCurrentUser = async () => {
  try {
    const token = getToken();
    if (!token) return null;
    
    setAuthToken(token);
    // Make sure to create this endpoint in your backend
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data.user;
  } catch (error) {
    console.error('Get current user error:', error.response || error);
    logout(); // If token is invalid, logout user
    return null;
  }
};

/**
 * Handle API error responses
 * @param {Error} error - Error object from axios
 * @returns {Error} Formatted error
 */
const handleApiError = (error) => {
  // If the error has a response from the server
  if (error.response) {
    // Extract the error message from the response
    console.log('Full error response:', error.response);
    
    // Try to get detailed error message
    const serverError = error.response.data.error || 
                        error.response.data.message ||
                        error.response.statusText ||
                        'Something went wrong';
                        
    return new Error(serverError);
  }
  
  // Network error or other issues
  return new Error('Network error. Please check your connection and try again.');
};

const authService = {
  register,
  login,
  logout,
  isAuthenticated,
  getToken,
  getCurrentUser,
  setAuthToken
};

export default authService;