// src/pages/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validated, setValidated] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
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
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordsMatch(value === formData.confirmPassword);
      } else {
        setPasswordsMatch(formData.password === value);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Check form validity
    if (form.checkValidity() === false || !passwordsMatch) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    setErrorMessage('');
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      // Successful registration will trigger the useEffect above
    } catch (err) {
      // Error is handled by the auth context
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
                
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide your name.
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email.
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      isInvalid={validated && (!formData.password || !passwordsMatch)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formData.password ? (
                        !passwordsMatch ? 'Passwords do not match.' : ''
                      ) : (
                        'Password must be at least 8 characters.'
                      )}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Password must be at least 8 characters long.
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      isInvalid={validated && (!formData.confirmPassword || !passwordsMatch)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {!passwordsMatch ? 'Passwords do not match.' : 'Please confirm your password.'}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="terms">
                    <Form.Check
                      required
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
                      feedback="You must agree before submitting."
                      feedbackType="invalid"
                    />
                  </Form.Group>
                  
                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
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