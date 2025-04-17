import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import { loginSchema } from '../validations/schemas';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import GoogleLoginButton from '../components/common/GoogleLoginButton';

const LoginPage = () => {
    const [errorMessage, setErrorMessage] = useState('');

    const { login, loading, error, isAuthenticated, currentUser, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the page to redirect to after login
    const from = location.state?.from?.pathname || '/dashboard';

    // Redirect if already authenticated, with role-based redirect
    useEffect(() => {
        if (isAuthenticated) {
      // Redirect admins to admin dashboard
      if (currentUser?.type === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Regular users go to user dashboard
              navigate(from, { replace: true });
      }
        }
    }, [isAuthenticated, navigate, from, currentUser]);

    // Set error message when auth context error changes
    useEffect(() => {
        if (error) {
            setErrorMessage(error);
        }

        return () => {
            clearError();
        };
    }, [error, clearError]);

    const handleSubmit = async (values, { setSubmitting }) => {
        setErrorMessage('');

        try {
      console.log('Login attempt with:', values);
            await login({ email: values.email, password: values.password });
            // Successful login will trigger the useEffect above
        } catch (err) {
      console.error('Login error:', err);
            // Error is handled by the auth context
            setSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />

            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="auth-card">
                            <Card.Body>
                                <div className="text-center mb-4">
                                    <h2>Welcome Back</h2>
                                    <p className="text-muted">Sign in to access your account</p>
                                </div>

                                {errorMessage && (
                                    <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>
                                        {errorMessage}
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
                                        handleSubmit,
                                        isSubmitting,
                                    }) => {
                    // Debug logs
                    console.log('Login form values:', values);
                    console.log('Login form errors:', errors);
                    console.log('Login form touched:', touched);
                    
                    return (
                                          <Form noValidate onSubmit={handleSubmit}>
                                              <Form.Group className="mb-3" controlId="email">
                                                  <Form.Label>Email address</Form.Label>
                                                  <Form.Control
                                                      type="email"
                                                      placeholder="name@example.com"
                                                      name="email"
                                                      value={values.email}
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      isInvalid={touched.email && errors.email}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                      {errors.email}
                                                  </Form.Control.Feedback>
                                              </Form.Group>
  
                                              <Form.Group className="mb-3" controlId="password">
                                                  <Form.Label>Password</Form.Label>
                                                  <Form.Control
                                                      type="password"
                                                      placeholder="Enter your password"
                                                      name="password"
                                                      value={values.password}
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      isInvalid={touched.password && errors.password}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                      {errors.password}
                                                  </Form.Control.Feedback>
                                              </Form.Group>
  
                                              <div className="d-flex justify-content-between align-items-center mb-3">
                                                  <Form.Check
                                                      type="checkbox"
                                                      id="rememberMe"
                                                      label="Remember me"
                                                  />
                                                  <Link to="/forgot-password" className="text-decoration-none">
                                                      Forgot Password?
                                                  </Link>
                                              </div>
  
                                              <div className="d-grid gap-2">
                                                  <Button
                                                      variant="primary"
                                                      type="submit"
                                                      disabled={loading || isSubmitting}
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
                                    <GoogleLoginButton />
                                </div>

                                <div className="text-center">
                                    <p className="mb-0">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-decoration-none">
                                            Sign up
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