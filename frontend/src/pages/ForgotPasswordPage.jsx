// frontend/src/pages/ForgotPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { API_URL } from '../config/constants';
import { Link, useNavigate } from 'react-router-dom';

// Validation Schema
const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
});

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Clear messages when component unmounts
    useEffect(() => {
        return () => {
            setMessage('');
            setError('');
        };
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        setLoading(true);
        setMessage('');
        setError('');
        try {
            // Call the backend endpoint
            const response = await axios.post(`${API_URL}/auth/forgot-password`, {
                email: values.email,
            });
            console.log("OTP request successful, navigating to reset page with email:", values.email);
            navigate('/reset-password', { state: { email: values.email } });
            // Display the generic success message from the backend
            //setMessage(response.data.message || "If an account exists, an OTP has been sent.");

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || "An error occurred. Please try again.";
            // Avoid showing specific "user not found" errors for security
            if (errorMessage.toLowerCase().includes('user not found')) {
                setMessage("If an account exists, an OTP has been sent."); // Show generic message
            } else {
                setError(errorMessage);
            }
            console.error("Forgot Password Error:", err);
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
                                    <h2 className="fw-bold">Forgot Your Password?</h2>
                                    <p className="text-muted">
                                        Enter your email address below and we'll send you an OTP to reset your password.
                                    </p>
                                </div>

                                {message && <Alert variant="success">{message}</Alert>}
                                {error && <Alert variant="danger">{error}</Alert>}

                                <Formik
                                    initialValues={{ email: '' }}
                                    validationSchema={forgotPasswordSchema}
                                    onSubmit={handleSubmit}
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
                                            <Form.Group className="mb-4 position-relative" controlId="forgotPassEmail">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Enter your registered email"
                                                    name="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={touched.email && !!errors.email}
                                                    disabled={loading || message} // Disable after successful request
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <div className="d-grid gap-2">
                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                    disabled={loading || isSubmitting || message} // Disable if loading or success message shown
                                                    size="lg"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Spinner animation="border" size="sm" className="me-2" />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        'Send Reset OTP'
                                                    )}
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>

                                <div className="text-center mt-4">
                                    <Link to="/login" className="text-decoration-none">
                                        <i className="bi bi-arrow-left me-1"></i>
                                        Back to Login
                                    </Link>
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

export default ForgotPasswordPage;