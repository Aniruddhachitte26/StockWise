// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page to redirect to after login
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // Set error message when auth context error changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
    
    return () => {
      clearError();
    };
  }, [error, clearError]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Check form validity
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    setErrorMessage('');
    
    try {
      await login({ email, password });
      // Successful login will trigger the useEffect above
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
                  <h2>Welcome Back</h2>
                  <p className="text-muted">Sign in to access your account</p>
                </div>
                
                {errorMessage && (
                  <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>
                    {errorMessage}
                  </Alert>
                )}
                
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 8 characters.
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
                    <Button variant="primary" type="submit" disabled={loading}>
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
                
                <div className="auth-divider my-4">
                  <span>OR</span>
                </div>
                
                <div className="d-grid gap-2 mb-4">
                  <Button variant="outline-primary">
                    <i className="bi bi-google me-2"></i>
                    Sign in with Google
                  </Button>
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