import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Check if a user is already logged in when the app starts
  const checkStoredToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const role = await SecureStore.getItemAsync('userRole');
      if (token && role) {
        setUserToken(token);
        setUserRole(role);
      }
    } catch (e) {
      console.error("Token checking failed:", e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkStoredToken();
  }, []);

  // Login function to call Node.js API
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      const { token, role } = response.data; // Assuming your Node API returns these
      
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userRole', role);
      
      setUserToken(token);
      setUserRole(role);
    } catch (error) {
      alert("Login failed. Check your credentials.");
    }
    setIsLoading(false);
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userRole');
    setUserToken(null);
    setUserRole(null);
    setIsLoading(false);
  };

 return (
    <AuthContext.Provider value={{ login, logout, checkStoredToken, userToken, userRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};