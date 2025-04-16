// src/components/common/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Form, InputGroup, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// Custom styles to eliminate extra spacing
const navbarStyles = {
  container: {
    maxWidth: '100%',
    padding: '0 15px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center'
  },
  searchContainer: {
    maxWidth: '400px',
    width: '100%'
  }
};

const AppNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Get auth state from context
  const { isAuthenticated, currentUser, logout } = useAuth();
  
  // Check if user is admin
  const isAdmin = currentUser?.type === 'admin';
  
  // Get username to display
  const displayName = currentUser?.fullName || "My Account";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // For debugging purposes - log whenever the user data changes
  useEffect(() => {
    console.log("Current user in navbar:", currentUser);
  }, [currentUser]);

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm py-2 px-0">
      <div style={navbarStyles.container} className="d-flex w-100 justify-content-between">
        <Navbar.Brand as={Link} to="/" style={navbarStyles.brand}>
          <img
            src="/logo.png" // You would need to add your own logo
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="StockWise Logo"
          />
          <span className="fw-bold text-primary">StockWise</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/stocks">Stocks</Nav.Link>
            <Nav.Link as={Link} to="/news">Market News</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
          
          <div style={navbarStyles.searchContainer} className="mx-lg-2">
            <Form className="d-flex" onSubmit={handleSearch}>
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Search stocks..."
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline-primary" type="submit">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </Form>
          </div>
          
          {isAuthenticated ? (
            <Nav>
              <NavDropdown title={displayName} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/portfolio">Portfolio</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/watchlist">Watchlist</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/transactions">Transactions</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                {isAdmin && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin">Admin Panel</NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav className="d-flex">
              <Nav.Link as={Link} to="/login" className="me-2">
                <Button variant="outline-primary">Log In</Button>
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                <Button variant="primary">Sign Up</Button>
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default AppNavbar;