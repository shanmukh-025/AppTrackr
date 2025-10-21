import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000 // 5 second timeout
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error.message);
      // Don't fail silently - if there's an auth error, log out
      if (error.response?.status === 401) {
        console.warn('Token invalid or expired');
        logout();
      }
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

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

  const register = async (name, email, password) => {
    try {
      console.log('Register function called with:', { name, email }); // Debug log
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
      });
      console.log('Registration response:', response.data); // Debug log
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      console.error('Error details:', error.response?.data); // Debug log
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const initUser = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000 // 5 second timeout
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error.message);
        // Don't fail silently - if there's an auth error, log out
        if (error.response?.status === 401) {
          console.warn('Token invalid or expired');
          logout();
        }
      }
    };

    initUser();
  }, [token, API_URL]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        setToken, 
        setUser, 
        refreshUser, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};