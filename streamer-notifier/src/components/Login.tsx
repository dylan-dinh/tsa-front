import React, { useState, Suspense } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { login as apiLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FcGoogle = React.lazy(() =>
  import('react-icons/fc').then(module => ({ default: module.FcGoogle as React.ComponentType<any> }))
);

const CLipIt_Logo = process.env.PUBLIC_URL + '/ClipIt_logo.jpeg';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
});

interface LoginProps {
    isOpen: boolean;
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleGoogleSignUp = () => {
        // TODO: Implement Google OAuth
        console.log('Google sign up clicked');
    };

    const handleTwitchSignUp = () => {
        // TODO: Implement Twitch OAuth
        console.log('Twitch sign up clicked');
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
                            Connect to Clip
                        </h2>

                        {/* Social Sign Up Buttons */}
                        <div className="w-full space-y-3">
                            <button
                                onClick={handleGoogleSignUp}
                                className="w-full flex items-center justify-center py-3 px-6 rounded-full shadow-lg bg-white border border-gray-200 hover:bg-gray-100 transition font-semibold text-gray-900 text-base gap-2 focus:outline-none"
                            >
                                <Suspense fallback={null}>
                                    <FcGoogle size={22} />
                                </Suspense>
                                Sign up with Google
                            </button>
                            <button
                                onClick={handleTwitchSignUp}
                                className="w-full flex items-center justify-center py-3 px-6 rounded-full shadow-lg bg-white border border-gray-200 hover:bg-gray-100 transition font-semibold text-[#9147ff] text-base gap-2 focus:outline-none"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                                </svg>
                                Sign up with Twitch
                            </button>
                        </div>

                        {/* OR Separator */}
                        <div className="flex items-center w-full">
                            <div className="flex-grow h-px bg-gray-200" />
                            <span className="mx-3 text-gray-400 font-semibold text-sm">OR</span>
                            <div className="flex-grow h-px bg-gray-200" />
                        </div>

                        {/* Email Form */}
                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const response = await apiLogin(values.email, '');
                                    const { token } = response;

                                    if (token) {
                                        login(token);
                                        onClose();
                                        navigate('/home');
                                    } else {
                                        setError('Login failed. Please try again.');
                                        setOpenSnackbar(true);
                                    }
                                } catch (error) {
                                    console.error('Login failed:', error);
                                    setError('Login failed. Please try again.');
                                    setOpenSnackbar(true);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ errors, touched, isSubmitting }) => (
                                <Form className="w-full space-y-4">
                                    <Field
                                        as={TextField}
                                        name="email"
                                        placeholder="Phone number or email address"
                                        fullWidth
                                        variant="outlined"
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                        className="rounded-lg"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center py-3 px-6 rounded-full shadow-lg bg-[#9147ff] hover:bg-[#7c3bdb] transition font-semibold text-white text-base focus:outline-none"
                                        style={{ fontFamily: 'inherit', minHeight: 48 }}
                                    >
                                        Next
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        {/* Forgot Password */}
                        <button
                            onClick={() => {/* TODO: Implement forgot password */}}
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Forgot password?
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-sm text-gray-600">
                            Not registered yet?{' '}
                            <button
                                onClick={() => {
                                    onClose();
                                    // Open Register modal
                                    const event = new CustomEvent('openRegisterModal');
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
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Login;
