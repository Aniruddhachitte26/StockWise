// src/components/common/GoogleLoginButton.jsx
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import useAuth from '../../hooks/useAuth';

const GoogleLoginButton = ({ isRegistration = false }) => {
    const { login } = useAuth();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Send the token to your backend
                const response = await axios.post(`${API_URL}/auth/google`, {
                    idToken: tokenResponse.access_token
                });

                // Use your existing auth context to handle the login
                if (response.data && response.data.token) {
                    login({
                        token: response.data.token,
                        user: response.data.user
                    });
                }
            } catch (error) {
                console.error('Google login error:', error);
            }
        },
        onError: (error) => {
            console.error('Google login failed:', error);
        }
    });

    return (
        <Button
            variant="outline-primary"
            onClick={handleGoogleLogin}
            className="w-100 d-flex align-items-center justify-content-center"
        >
            <i className="bi bi-google me-2"></i>
            {isRegistration ? 'Sign up with Google' : 'Sign in with Google'}
        </Button>
    );
};

export default GoogleLoginButton;