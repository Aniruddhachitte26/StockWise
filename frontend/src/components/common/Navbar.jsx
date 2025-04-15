// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Form, InputGroup, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AppNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // This would be handled by your authentication context/state
  const isLoggedIn = false;
  const isAdmin = false;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
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
          
          <Form className="d-flex mx-lg-4" onSubmit={handleSearch}>
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
          
          {isLoggedIn ? (
            <Nav>
              <NavDropdown title="My Account" id="basic-nav-dropdown" align="end">
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
                <NavDropdown.Item as={Link} to="/logout">Logout</NavDropdown.Item>
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
      </Container>
    </Navbar>
  );
};

export default AppNavbar;