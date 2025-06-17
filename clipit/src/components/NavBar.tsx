import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, styled } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext

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
  const { isAuthenticated, logout } = useAuth(); // Use AuthContext

  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate('/login');
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        {isAuthenticated && (
          <StyledButton onClick={() => navigate('/dashboard')}>Dashboard</StyledButton>
        )}
        {!isAuthenticated && (
          <>
            <StyledButton onClick={() => navigate('/login')}>Login</StyledButton>
            <StyledButton onClick={() => navigate('/register')}>Register</StyledButton>
          </>
        )}
        {isAuthenticated && (
          <StyledButton onClick={handleLogout}>Logout</StyledButton>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;