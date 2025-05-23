import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FcGoogle = React.lazy(() =>
  import('react-icons/fc').then(module => ({ default: module.FcGoogle as React.ComponentType<any> }))
);

const FaTwitch = React.lazy(() =>
  import('react-icons/fa').then(module => ({ default: module.FaTwitch as React.ComponentType<any> }))
);

const CLipIt_Logo = process.env.PUBLIC_URL + '/ClipIt_logo.jpeg';

interface SocialAuthProps {
  isOpen: boolean;
  onClose: () => void;
  provider: 'google' | 'twitch';
}

const SocialAuth: React.FC<SocialAuthProps> = ({ isOpen, onClose, provider }) => {
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAuth = async () => {
    try {
      // Here you would implement the actual OAuth flow
      // For Google:
      // const response = await googleAuth();
      // For Twitch:
      // const response = await twitchAuth();
      
      // For now, we'll simulate a successful auth
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setSnackbarOpen(true);
    }
  };

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
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              {provider === 'google' ? 'Sign in with Google' : 'Sign in with Twitch'}
            </h2>

            {/* Auth Button */}
            <button
              onClick={handleAuth}
              className={`w-full flex items-center justify-center py-3 px-6 rounded-lg shadow-lg transition font-semibold text-base focus:outline-none mt-6 ${
                provider === 'google' 
                  ? 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-900' 
                  : 'bg-[#9147ff] hover:bg-[#7c3bdb] text-white'
              }`}
              style={{ fontFamily: 'inherit', minHeight: 48 }}
            >
              {provider === 'google' ? (
                <>
                  <span className="w-6 h-6 mr-2 flex items-center">
                    <Suspense fallback={null}>
                      <FcGoogle size={22} />
                    </Suspense>
                  </span>
                  Continue with Google
                </>
              ) : (
                <>
                  <span className="w-6 h-6 mr-2 flex items-center">
                    <Suspense fallback={null}>
                      <FaTwitch size={22} />
                    </Suspense>
                  </span>
                  Continue with Twitch
                </>
              )}
            </button>

            {/* Info Text */}
            <div className="text-sm text-gray-600 text-center">
              By continuing, you agree to ClipIt's Terms of Service and Privacy Policy
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
};

export default SocialAuth; 