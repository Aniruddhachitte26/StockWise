// // src/components/common/Navbar.jsx
// import React, { useState, useEffect } from 'react';
// import { Navbar, Nav, Container, Button, Form, InputGroup, NavDropdown } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';

// // --- Redux Imports ---
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../../redux/features/authSlice'; // Import the logout action

// // Custom styles for navbar
// const navbarStyles = {
//     container: {
//         maxWidth: '100%',
//         padding: '0 15px'
//     },
//     brand: {
//         display: 'flex',
//         alignItems: 'center'
//     },
//     searchContainer: {
//         maxWidth: '400px',
//         width: '100%'
//     }
// };

// const AppNavbar = () => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const navigate = useNavigate();
//     const dispatch = useDispatch(); // Get the dispatch function

//     // --- Select state from Redux store ---
//     const authState = useSelector(state => state.auth);
//     const { isAuthenticated, user } = useSelector(state => state.auth);

//     // Check if user is admin or broker
//     const isAdmin = user?.type === 'admin';
//     const isBroker = user?.type === 'broker';

//     // Get username to display - handle null case
//     const displayName = user?.fullName || "My Account";

//     // const handleSearch = (e) => {
//     //     e.preventDefault();
//     //     if (searchQuery.trim()) {
//     //         navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//     //     }
//     // };

//     const handleLogout = () => {
//         dispatch(logout()); // Dispatch the logout action
//         navigate('/'); // Redirect to home after logout
//         console.log("Logout dispatched from Navbar");
//     };

//     // Debug log for currentUser from Redux state
//     useEffect(() => {
//         console.log("Navbar: Current user from Redux:", user);
//     }, [user]);

//     useEffect(() => {
//         console.log("Navbar: Full auth state from Redux:", authState);
//     }, [authState]);

//     return (
//         <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm py-2 px-0">
//             <div style={navbarStyles.container} className="d-flex w-100 justify-content-between">
//                 {/* Brand */}
//                 <Navbar.Brand as={Link} to="/" style={navbarStyles.brand}>
//                     <img
//                         src="/logo.png" // Using vite logo as placeholder
//                         width="30"
//                         height="30"
//                         className="d-inline-block align-top me-2"
//                         alt="StockWise Logo"
//                     />
//                     <span className="fw-bold text-primary">StockWise</span>
//                 </Navbar.Brand>

//                 <Navbar.Toggle aria-controls="basic-navbar-nav" />

//                 <Navbar.Collapse id="basic-navbar-nav">
//                     {/* Main Nav Links */}
//                     <Nav className="me-auto">
//                         <Nav.Link as={Link} to="/">Home</Nav.Link>
//                         <Nav.Link as={Link} to="/stocks">Stocks</Nav.Link>
//                         <Nav.Link as={Link} to="/news">Market News</Nav.Link>
//                         <Nav.Link as={Link} to="/about">About</Nav.Link>
//                         <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
//                     </Nav>

                   

//                     {/* Auth Links / User Dropdown */}
//                     {isAuthenticated ? (
//                         <Nav>
//                             <NavDropdown title={displayName} id="user-nav-dropdown" align="end">
//                                 {/* Regular User Links */}
//                                 {!isAdmin && !isBroker && (
//                                     <>
//                                         <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
//                                         <NavDropdown.Item as={Link} to="/portfolio">Portfolio</NavDropdown.Item>
//                                         <NavDropdown.Item as={Link} to="/watchlist">Watchlist</NavDropdown.Item>
//                                         <NavDropdown.Item as={Link} to="/transactions">Transactions</NavDropdown.Item>
//                                     </>
//                                 )}
                                
//                                 {/* Broker Links */}
//                                 {isBroker && (
//                                     <>
//                                         <NavDropdown.Item as={Link} to="/broker/dashboard">Broker Dashboard</NavDropdown.Item>
//                                         <NavDropdown.Item as={Link} to="/broker/clients">Manage Clients</NavDropdown.Item>
//                                         <NavDropdown.Item as={Link} to="/broker/transactions">Transactions</NavDropdown.Item>
//                                     </>
//                                 )}
                                
//                                 {/* Admin Links */}
//                                 {isAdmin && (
//                                     <>
//                                         <NavDropdown.Item as={Link} to="/admin/dashboard">Admin Dashboard</NavDropdown.Item>
//                                         <NavDropdown.Item as={Link} to="/admin/users">Manage Users</NavDropdown.Item>
//                                         <NavDropdown.Item as={Link} to="/admin/stocks">Manage Stocks</NavDropdown.Item>
//                                         <NavDropdown.Item as={Link} to="/admin/verify-users">Verify Users</NavDropdown.Item>
//                                     </>
//                                 )}
                                
//                                 {/* Common Links */}
//                                 <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
//                                 <NavDropdown.Divider />
//                                 <NavDropdown.Item onClick={handleLogout}>
//                                     <i className="bi bi-box-arrow-right me-2"></i>Logout
//                                 </NavDropdown.Item>
//                             </NavDropdown>
//                         </Nav>
//                     ) : (
//                         <Nav className="d-flex align-items-center">
//                             <Nav.Link as={Link} to="/login" className="me-lg-2 mb-2 mb-lg-0">
//                                 <Button variant="outline-primary" className="w-100">Log In</Button>
//                             </Nav.Link>
//                             <NavDropdown title="Register" id="register-dropdown" align="end">
//                                 <NavDropdown.Item as={Link} to="/register">
//                                     <i className="bi bi-person-plus me-2"></i>
//                                     User Account
//                                 </NavDropdown.Item>
//                                 <NavDropdown.Item as={Link} to="/broker-register">
//                                     <i className="bi bi-building me-2"></i>
//                                     Broker Account
//                                 </NavDropdown.Item>
//                             </NavDropdown>
//                         </Nav>
//                     )}
//                 </Navbar.Collapse>
//             </div>
//         </Navbar>
//     );
// };

// export default AppNavbar;

// src/components/common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Form, InputGroup, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

// --- Redux Imports ---
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/authSlice'; // Import the logout action

// Custom styles for navbar
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
    const dispatch = useDispatch(); // Get the dispatch function

    // --- Select state from Redux store ---
    const authState = useSelector(state => state.auth);
    const { isAuthenticated, user } = useSelector(state => state.auth);

    // Check if user is admin or broker
    const isAdmin = user?.type === 'admin';
    const isBroker = user?.type === 'broker';

    // Get username to display - handle null case
    const displayName = user?.fullName || "My Account";

    const handleLogout = () => {
        dispatch(logout()); // Dispatch the logout action
        navigate('/'); // Redirect to home after logout
        console.log("Logout dispatched from Navbar");
    };
    
    // Handle click for protected routes
    const handleProtectedNavClick = (e, path) => {
        if (!isAuthenticated) {
            e.preventDefault();
            // Redirect to login page with return path
            navigate('/login', { state: { from: path } });
        }
    };

    // Debug log for currentUser from Redux state
    useEffect(() => {
        console.log("Navbar: Current user from Redux:", user);
    }, [user]);

    useEffect(() => {
        console.log("Navbar: Full auth state from Redux:", authState);
    }, [authState]);

    return (
        <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm py-2 px-0">
            <div style={navbarStyles.container} className="d-flex w-100 justify-content-between">
                {/* Brand */}
                <Navbar.Brand as={Link} to="/" style={navbarStyles.brand}>
                    <img
                        src="/logo.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top me-2"
                        alt="StockWise Logo"
                    />
                    <span className="fw-bold text-primary">StockWise</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Main Nav Links */}
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        
                        {/* Protected Links */}
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/stocks">Stocks</Nav.Link>
                                <Nav.Link as={Link} to="/news">Market News</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link 
                                    as={Link} 
                                    to="/stocks" 
                                    onClick={(e) => handleProtectedNavClick(e, '/stocks')}
                                >
                                    Stocks
                                </Nav.Link>
                                <Nav.Link 
                                    as={Link} 
                                    to="/news" 
                                    onClick={(e) => handleProtectedNavClick(e, '/news')}
                                >
                                    Market News
                                </Nav.Link>
                            </>
                        )}
                        
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                    </Nav>

                    {/* Auth Links / User Dropdown */}
                    {isAuthenticated ? (
                        <Nav>
                            <NavDropdown title={displayName} id="user-nav-dropdown" align="end">
                                {/* Regular User Links */}
                                {!isAdmin && !isBroker && (
                                    <>
                                        <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/portfolio">Portfolio</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/watchlist">Watchlist</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/transactions">Transactions</NavDropdown.Item>
                                    </>
                                )}
                                
                                {/* Broker Links */}
                                {isBroker && (
                                    <>
                                        <NavDropdown.Item as={Link} to="/broker/dashboard">Broker Dashboard</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/broker/clients">Manage Clients</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/broker/transactions">Transactions</NavDropdown.Item>
                                    </>
                                )}
                                
                                {/* Admin Links */}
                                {isAdmin && (
                                    <>
                                        <NavDropdown.Item as={Link} to="/admin/dashboard">Admin Dashboard</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/users">Manage Users</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/stocks">Manage Stocks</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/admin/verify-users">Verify Users</NavDropdown.Item>
                                    </>
                                )}
                                
                                {/* Common Links */}
                                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Nav className="d-flex align-items-center">
                            <Nav.Link as={Link} to="/login" className="me-lg-2 mb-2 mb-lg-0">
                                <Button variant="outline-primary" className="w-100">Log In</Button>
                            </Nav.Link>
                            <NavDropdown title="Register" id="register-dropdown" align="end">
                                <NavDropdown.Item as={Link} to="/register">
                                    <i className="bi bi-person-plus me-2"></i>
                                    User Account
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/broker-register">
                                    <i className="bi bi-building me-2"></i>
                                    Broker Account
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};

export default AppNavbar;