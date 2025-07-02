import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Jobzan, the job hunter
          </Typography>
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
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
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