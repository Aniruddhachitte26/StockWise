import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { registerSchema } from '../validations/schemas';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PasswordStrengthMeter from '../components/common/PasswordStrengthMeter';

const RegisterPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  
  const { register, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
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
      await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password
      });
      // Successful registration will trigger the useEffect above
    } catch (err) {
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
                  <h2>Create Your Account</h2>
                  <p className="text-muted">Join StockWise Trading today</p>
                </div>
                
                {errorMessage && (
                  <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>
                    {errorMessage}
                  </Alert>
                )}
                
                <Formik
                  initialValues={{
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    terms: false
                  }}
                  validationSchema={registerSchema}
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
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="fullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          placeholder="Enter your full name"
                          value={values.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.fullName && errors.fullName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="name@example.com"
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
                          name="password"
                          placeholder="Create a password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.password && errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                        
                        {/* Password Strength Meter */}
                        {values.password && (
                          <PasswordStrengthMeter password={values.password} />
                        )}
                        
                        <Form.Text className="text-muted">
                          Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.
                        </Form.Text>
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.confirmPassword && errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="terms">
                        <Form.Check
                          type="checkbox"
                          name="terms"
                          checked={values.terms}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.terms && errors.terms}
                          feedback={errors.terms}
                          feedbackType="invalid"
                          label={
                            <span>
                              I agree to the{' '}
                              <Link to="/terms" target="_blank" className="text-decoration-none">
                                Terms of Service
                              </Link>{' '}
                              and{' '}
                              <Link to="/privacy" target="_blank" className="text-decoration-none">
                                Privacy Policy
                              </Link>
                            </span>
                          }
                        />
                      </Form.Group>
                      
                      <div className="d-grid gap-2">
                        <Button 
                          variant="primary" 
                          type="submit" 
                          disabled={loading || isSubmitting}
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Creating Account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
                
                <div className="auth-divider my-4">
                  <span>OR</span>
                </div>
                
                <div className="d-grid gap-2 mb-4">
                  <Button variant="outline-primary">
                    <i className="bi bi-google me-2"></i>
                    Sign up with Google
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Sign in
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

export default RegisterPage;