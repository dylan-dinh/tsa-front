import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Snackbar, Alert, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CLipIt_Logo = process.env.PUBLIC_URL + '/ClipIt_logo.jpeg';

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
}

function Register({ isOpen, onClose }: RegisterProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    dateOfBirth: {
      month: '',
      day: '',
      year: ''
    },
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  // Clear error messages after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setFieldErrors({
        fullName: '',
        email: '',
        dateOfBirth: {
          month: '',
          day: '',
          year: ''
        },
        password: '',
        confirmPassword: ''
      });
    }, 10000);

    return () => clearTimeout(timer);
  }, [fieldErrors]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Validate email format
  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  // Validate password format
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8 && password.length <= 20;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength) {
      return 'Password must be between 8 and 20 characters';
    }
    if (!hasLetter) {
      return 'Password must contain at least one letter';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const errors = {
      fullName: '',
      email: '',
      dateOfBirth: {
        month: '',
        day: '',
        year: ''
      },
      password: '',
      confirmPassword: ''
    };

    if (currentStep === 1) {
      if (!fullName.trim()) {
        errors.fullName = 'Full name is required';
      }

      if (!email.trim()) {
        errors.email = 'Email is required';
      } else if (!validateEmail(email)) {
        errors.email = 'Invalid email format';
      }

      if (!month) {
        errors.dateOfBirth.month = 'Month is required';
      }
      if (!day) {
        errors.dateOfBirth.day = 'Day is required';
      }
      if (!year) {
        errors.dateOfBirth.year = 'Year is required';
      }
    } else if (currentStep === 2) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        errors.password = passwordError;
      }

      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFieldErrors(errors);
    return !Object.values(errors).some(error => 
      typeof error === 'string' ? error !== '' : Object.values(error).some(e => e !== '')
    );
  };

  const handleNext = () => {
    if (isFormValid()) {
      if (currentStep === 1) {
        setCurrentStep(2);
      } else {
        // Proceed with registration
        console.log('Form is valid, proceeding with registration');
      }
    }
  };

  // Handle field changes and clear errors
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    setFieldErrors(prev => ({ ...prev, fullName: '' }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFieldErrors(prev => ({ ...prev, email: '' }));
  };

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character type checks
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
    setFieldErrors(prev => ({ ...prev, password: '' }));
  };

  // Get password strength color and text
  const getPasswordStrengthInfo = (strength: number) => {
    switch (strength) {
      case 0:
        return { color: 'bg-gray-200', text: 'Very Weak' };
      case 1:
        return { color: 'bg-red-500', text: 'Weak' };
      case 2:
        return { color: 'bg-orange-500', text: 'Fair' };
      case 3:
        return { color: 'bg-yellow-500', text: 'Good' };
      case 4:
        return { color: 'bg-green-500', text: 'Strong' };
      case 5:
        return { color: 'bg-emerald-500', text: 'Very Strong' };
      default:
        return { color: 'bg-gray-200', text: 'Very Weak' };
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
  };

  const handleDateChange = (type: 'month' | 'day' | 'year', value: string) => {
    switch (type) {
      case 'month':
        setMonth(value);
        setFieldErrors(prev => ({
          ...prev,
          dateOfBirth: { ...prev.dateOfBirth, month: '' }
        }));
        break;
      case 'day':
        setDay(value);
        setFieldErrors(prev => ({
          ...prev,
          dateOfBirth: { ...prev.dateOfBirth, day: '' }
        }));
        break;
      case 'year':
        setYear(value);
        setFieldErrors(prev => ({
          ...prev,
          dateOfBirth: { ...prev.dateOfBirth, year: '' }
        }));
        break;
    }
  };

  // Generate arrays for date options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1909 },
    (_, i) => currentYear - i
  );

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
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full hover:bg-gray-100 transition-colors"
            size="small"
          >
            <CloseIcon className="text-gray-500" />
          </IconButton>

          {/* Content */}
          <div className="flex flex-col items-center space-y-6">
            {/* Logo */}
            <img
              src={CLipIt_Logo}
              alt="ClipIt Logo"
              className="h-12 w-auto object-contain"
            />

            {/* Headline */}
            <h2 className="text-2xl font-bold text-gray-900">
              {currentStep === 1 ? 'Create your account' : 'Create your password'}
            </h2>

            {/* Form */}
            <div className="w-full space-y-4">
              {currentStep === 1 ? (
                <>
                  {/* Full Name Input */}
                  <TextField
                    fullWidth
                    label="First name and Last name"
                    placeholder="First and last name"
                    value={fullName}
                    onChange={handleFullNameChange}
                    inputProps={{ maxLength: 50 }}
                    variant="outlined"
                    className="rounded-lg"
                    error={!!fieldErrors.fullName}
                    helperText={fieldErrors.fullName}
                    required
                  />

                  {/* Email Input */}
                  <TextField
                    fullWidth
                    label="Email"
                    placeholder="Email address"
                    value={email}
                    onChange={handleEmailChange}
                    variant="outlined"
                    className="rounded-lg"
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                    required
                  />

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {/* Month Dropdown */}
                      <FormControl fullWidth variant="outlined" size="small" error={!!fieldErrors.dateOfBirth.month}>
                        <InputLabel>Month</InputLabel>
                        <Select
                          value={month}
                          onChange={(e) => handleDateChange('month', e.target.value)}
                          label="Month"
                        >
                          {months.map((m) => (
                            <MenuItem key={m} value={m}>
                              {m}
                            </MenuItem>
                          ))}
                        </Select>
                        {fieldErrors.dateOfBirth.month && (
                          <span className="text-red-500 text-xs mt-1">{fieldErrors.dateOfBirth.month}</span>
                        )}
                      </FormControl>

                      {/* Day Dropdown */}
                      <FormControl fullWidth variant="outlined" size="small" error={!!fieldErrors.dateOfBirth.day}>
                        <InputLabel>Day</InputLabel>
                        <Select
                          value={day}
                          onChange={(e) => handleDateChange('day', e.target.value)}
                          label="Day"
                        >
                          {days.map((d) => (
                            <MenuItem key={d} value={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </Select>
                        {fieldErrors.dateOfBirth.day && (
                          <span className="text-red-500 text-xs mt-1">{fieldErrors.dateOfBirth.day}</span>
                        )}
                      </FormControl>

                      {/* Year Dropdown */}
                      <FormControl fullWidth variant="outlined" size="small" error={!!fieldErrors.dateOfBirth.year}>
                        <InputLabel>Year</InputLabel>
                        <Select
                          value={year}
                          onChange={(e) => handleDateChange('year', e.target.value)}
                          label="Year"
                        >
                          {years.map((y) => (
                            <MenuItem key={y} value={y}>
                              {y}
                            </MenuItem>
                          ))}
                        </Select>
                        {fieldErrors.dateOfBirth.year && (
                          <span className="text-red-500 text-xs mt-1">{fieldErrors.dateOfBirth.year}</span>
                        )}
                      </FormControl>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Password Input */}
                  <div className="space-y-2">
                    <div className="relative">
                      <TextField
                        fullWidth
                        label="Password"
                        placeholder="Create a password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        variant="outlined"
                        className="rounded-lg"
                        error={!!fieldErrors.password}
                        helperText={fieldErrors.password}
                        required
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </div>
                    {password && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${getPasswordStrengthInfo(passwordStrength).color}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-600">
                            {getPasswordStrengthInfo(passwordStrength).text}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                      Password must:
                      <ul className="list-disc list-inside ml-2">
                        <li>Be between 8 and 20 characters</li>
                        <li>Contain at least one letter</li>
                        <li>Contain at least one number</li>
                        <li>Contain at least one special character</li>
                      </ul>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="relative">
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      variant="outlined"
                      className="rounded-lg"
                      error={!!fieldErrors.confirmPassword}
                      helperText={fieldErrors.confirmPassword}
                      required
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        ),
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full flex items-center justify-center py-3 px-6 rounded-lg shadow-lg bg-[#9147ff] hover:bg-[#7c3bdb] transition font-semibold text-white text-base focus:outline-none mt-6"
              style={{ fontFamily: 'inherit', minHeight: 48 }}
            >
              {currentStep === 1 ? 'Next' : 'Create Account'}
            </button>

            {/* Sign In Link */}
            <div className="text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  // Open Login modal
                  const event = new CustomEvent('openLoginModal');
                  window.dispatchEvent(event);
                }}
                className="text-[#9147ff] hover:text-[#7c3bdb] font-semibold transition-colors"
              >
                Sign in
              </button>
            </div>
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
