import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { login as apiLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
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
                        <h3 className="text-xl font-semibold text-gray-900">Login</h3>
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
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const response = await apiLogin(values.email, values.password);
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
                                <Form className="space-y-4">
                                    <Field
                                        as={TextField}
                                        name="email"
                                        label="Email"
                                        fullWidth
                                        margin="normal"
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                    />
                                    <Field
                                        as={TextField}
                                        name="password"
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        margin="normal"
                                        error={touched.password && Boolean(errors.password)}
                                        helperText={touched.password && errors.password}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        className="bg-[#9147ff] hover:bg-[#7c3bdb] text-white font-semibold py-2 px-4 rounded-full transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Sign In
                                    </Button>
                                </Form>
                            )}
                        </Formik>
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
