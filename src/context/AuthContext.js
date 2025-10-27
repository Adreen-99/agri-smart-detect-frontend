import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from './utils/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const user = await auth.login(email, password);
    setCurrentUser(user);
    return user;
  };

  const register = async (userData) => {
    const user = await auth.register(userData);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    auth.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}