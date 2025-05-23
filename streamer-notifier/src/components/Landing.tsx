import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaTwitch } from 'react-icons/fa';

// The logo should be placed in the public folder as ClipIt_logo.jpeg
const CLipIt_Logo = process.env.PUBLIC_URL + '/ClipIt_logo.jpeg';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Placeholder handlers for authentication
  const handleGoogleSignUp = () => {
    // TODO: Integrate Google OAuth
    alert('Google sign up coming soon!');
  };

  const handleTwitchSignUp = () => {
    // TODO: Integrate Twitch OAuth
    alert('Twitch sign up coming soon!');
  };

  const handleEmailSignUp = () => {
    // TODO: Navigate to email registration page
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans">
      {/* Left: Logo */}
      <div className="md:w-1/2 flex items-center justify-center bg-white">
        <img
          src={CLipIt_Logo}
          alt="ClipIt Logo"
          className="w-64 h-64 object-contain"
          style={{ minWidth: 200, minHeight: 200 }}
        />
      </div>

      {/* Right: Auth Panel */}
      <div className="md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
          {/* Catch Line */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#2ea44f] mb-6 text-center">
            Share your best. Connect with the rest.
          </h2>

          {/* Sign Up Buttons */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center py-3 mb-3 rounded font-semibold text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 transition"
            style={{ fontFamily: 'inherit' }}
          >
            <FcGoogle className="w-6 h-6 mr-2" />
            Continue with Google
          </button>
          <button
            onClick={handleTwitchSignUp}
            className="w-full flex items-center justify-center py-3 mb-3 rounded font-semibold text-white"
            style={{
              backgroundColor: '#9147ff',
              fontFamily: 'inherit',
              boxShadow: 'none'
            }}
          >
            <FaTwitch className="w-6 h-6 mr-2" />
            Continue with Twitch
          </button>

          {/* Separator */}
          <div className="flex items-center w-full my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-3 text-gray-400 font-semibold">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Email Sign Up */}
          <button
            onClick={handleEmailSignUp}
            className="w-full py-3 mb-6 rounded font-semibold text-white"
            style={{
              backgroundColor: '#2ea44f',
              fontFamily: 'inherit'
            }}
          >
            Sign up with Email
          </button>

          {/* Login Section */}
          <div className="w-full flex flex-col items-center">
            <hr className="w-1/2 border-gray-200 mb-2" />
            <span className="text-gray-600 text-sm mb-2">Already registered?</span>
            <button
              onClick={handleLogin}
              className="w-full py-2 rounded font-semibold text-white"
              style={{
                backgroundColor: '#1976d2',
                fontFamily: 'inherit'
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;