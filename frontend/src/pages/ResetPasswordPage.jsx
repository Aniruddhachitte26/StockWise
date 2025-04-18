// frontend/src/pages/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom'; // Use useLocation to potentially get email
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PasswordStrengthMeter from '../components/common/PasswordStrengthMeter';
import { API_URL } from '../config/constants';

// Validation Schema
const resetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'), // Require email
    otp: Yup.string()
        .required('OTP is required')
        .matches(/^[0-9]{6}$/, 'OTP must be exactly 6 digits'),
    password: Yup.string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain an uppercase letter')
        .matches(/[a-z]/, 'Password must contain a lowercase letter')
        .matches(/[0-9]/, 'Password must contain a number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain a special character'),
    confirmPassword: Yup.string()
        .required('Please confirm your new password')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Use location to get email if passed from ForgotPasswordPage
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // Pre-fill email if passed via state (optional, but helpful)
    const initialEmail = location.state?.email || '';

    // Clear error on unmount
    useEffect(() => {
        return () => setError('');
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        setLoading(true);
        setError('');
        try {
            // Call the backend endpoint to reset password with OTP
            await axios.post(`${API_URL}/auth/reset-password-otp`, {
                email: values.email,
                otp: values.otp,
                password: values.password,
                confirmPassword: values.confirmPassword,
            });

            // Redirect to login page with a success message
            navigate('/login', {
                state: { message: 'Password reset successful! Please log in with your new password.' },
                replace: true // Prevent going back to reset page
            });

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || "Failed to reset password. Please try again.";
            setError(errorMessage);
            console.error("Reset Password Error:", err);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <Container className="py-5" style={{ minHeight: 'calc(100vh - 120px)' }}>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="auth-card shadow-lg border-0">
                            <Card.Body className="p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold">Reset Your Password</h2>
                                    <p className="text-muted">Enter the OTP sent to your email and set a new password.</p>
                                </div>

                                {error && <Alert variant="danger">{error}</Alert>}

                                <Formik
                                    initialValues={{
                                        email: initialEmail, // Use pre-filled email
                                        otp: '',
                                        password: '',
                                        confirmPassword: ''
                                    }}
                                    validationSchema={resetPasswordSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize // Allow initialValues to update if email comes from state
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit: formikSubmit,
                                        isSubmitting,
                                    }) => (
                                        <Form noValidate onSubmit={formikSubmit}>
                                            <Form.Group className="mb-3 position-relative" controlId="resetEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Enter the email used for OTP request"
                                                    name="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={touched.email && !!errors.email}
                                                    disabled={loading}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-3 position-relative" controlId="resetOtp">
                                                <Form.Label>One-Time Password (OTP)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter the 6-digit code"
                                                    name="otp"
                                                    value={values.otp}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={touched.otp && !!errors.otp}
                                                    maxLength={6}
                                                    disabled={loading}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.otp}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-3 position-relative" controlId="resetPassword">
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Enter new password"
                                                    name="password"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={touched.password && !!errors.password}
                                                    disabled={loading}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.password}
                                                </Form.Control.Feedback>
                                                <PasswordStrengthMeter password={values.password} />
                                            </Form.Group>

                                            <Form.Group className="mb-4 position-relative" controlId="resetConfirmPassword">
                                                <Form.Label>Confirm New Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Confirm new password"
                                                    name="confirmPassword"
                                                    value={values.confirmPassword}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                                                    disabled={loading}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.confirmPassword}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <div className="d-grid gap-2">
                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                    disabled={loading || isSubmitting}
                                                    size="lg"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Spinner animation="border" size="sm" className="me-2" />
                                                            Resetting...
                                                        </>
                                                    ) : (
                                                        'Reset Password'
                                                    )}
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default ResetPasswordPage;