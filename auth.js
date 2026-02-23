// utils/auth.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  useEffect(() => {
    // Check session storage for persisted login
    const user = sessionStorage.getItem('rt_user');
    const adminUnlocked = sessionStorage.getItem('rt_admin') === 'true';
    if (user) setCurrentUser(user);
    if (adminUnlocked) setIsAdminUnlocked(true);
  }, []);

  const login = (userId) => {
    setCurrentUser(userId);
    sessionStorage.setItem('rt_user', userId);
  };

  const loginAdmin = () => {
    setIsAdminUnlocked(true);
    sessionStorage.setItem('rt_admin', 'true');
    login('bilal');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('rt_user');
    sessionStorage.removeItem('rt_admin');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdminUnlocked, login, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
