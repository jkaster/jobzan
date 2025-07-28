import { createContext } from 'react';

export interface IUser {
  id: string;
  email: string;
  displayName?: string;
}

/**
 * Defines the shape of the authentication context.
 * @interface
 */
export interface IAuthContextType {
  user: IUser | null;
  token: string | null;
  login: (jwtToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);