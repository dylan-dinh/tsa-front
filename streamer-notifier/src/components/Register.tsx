import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
}

function Register({ isOpen, onClose }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordError, setPasswordError] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (confirmPassword && password) {
        if (confirmPassword !== password) {
          setError('Passwords do not match');
          setPasswordMatch(false);
          setPasswordError(true);
        } else {
          setError('');
          setPasswordMatch(true);
          setPasswordError(false);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [confirmPassword, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordMatch) {
      return;
    }

    try {
      const response = await register({
        email,
        username,
        first_name: firstName,
        last_name: lastName,
        password,
      });
      localStorage.setItem('username', response.username);
      localStorage.setItem('email', response.email);
      localStorage.setItem('userId', response.id);
      localStorage.setItem('token', response.token);
      login(response.token);
      onClose();
      navigate('/home');
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        if (error.response.status === 400) {
          if (typeof error.response.data === 'object' && error.response.data !== null && 'error' in error.response.data) {
            setError(error.response.data.error as string);
          }
        } else if (error.response.status === 500) {
          setError('Internal server error. Please try again later.');
        } else {
          setError('An unexpected error occurred.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
      setSnackbarOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Create Account</h3>
            <IconButton
              onClick={onClose}
              className="rounded-full hover:bg-gray-100 transition-colors"
              size="small"
            >
              <CloseIcon className="text-gray-500" />
            </IconButton>
          </div>

          {/* Content */}
          <div className="mt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value !== password) {
                    setPasswordError(true);
                  } else {
                    setPasswordError(false);
                  }
                }}
                error={passwordError}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="bg-[#9147ff] hover:bg-[#7c3bdb] text-white font-semibold py-2 px-4 rounded-full transition-colors"
              >
                Register
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Register;
