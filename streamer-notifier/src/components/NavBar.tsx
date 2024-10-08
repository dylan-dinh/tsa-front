import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, styled } from '@mui/material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#24292e',
}));

const StyledButton = styled('button')(({ theme }) => ({
  color: '#fff',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  marginRight: theme.spacing(2),
  padding: theme.spacing(1),
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <StyledButton onClick={() => navigate('/')}>Home</StyledButton>
        {isLoggedIn && (
          <StyledButton onClick={() => navigate('/dashboard')}>Dashboard</StyledButton>
        )}
        {!isLoggedIn && (
          <>
            <StyledButton onClick={() => navigate('/login')}>Login</StyledButton>
            <StyledButton onClick={() => navigate('/register')}>Register</StyledButton>
          </>
        )}
        {isLoggedIn && (
          <StyledButton onClick={handleLogout}>Logout</StyledButton>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
