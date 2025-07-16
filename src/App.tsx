import { useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import { useAuth } from './hooks/useAuth';
import AuthenticatedApp from './AuthenticatedApp';

/**
 * Main application component.
 * Handles user authentication and protected routes.
 * @component
 */
function App() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles token from URL after OAuth redirect.
   * If a token is present, it logs the user in and cleans the URL.
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      login(token);
      navigate('/', { replace: true }); // Clean the URL
    }
  }, [navigate, login]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={isAuthenticated ? <AuthenticatedApp /> : <Login />} />
    </Routes>
  );
}

export default App;