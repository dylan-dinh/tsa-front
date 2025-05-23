// Requirements to run this component:
// npm install react-icons@latest react-router-dom@latest

import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

const FcGoogle = React.lazy(() =>
  import('react-icons/fc').then(module => ({ default: module.FcGoogle as React.ComponentType<any> }))
);
const FaTwitch = React.lazy(() =>
  import('react-icons/fa').then(module => ({ default: module.FaTwitch as React.ComponentType<any> }))
);

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

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left: Logo, always centered and prominent but not too tall */}
      <div className="md:w-1/2 flex items-center justify-center bg-white px-4 py-8 md:py-0 md:h-screen">
        <img
          src={CLipIt_Logo}
          alt="ClipIt Logo"
          className="max-h-48 md:max-h-96 w-auto object-contain"
          style={{ minWidth: 140, maxWidth: '90%' }}
        />
      </div>

      {/* Right: Centered content block */}
      <div className="md:w-1/2 flex items-center justify-center bg-white px-6 py-8 md:py-0 md:h-screen">
        <div className="w-full max-w-md flex flex-col items-center md:items-start justify-center">
          {/* Headline */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-10 text-left w-full leading-tight">
            Share your best. Connect with the rest.
          </h1>

          {/* Sign Up Buttons (stacked, pill-shaped, soft shadow) */}
          <div className="w-full flex flex-col gap-4 mb-6">
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center py-3 px-6 rounded-full shadow-lg bg-white border border-gray-200 hover:bg-gray-100 transition font-semibold text-gray-900 text-base gap-2 focus:outline-none"
              style={{ fontFamily: 'inherit', minHeight: 48 }}
            >
              <Suspense fallback={null}>
                <FcGoogle size={22} />
              </Suspense>
              Sign up with Google
            </button>
            <button
              onClick={handleTwitchSignUp}
              className="w-full flex items-center justify-center py-3 px-6 rounded-full shadow-lg bg-white border border-gray-200 hover:bg-gray-100 transition font-semibold text-[#9147ff] text-base gap-2 focus:outline-none"
              style={{ fontFamily: 'inherit', minHeight: 48 }}
            >
              <Suspense fallback={null}>
                <FaTwitch size={22} />
              </Suspense>
              Sign up with Twitch
            </button>
          </div>

          {/* OR Separator */}
          <div className="flex items-center w-full my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-3 text-gray-400 font-semibold text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          {/* Create Account Button */}
          <button
            onClick={handleCreateAccount}
            className="w-full py-3 rounded-full shadow-lg bg-[#9147ff] hover:bg-[#7c3bdb] transition font-semibold text-white text-base mb-8"
            style={{ fontFamily: 'inherit', minHeight: 48 }}
          >
            Create an account
          </button>

          {/* Already signed in? Login */}
          <div className="w-full flex flex-col items-center gap-4 mt-8">
            <span className="text-gray-500 text-sm">Already signed in?</span>
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center py-3 px-6 rounded-full shadow-lg bg-white border border-gray-200 hover:bg-gray-100 transition font-semibold text-[#9147ff] text-base focus:outline-none"
              style={{ fontFamily: 'inherit', minHeight: 48 }}
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