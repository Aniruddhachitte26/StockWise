// src/components/admin/AdminNavbar.jsx

import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../common/themeProvider';
import useAuth from './../../hooks/useAuth';

const NavbarStyles = {
  darkBg: { backgroundColor: 'var(--neutralBg)', borderBottom: '1px solid var(--border)' },
  lightBg: { backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' },
  darkText: { color: 'var(--textPrimary)' },
  navLink: { color: 'var(--textSecondary)' },
  navLinkActive: { color: 'var(--primary)' },
  logoStyle: { color: 'var(--primary)', fontWeight: 'bold' }
};
const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { currentTheme, toggleTheme } = useTheme();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Active link check
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Navbar className="navbar-themed shadow-sm py-2 px-0" expand="lg" variant={currentTheme === 'dark' ? 'dark' : 'light'}>
      <Container>
        <Navbar.Brand as={Link} to="/admin/dashboard" className="fw-bold d-flex align-items-center">
          <i className="bi bi-bar-chart-fill me-2"></i>
          <span>StockWise Admin</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="admin-navbar" />
        
        <Navbar.Collapse id="admin-navbar">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/admin/dashboard" 
              className={isActive('/admin/dashboard')}
            >
              <i className="bi bi-speedometer2 me-1"></i> Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/users" 
              className={isActive('/admin/users')}
            >
              <i className="bi bi-people me-1"></i> Users
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/verify-users" 
              className={isActive('/admin/verify-users')}
            >
              <i className="bi bi-check-circle me-1"></i> Verify Users
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/stocks" 
              className={isActive('/admin/stocks')}
            >
              <i className="bi bi-graph-up me-1"></i> Stocks
            </Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center">
            <button 
              className="theme-toggle me-3" 
              onClick={toggleTheme}
              title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              {currentTheme === 'light' ? (
                <i className="bi bi-moon-stars"></i>
              ) : (
                <i className="bi bi-sun"></i>
              )}
            </button>
            
            <Button 
              variant={currentTheme === 'dark' ? 'outline-light' : 'outline-dark'} 
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;