import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/NavBar';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import LandingPage from './components/Landing';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {!isLandingPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider> {/* Wrap your app with AuthProvider */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
