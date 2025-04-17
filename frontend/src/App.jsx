// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Keep AuthProvider temporarily if components still rely on it, but aim to remove
import ThemeProvider from './components/common/themeProvider'; // Your Theme Provider

// --- Redux Imports for Routes ---
import { useSelector } from 'react-redux'; // Needed for Protected/Admin Routes

// --- Page Imports ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/Profile';
import StockDetailPage from './pages/StockDetailPage';
import Chat from './pages/Chat';
import About from './components/dashboard/About'; // Assuming About is treated like a page
import MarketOverview from "./components/dashboard/MarketOverview"; // Assuming this is used as a page/route

// --- Admin Page Imports ---
import AdminDashboardPage from './pages/AdminDashboard/AdminDashboardPage';
import UsersManagementPage from './components/admin/UsersManagementPage';
import UserVerificationPage from './components/admin/UserVerificationPage';
import StocksManagementPage from './components/admin/StocksManagementPage';

// --- Other Imports ---
import { initTheme } from './config/themeConfig'; // Theme initialization
import './App.css';
import './assets/styles/theme.css'; // Import your theme CSS

// --- Protected Route Components (Ideally in separate files) ---

// Protected route component for regular users
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, status } = useSelector(state => state.auth);
    const location = useLocation();

    console.log(`ProtectedRoute Check: Status=${status}, IsAuth=${isAuthenticated}`);

    // Handle loading state
    if (status === 'idle' || status === 'loading') {
        console.log("ProtectedRoute: Auth status loading/idle");
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Authentication...</div>; // Replace with Loader component if desired
    }

    // If not authenticated after checking, redirect to login
    if (!isAuthenticated) {
        console.log("ProtectedRoute: Not authenticated, redirecting to login.");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the child component
    console.log("ProtectedRoute: Authenticated, rendering children.");
    return children;
};

// Admin route component with role check
const AdminRoute = ({ children }) => {
    const { isAuthenticated, status, currentUser } = useSelector(state => state.auth);
    const location = useLocation();

    console.log(`AdminRoute Check: Status=${status}, IsAuth=${isAuthenticated}, UserType=${currentUser?.type}`);

    // Handle loading state
    if (status === 'idle' || status === 'loading') {
        console.log("AdminRoute: Auth status loading/idle");
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Authentication...</div>; // Replace with Loader component if desired
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        console.log("AdminRoute: Not authenticated, redirecting to login.");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if the authenticated user is an admin
    if (currentUser?.type !== 'admin') {
        console.log("AdminRoute: User is not admin, redirecting to user dashboard.");
        return <Navigate to="/dashboard" replace />; // Redirect non-admins
    }

    // If authenticated and is an admin, render the child component
    console.log("AdminRoute: Authenticated and Admin, rendering children.");
    return children;
};

// --- Component for defining routes ---
const AppRoutes = () => {
    return (
        // The Chat component might be better placed outside Routes if it's a persistent overlay
        // Or rendered conditionally within specific pages/layouts
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flexGrow: 1 }}> {/* Make main content grow */}
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/stocks/:symbol" element={<StockDetailPage />} />
                    <Route path="/about" element={<About />} />

                    {/* Protected User Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/news" // Assuming MarketOverview serves as the News page
                        element={
                            <ProtectedRoute>
                                <MarketOverview />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    {/* Add other protected routes here (Portfolio, Watchlist, Transactions etc.) */}
                    {/* Example:
          <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
          */}


                    {/* Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <AdminRoute>
                                <AdminDashboardPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <AdminRoute>
                                <UsersManagementPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/verify-users"
                        element={
                            <AdminRoute>
                                <UserVerificationPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/stocks"
                        element={
                            <AdminRoute>
                                <StocksManagementPage />
                            </AdminRoute>
                        }
                    />

                    {/* Redirect /admin to /admin/dashboard */}
                    <Route
                        path="/admin"
                        element={<Navigate to="/admin/dashboard" replace />}
                    />

                    {/* Fallback for unmatched routes */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
            {/* Chat Bot - Rendered persistently */}
            <Chat />
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    // Initialize theme on app load
    useEffect(() => {
        initTheme();
    }, []);

    return (
        // AuthProvider might still be needed if some components haven't been refactored yet
        // Once all components use Redux, AuthProvider can be removed
        <AuthProvider>
            <ThemeProvider> {/* Handles light/dark theme switching */}
                <AppRoutes />
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;