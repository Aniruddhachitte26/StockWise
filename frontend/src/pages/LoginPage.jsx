// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import { loginSchema } from '../validations/schemas'; // Assuming this schema is correct

// Common Components
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import GoogleLoginButton from '../components/common/GoogleLoginButton'; // Ensure this uses Redux dispatch internally

// --- Redux Imports ---
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, googleLoginHandler } from '../redux/features/authSlice'; // Adjust path if needed

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // --- Select state from Redux store ---
    // state.auth should match the key used in your store.js reducer object
    const { status, error, isAuthenticated, user } = useSelector(state => state.auth);
    const loading = status === 'loading'; // Derive loading state from status

    // Determine where to redirect after login
    const from = location.state?.from?.pathname || '/dashboard';

    // --- Redirect Effect ---
    // Redirects user if already authenticated, handles admin/user roles
    useEffect(() => {
        if (isAuthenticated) {
            if (user?.type === 'admin') {
                console.log("Admin detected, redirecting to /admin/dashboard");
                navigate('/admin/dashboard', { replace: true });
            } else {
                console.log(`User detected, redirecting to ${from}`);
                navigate(from, { replace: true });
            }
        }
    }, [isAuthenticated, navigate, from, user]);

    // --- Clear Redux error ---
    // Clears any previous error when the component mounts or the location changes
    useEffect(() => {
        dispatch(clearError());
        // Optional: Clear error when component unmounts as well
        return () => {
            dispatch(clearError());
        };
    }, [dispatch, location]);

    // --- Form Submission Handler ---
    const handleSubmit = (values, { setSubmitting }) => {
        console.log('Attempting login with credentials:', values);
        // Dispatch the loginUser async thunk action
        dispatch(loginUser({ email: values.email, password: values.password }))
            .unwrap() // Optional: .unwrap() can be used to handle promise result directly here if needed
            .catch((err) => {
                // Error is already handled by the slice and set in the Redux state
                console.error("Login dispatch rejected:", err);
            })
            .finally(() => {
                // We rely on the 'status' from Redux state for loading,
                // but we can keep Formik's submitting state synced if needed.
                // Setting it based on Redux state is tricky, maybe just set to false?
                setSubmitting(false);
            });
    };

    // --- Error Alert Close Handler ---
    const handleAlertClose = () => {
        dispatch(clearError()); // Dispatch action to clear the error in Redux state
    };

    return (
        <>
            <Navbar />

            <Container className="py-5" style={{ minHeight: 'calc(100vh - 120px)' }}> {/* Adjust minHeight based on Navbar/Footer */}
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="auth-card shadow-lg border-0">
                            <Card.Body className="p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold">Welcome Back</h2>
                                    <p className="text-muted">Sign in to access your StockWise account</p>
                                </div>

                                {/* Display error from Redux state */}
                                {error && (
                                    <Alert variant="danger" dismissible onClose={handleAlertClose} className="d-flex align-items-center">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {error} {/* Display the error message from Redux state */}
                                    </Alert>
                                )}

                                <Formik
                                    initialValues={{ email: '', password: '' }}
                                    validationSchema={loginSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit: formikSubmit, // Rename to avoid conflict
                                        isSubmitting, // Formik's submitting state
                                    }) => {
                                        // Function to handle input changes and clear Redux error
                                        const handleInputChange = (e) => {
                                            handleChange(e); // Call original Formik handler
                                            if (error) {
                                                dispatch(clearError()); // Clear Redux error state when user types
                                            }
                                        };

                                        return (
                                            <Form noValidate onSubmit={formikSubmit}>
                                                <Form.Group className="mb-3 position-relative" controlId="loginEmail">
                                                    <Form.Label>Email address</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        name="email"
                                                        value={values.email}
                                                        onChange={handleInputChange} // Use wrapped handler
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.email && !!errors.email}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.email}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-3 position-relative" controlId="loginPassword">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="Enter your password"
                                                        name="password"
                                                        value={values.password}
                                                        onChange={handleInputChange} // Use wrapped handler
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.password && !!errors.password}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.password}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <div className="d-flex justify-content-between align-items-center mb-4">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="rememberMe"
                                                        label="Remember me"
                                                        name="rememberMe" // Added name for potential future use
                                                    />
                                                    <Link to="/forgot-password" className="text-decoration-none small">
                                                        Forgot Password?
                                                    </Link>
                                                </div>

                                                <div className="d-grid gap-2">
                                                    <Button
                                                        variant="primary"
                                                        type="submit"
                                                        disabled={loading || isSubmitting} // Disable if Redux is loading OR Formik is submitting
                                                        size="lg"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <Spinner animation="border" size="sm" className="me-2" />
                                                                Signing In...
                                                            </>
                                                        ) : (
                                                            'Sign In'
                                                        )}
                                                    </Button>
                                                </div>
                                            </Form>
                                        );
                                    }}
                                </Formik>

                                <div className="auth-divider my-4">
                                    <span>OR</span>
                                </div>

                                <div className="d-grid gap-2 mb-4">
                                    {/* GoogleLoginButton should ideally dispatch googleLoginHandler internally */}
                                    <GoogleLoginButton />
                                </div>

                                <div className="text-center">
                                    <p className="mb-0 text-muted">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-decoration-none fw-medium">
                                            Sign up now
                                        </Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </>
    );
};

export default LoginPage;