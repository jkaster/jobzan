import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useTranslation } from 'react-i18next';

/**
 * Login component for user authentication.
 * Provides options to sign in with Google or GitHub.
 * @component
 */
const Login: React.FC = () => {
  const { t } = useTranslation();

  /**
   * Handles the Google login process by redirecting to the backend OAuth endpoint.
   */
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  /**
   * Handles the GitHub login process by redirecting to the backend OAuth endpoint.
   */
  const handleGitHubLogin = () => {
    window.location.href = '/api/auth/github';
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {t('welcome_to_jobzan')}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          {t('sign_in_to_continue')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{ mt: 3, mb: 2, width: '100%' }}
          aria-label={t('sign_in_with_google')}
        >
          {t('sign_in_with_google')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<GitHubIcon />}
          onClick={handleGitHubLogin}
          sx={{ width: '100%' }}
          aria-label={t('sign_in_with_github')}
        >
          {t('sign_in_with_github')}
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
