import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
  Link,
  Divider,
} from '@mui/material';
import {
  LockOutlined,
  EmailOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  LanguageOutlined,
} from '@mui/icons-material';
import { authService } from '../services/api';
import '../components/styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Check if user is already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Call the login API
      const response = await authService.login(formData);
      
      // Redirect to dashboard on successful login
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error responses
      if (err.response) {
        const { status, data } = err.response;
        
        if (status === 400) {
          // Handle validation errors
          if (data.errors) {
            // Check for field-specific errors
            if (data.errors.Email) {
              setError(data.errors.Email[0]);
            } else if (data.errors['']) {
              // General error (like "Email or Password is not correct")
              setError(data.errors[''][0]);
            } else {
              // Other validation errors
              setError('Invalid login information');
            }
          } else {
            setError('Invalid email or password');
          }
        } else if (status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container 
      component="main" 
      maxWidth="xs" 
      className="login-container"
    >
      <Box className="login-container">
        <Paper
          elevation={3}
          className="login-paper"
        >
          <Avatar 
            className="login-avatar"
            sx={{ bgcolor: theme.palette.primary.main }}
          >
            <LockOutlined fontSize="large" />
          </Avatar>
          <Typography 
            component="h1" 
            variant="h4" 
            className="login-title login-gradient-text"
          >
            WORDWISE
          </Typography>
          <Typography 
            variant="h6" 
            color="textSecondary" 
            className="login-subtitle"
          >
            Admin Panel Login
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              className="login-alert"
            >
              {error}
            </Alert>
          )}
          
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            className="login-form"
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                ),
              }}
              className="login-textfield"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="login-textfield"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className="login-button"
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            
            <Divider className="login-divider">or</Divider>
            
            <Typography 
              variant="body2" 
              color="textSecondary" 
              className="login-bottom-text"
            >
              Forgot your password? Contact administrator for assistance.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 