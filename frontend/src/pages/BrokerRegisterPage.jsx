// src/pages/BrokerRegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PasswordStrengthMeter from '../components/common/PasswordStrengthMeter';
import useAuth from '../hooks/useAuth';



// Broker registration schema
const brokerRegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
    .min(2, 'Name is too short')
    .max(50, 'Name is too long'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*#?&]/, 'Password must contain at least one special character'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  company: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name is too short')
    .max(50, 'Company name is too long'),
  licenseNumber: Yup.string()
    .required('License number is required')
    .min(5, 'License number is too short'),
  experience: Yup.number()
    .required('Years of experience is required')
    .min(0, 'Experience cannot be negative')
    .max(100, 'Experience seems too high'),
  terms: Yup.boolean()
    .required('You must accept the terms and conditions')
    .oneOf([true], 'You must accept the terms and conditions'),
});

const BrokerRegisterPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerAsBroker, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/broker/dashboard');
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Register as broker (with type = 'broker')
      await registerAsBroker({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        company: values.company,
        licenseNumber: values.licenseNumber,
        experience: values.experience
      });
      
      // Successful registration will redirect via the useEffect
      resetForm();
    } catch (err) {
      // Error is handled by the auth context
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <Card className="shadow">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="mb-1">Broker Registration</h2>
                  <p className="text-muted">Join StockWise as a licensed broker</p>
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
                    phone: '',
                    company: '',
                    licenseNumber: '',
                    experience: '',
                    terms: false
                  }}
                  validationSchema={brokerRegisterSchema}
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
                      <Row>
                        <Col md={6}>
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
                        </Col>
                        
                        <Col md={6}>
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
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
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
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
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
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              placeholder="Enter your phone number"
                              value={values.phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.phone && errors.phone}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.phone}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="company">
                            <Form.Label>Company or Organization</Form.Label>
                            <Form.Control
                              type="text"
                              name="company"
                              placeholder="Enter your company name"
                              value={values.company}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.company && errors.company}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.company}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="licenseNumber">
                            <Form.Label>Broker License Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="licenseNumber"
                              placeholder="Enter your license number"
                              value={values.licenseNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.licenseNumber && errors.licenseNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.licenseNumber}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="experience">
                            <Form.Label>Years of Experience</Form.Label>
                            <Form.Control
                              type="number"
                              name="experience"
                              placeholder="Years of experience"
                              value={values.experience}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.experience && errors.experience}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.experience}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

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
                              </Link>{' '}
                              and I confirm that I am a licensed broker.
                            </span>
                          }
                        />
                      </Form.Group>

                      <div className="d-grid gap-2">
                        <Button
                          variant="primary"
                          type="submit"
                          size="lg"
                          disabled={loading || isSubmitting}
                        >
                          {loading || isSubmitting ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Submitting...
                            </>
                          ) : (
                            'Register as Broker'
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Sign in
                    </Link>
                  </p>
                  <p className="mt-2">
                    Want to register as a regular user?{' '}
                    <Link to="/register" className="text-decoration-none">
                      User Registration
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

export default BrokerRegisterPage;