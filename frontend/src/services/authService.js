import axios from 'axios';

// API URL - replace with your actual backend URL
const API_URL = 'http://localhost:3000'; 

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
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

// Login user
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
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
    logout(); // If token is invalid, logout user
    return null;
  }
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