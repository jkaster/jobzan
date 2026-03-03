import { useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext, type IUser } from './context/AuthContext';

interface IJwtPayload {
  id: string;
  email: string;
  displayName?: string;
  exp: number;
}

const decodeUser = (token: string): IUser => {
  const decoded = jwtDecode<IJwtPayload>(token);
  return {
    id: decoded.id,
    email: decoded.email,
    displayName: decoded.displayName,
  };
};

/**
 * Props for the AuthProvider component.
 * @interface
 */
interface IAuthProviderProps {
  children: ReactNode;
}

/**
 * Provides authentication context to its children.
 * Manages user login, logout, and authentication state.
 * @component
 */
export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      try {
        const decoded = jwtDecode<IJwtPayload>(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decodeUser(storedToken));
          setToken(storedToken);
        } else {
          localStorage.removeItem('jwtToken');
        }
      } catch (error) {
        console.error('Failed to decode or validate token', error);
        localStorage.removeItem('jwtToken');
      }
    }
  }, []);

  /**
   * Logs in a user by storing the JWT and decoding user information.
   * @param jwtToken - The JWT received from the authentication server.
   */
  const login = (jwtToken: string) => {
    localStorage.setItem('jwtToken', jwtToken);
    setUser(decodeUser(jwtToken));
    setToken(jwtToken);
  };

  /**
   * Logs out the current user by removing the JWT and clearing user state.
   */
  const logout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
    setToken(null);
    // Optionally, redirect to login page or home
    window.location.href = '/';
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
