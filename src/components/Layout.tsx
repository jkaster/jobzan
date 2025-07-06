import React from "react";
import { AppBar, Toolbar, Typography, Container, Box, Button } from "@mui/material";
import { useAuth } from '../AuthContext';

/**
 * Props for the Layout component.
 * @interface
 */
interface ILayoutProps {
  /** The child components to be rendered within the layout. */
  children: React.ReactNode;
}

/**
 * A layout component that provides a consistent header, main content area, and footer for the application.
 * @param props - The component props.
 * @returns The Layout component.
 */
const Layout = ({ children }: ILayoutProps) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    // Call backend logout endpoint
    fetch('/api/auth/logout')
      .then(res => res.json())
      .then(data => {
        console.log(data.message);
        logout();
      })
      .catch(error => console.error('Logout error:', error));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Jobzan, the job hunter
          </Typography>
          {user && (
            <>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Welcome, {user.displayName || user.email}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body1">
            &copy; 2025 Job Application Tracker
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
