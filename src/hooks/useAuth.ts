import { useContext } from 'react';
import { type IAuthContextType, AuthContext } from '../AuthContext';

/**
 * Custom hook to access the authentication context.
 * Throws an error if not used within an AuthProvider.
 * @returns The authentication context.
 */
export const useAuth = (): IAuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
