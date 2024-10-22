import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Snackbar, Alert } from '@mui/material';
import { login as apiLogin } from '../services/api';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const Login: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // Use AuthContext

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="xs">
            <Box mt={8}>
                <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
                    Login
                </Typography>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const response = await apiLogin(values.email, values.password);
                            const { token } = response; // Adjusted to access token correctly

                            // Check if token exists in the response
                            if (token) {
                                login(token); // Use login from AuthContext
                                navigate('/home'); // Redirect to Home
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
                        <Form>
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
                                color="primary"
                                disabled={isSubmitting}
                            >
                                Sign In
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
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
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
