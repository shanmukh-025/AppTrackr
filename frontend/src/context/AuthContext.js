import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch user data from the backend
  const fetchUser = async () => {
    if (!token) return; // If no token, skip fetching
    try {
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user); // Update the global user state
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    await fetchUser();
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login
  };

  useEffect(() => {
    fetchUser(); // Fetch user data on app load
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, setToken, setUser, refreshUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};