// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import DashboardPage from './pages/DashboardPage';
// import ThemeProvider from './components/common/ThemeProvider';  
// import StockDetailPage from './pages/StockDetailPage';
// import './assets/styles/theme.css';

// // Admin Pages
// import AdminDashboardPage from './pages/AdminDashboard/AdminDashboardPage';
// import UsersManagementPage from './components/admin/UsersManagementPage';
// import UserVerificationPage from './components/admin/UserVerificationPage';
// import StocksManagementPage from './components/admin/StocksManagementPage';

// import useAuth from './hooks/useAuth';
// import './App.css';

// // Protected route component for regular users
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// };

// // Admin route component with role check
// const AdminRoute = ({ children }) => {
//   const { isAuthenticated, loading, currentUser } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   // Check if user is an admin
//   if (currentUser?.type !== 'admin') {
//     return <Navigate to="/dashboard" />;
//   }

//   return children;
// };

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<HomePage />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />
//       <Route path="/stocks/:symbol" element={<StockDetailPage />} />

//       {/* Protected User Routes */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin Routes */}
//       <Route
//         path="/admin/dashboard"
//         element={
//           <AdminRoute>
//             <AdminDashboardPage />
//           </AdminRoute>
//         }
//       />
//       <Route
//         path="/admin/users"
//         element={
//           <AdminRoute>
//             <UsersManagementPage />
//           </AdminRoute>
//         }
//       />
//       <Route
//         path="/admin/verify-users"
//         element={
//           <AdminRoute>
//             <UserVerificationPage />
//           </AdminRoute>
//         }
//       />
//       <Route
//         path="/admin/stocks"
//         element={
//           <AdminRoute>
//             <StocksManagementPage />
//           </AdminRoute>
//         }
//       />

//       {/* Redirect to admin dashboard if admin accesses /dashboard */}
//       <Route
//         path="/admin"
//         element={<Navigate to="/admin/dashboard" replace />}
//       />

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// };

// const App = () => {
//   // Initialize theme on app load
//   useEffect(() => {
//     // Import and call initTheme from our config
//     const { initTheme } = require('./config/themeConfig');
//     initTheme();
//   }, []);
//   return (
//     <Router>
//       <AuthProvider>
//       <ThemeProvider>
//           <AppRoutes />
//         </ThemeProvider>
//       </AuthProvider>
//     </Router>
//   );
// };

// export default App;
// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ThemeProvider from './components/common/themeProvider';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MarketOverview from "./components/dashboard/MarketOverview"
import ProfilePage  from  "./pages/Profile"
import About from "./components/dashboard/About"
import StockDetailPage from './pages/StockDetailPage';

// Admin Pages - Based on your folder structure
import AdminDashboardPage from './pages/AdminDashboard/AdminDashboardPage';
import UsersManagementPage from './components/admin/UsersManagementPage';
import UserVerificationPage from './components/admin/UserVerificationPage';
import StocksManagementPage from './components/admin/StocksManagementPage';
import { initTheme } from './config/themeConfig';
import useAuth from './hooks/useAuth';
import Chat from './pages/Chat';
import './App.css';
import './assets/styles/theme.css'; // Import our theme CSS

// Protected route component for regular users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Admin route component with role check
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user is an admin
  if (currentUser?.type !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/stocks/:symbol" element={<StockDetailPage />} />
      
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
          path="/news" 
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
        <Route path="/about" element={<About />} />
      
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
      
      {/* Redirect to admin dashboard if admin accesses /dashboard */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  // Initialize theme on app load
  useEffect(() => {
    // Call initTheme directly instead of using require
    initTheme();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;