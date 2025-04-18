import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import AdminNavbar from './AdminNavbar';
import Loader from '../common/Loader';
import Error from '../common/Error';
import Pagination from '../common/Pagination';
import UserDetailsModal from './UserDetailsModal';
import axios from 'axios';
import { useTheme } from '../common/themeProvider';

const API_URL = "http://localhost:3000"; // Update based on your backend URL

const UserVerificationPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentTheme } = useTheme();
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [action, setAction] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'verified'
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger state
  
  const pageSize = 10;
  function normalizeBoolean(value) {
    if (value === true || value === 'true' || value === 1 || value === '1') {
      return true;
    }
    return false;
  }
  
  
  // Fetch users function defined with useCallback to be reusable
  // Fixed filtering in fetchUsers function
const fetchUsers = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Get token
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication required. Please log in again.");
      setLoading(false);
      return;
    }
    
    // Add cache-busting timestamp and fetch data
    const timestamp = new Date().getTime();
    const response = await axios.get(`${API_URL}/user/getAll?t=${timestamp}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Get users from response
    let fetchedUsers = response.data.users || [];
    console.log("Fetched users:", fetchedUsers);
    // DEBUG: Log raw data with verified status
    fetchedUsers.forEach(user => {
      console.log(`User ${user.fullName}, verified: ${user.verified}, type: ${typeof user.verified}`);
    });
    
    // Apply filter - with FIXED strict boolean comparison
    let filteredUsers;
    if (filter === 'all') {
      filteredUsers = fetchedUsers;
    } else if (filter === 'pending') {
      filteredUsers = fetchedUsers.filter(user => !normalizeBoolean(user.verified));
    } else if (filter === 'verified') {
      filteredUsers = fetchedUsers.filter(user => normalizeBoolean(user.verified));
    }
    
    console.log(`Filter: ${filter}, Users after filtering: ${filteredUsers.length}`);
    
    // Set state with filtered users
    setTotalUsers(filteredUsers.length);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
    setUsers(paginatedUsers);
    setLoading(false);
  } catch (err) {
    console.error('Error fetching users:', err);
    setError(err.response?.data?.error || 'Failed to fetch users. Please try again.');
    setLoading(false);
  }
}, [currentPage, filter]);
// Effect to fetch users on component mount and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshTrigger]); // Add refreshTrigger to dependencies
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSuccessMessage(null);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilter) => {
    console.log("Switching filter to:", newFilter);
    setFilter(newFilter);
    setCurrentPage(1);
    setSuccessMessage(null);
  };
  
  // Open verification modal
  const openVerificationModal = (user, actionType) => {
    setSelectedUser(user);
    setAction(actionType);
    setVerificationNote('');
    setShowModal(true);
  };

  // View user details
  const handleViewUser = (user) => {
    setViewingUser(user);
    setShowUserModal(true);
  };
  
  // Handle user verification
  const handleVerifyUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }
      
      console.log("Verifying user:", selectedUser._id, "Action:", action, "Setting verified to:", action === 'approve');
      
      // API call to verify user
      const response = await axios.patch(
        `${API_URL}/user/update-profile`,
        {
          _id: selectedUser._id,
          verified: action === 'approve'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Verification response:", response.data);
      
      // Close modal first
      setShowModal(false);
      
      // Clear users to force rerender
      setUsers([]); 
      
      // Show success message
      setSuccessMessage(`User ${selectedUser.fullName} has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
      
      // Trigger a fresh reload of data
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 500);
      
      setLoading(false);
    } catch (err) {
      console.error('Error verifying user:', err);
      setError(err.response?.data?.error || 'Failed to verify user. Please try again.');
      setLoading(false);
    }
  };

  // Handle re-verification (setting a user back to unverified)
  const handleReverifyUser = async (user) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }
      
      console.log("Re-verifying user:", user._id, "Setting verified to false");
      
      // API call to reset verification status
      const response = await axios.patch(
        `${API_URL}/user/update-profile`,
        {
          _id: user._id,
          verified: false
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Re-verification response:", response.data);
      
      // Clear users to force rerender
      setUsers([]);
      
      // Show success message
      setSuccessMessage(`User ${user.fullName} has been set for re-verification.`);
      
      // Trigger a fresh reload of data
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 500);
      
      setLoading(false);
    } catch (err) {
      console.error('Error re-verifying user:', err);
      setError(err.response?.data?.error || 'Failed to set user for re-verification. Please try again.');
      setLoading(false);
    }
  };
  
  if (loading && users.length === 0) {
    return (
      <>
        <AdminNavbar />
        <Container className="py-4">
          <Loader />
        </Container>
      </>
    );
  }
  
  const pendingCount = users.filter(user => user.verified !== true).length;
  
  return (
    <div style={{ backgroundColor: 'var(--neutralBg)', minHeight: '100vh' }}>
      <AdminNavbar />
      
      <Container className="py-4">
        {error && (
          <Alert 
            variant="danger" 
            dismissible 
            onClose={() => setError(null)}
            style={{ 
              backgroundColor: currentTheme === 'dark' ? '#392123' : '#f8d7da',
              color: currentTheme === 'dark' ? '#e48a8f' : '#721c24',
              border: currentTheme === 'dark' ? '1px solid #582a2d' : '1px solid #f5c6cb',
              marginBottom: '1rem'
            }}
          >
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert 
            variant="success" 
            dismissible 
            onClose={() => setSuccessMessage(null)}
            style={{ 
              backgroundColor: currentTheme === 'dark' ? '#1e392a' : '#d4edda',
              color: currentTheme === 'dark' ? '#81c995' : '#155724',
              border: currentTheme === 'dark' ? '1px solid #2c5a3c' : '1px solid #c3e6cb',
              marginBottom: '1rem'
            }}
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            {successMessage}
          </Alert>
        )}
        
        {filter === 'pending' && pendingCount > 0 && (
          <Alert 
            variant="warning" 
            style={{ 
              backgroundColor: currentTheme === 'dark' ? '#332d1a' : '#fff3cd',
              color: currentTheme === 'dark' ? '#e0c160' : '#856404',
              border: currentTheme === 'dark' ? '1px solid #665d30' : '1px solid #ffeeba',
              marginBottom: '1rem'
            }}
          >
            <i className="bi bi-exclamation-triangle me-2"></i>
            You have <strong>{pendingCount}</strong> user registrations pending approval.
          </Alert>
        )}
        
        <Card style={{ 
          backgroundColor: 'var(--card)', 
          color: 'var(--textPrimary)', 
          border: '1px solid var(--border)' 
        }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 style={{ color: 'var(--textPrimary)' }}>User Verification</h2>
              
              <div className="d-flex">
                <Button 
                  variant={filter === 'all' ? 'primary' : 'outline-primary'}
                  className="me-2"
                  onClick={() => handleFilterChange('all')}
                  style={filter === 'all' ? {
                    backgroundColor: 'var(--primary)',
                    borderColor: 'var(--primary)'
                  } : {
                    color: 'var(--primary)',
                    borderColor: 'var(--primary)'
                  }}
                >
                  All
                </Button>
                <Button 
                  variant={filter === 'pending' ? 'warning' : 'outline-warning'}
                  className="me-2"
                  onClick={() => handleFilterChange('pending')}
                  style={filter === 'pending' ? {
                    backgroundColor: 'var(--warning, #ffc107)',
                    borderColor: 'var(--warning, #ffc107)'
                  } : {
                    color: 'var(--warning, #ffc107)',
                    borderColor: 'var(--warning, #ffc107)'
                  }}
                >
                  Pending
                </Button>
                <Button 
                  variant={filter === 'verified' ? 'success' : 'outline-success'}
                  className="me-2"
                  onClick={() => handleFilterChange('verified')}
                  style={filter === 'verified' ? {
                    backgroundColor: 'var(--accent)',
                    borderColor: 'var(--accent)'
                  } : {
                    color: 'var(--accent)',
                    borderColor: 'var(--accent)'
                  }}
                >
                  Approved
                </Button>
                
                {/* Manual refresh button */}
                <Button 
                  variant="outline-secondary"
                  onClick={() => {
                    console.log("Manual refresh triggered");
                    setUsers([]);
                    setRefreshTrigger(prev => prev + 1);
                  }}
                  disabled={loading}
                  style={{
                    color: 'var(--secondary)',
                    borderColor: 'var(--secondary)'
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Refresh
                </Button>
              </div>
            </div>
            
            {users.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-check-circle" style={{ fontSize: '3rem', color: 'var(--accent)' }}></i>
                <h4 style={{ color: 'var(--textPrimary)', marginTop: '1rem' }}>No Users Found</h4>
                <p style={{ color: 'var(--textSecondary)' }}>
                  There are no {filter !== 'all' ? filter : ''} users to display at this time.
                </p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table 
                    hover 
                    style={{ 
                      color: 'var(--textPrimary)', 
                      '--bs-table-hover-bg': currentTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ color: 'var(--textSecondary)' }}>Name</th>
                        <th style={{ color: 'var(--textSecondary)' }}>Email</th>
                        <th style={{ color: 'var(--textSecondary)' }}>Phone</th>
                        <th style={{ color: 'var(--textSecondary)' }}>Type</th>
                        <th style={{ color: 'var(--textSecondary)' }}>Status</th>
                        <th style={{ color: 'var(--textSecondary)' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div 
                                className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  backgroundColor: 'green',
                                  color: 'white',
                                  fontSize: '18px'
                                }}
                              >
                                {user.fullName.charAt(0).toUpperCase()}
                              </div>
                              <span>{user.fullName}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.phone || 'N/A'}</td>
                          <td>{user.type}</td>
                          <td>
                          <Badge 
  bg={normalizeBoolean(user.verified) ? 'success' : 'warning'}
  style={{ 
    backgroundColor: normalizeBoolean(user.verified) ? 'var(--accent)' : 'var(--warning, #ffc107)'
  }}
>
  {normalizeBoolean(user.verified) ? 'Approved' : 'Pending'}
</Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleViewUser(user)}
                                style={{ 
                                  borderColor: 'var(--primary)', 
                                  color: 'var(--primary)'
                                }}
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                              
                              {user.verified !== true && (
                                <>
                                  <Button 
                                    variant="outline-success" 
                                    size="sm"
                                    onClick={() => openVerificationModal(user, 'approve')}
                                    style={{ 
                                      borderColor: 'var(--accent)', 
                                      color: 'var(--accent)'
                                    }}
                                  >
                                    <i className="bi bi-check-circle"></i>
                                  </Button>
                                  
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => openVerificationModal(user, 'reject')}
                                    style={{ 
                                      borderColor: 'var(--danger)', 
                                      color: 'var(--danger)'
                                    }}
                                  >
                                    <i className="bi bi-x-circle"></i>
                                  </Button>
                                </>
                              )}
                              
                              {user.verified === true && (
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => handleReverifyUser(user)}
                                  style={{ 
                                    borderColor: 'var(--secondary)', 
                                    color: 'var(--secondary)'
                                  }}
                                >
                                  <i className="bi bi-arrow-repeat"></i>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                
                {totalUsers > pageSize && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalUsers}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
      
      {/* Verification Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header 
          closeButton 
          style={{ 
            backgroundColor: 'var(--card)', 
            color: 'var(--textPrimary)', 
            borderBottom: '1px solid var(--border)' 
          }}
        >
          <Modal.Title>
            {action === 'approve' ? 'Approve User' : 'Reject User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body 
          style={{ 
            backgroundColor: 'var(--card)', 
            color: 'var(--textPrimary)'
          }}
        >
          {selectedUser && (
            <>
              <div className="mb-3">
                <p style={{ color: 'var(--textPrimary)' }}>
                  You are about to <strong>{action === 'approve' ? 'approve' : 'reject'}</strong> the following user:
                </p>
                <div className="p-3" style={{ 
                  backgroundColor: currentTheme === 'dark' ? '#1a1a1a' : '#f8f9fa',
                  borderRadius: '0.25rem',
                  border: '1px solid var(--border)'
                }}>
                  <p className="mb-1"><strong>Name:</strong> {selectedUser.fullName}</p>
                  <p className="mb-1"><strong>Email:</strong> {selectedUser.email}</p>
                  <p className="mb-1"><strong>Type:</strong> {selectedUser.type}</p>
                  <p className="mb-0"><strong>Registered:</strong> {formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'var(--textPrimary)' }}>Verification Notes (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add any notes about this verification decision..."
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  style={{ 
                    backgroundColor: currentTheme === 'dark' ? '#2a2a2a' : '#fff',
                    color: 'var(--textPrimary)',
                    borderColor: 'var(--border)'
                  }}
                />
              </Form.Group>
              
              {action === 'reject' && (
                <Alert 
                  variant="warning"
                  style={{ 
                    backgroundColor: currentTheme === 'dark' ? '#332d1a' : '#fff3cd',
                    color: currentTheme === 'dark' ? '#e0c160' : '#856404',
                    border: currentTheme === 'dark' ? '1px solid #665d30' : '1px solid #ffeeba'
                  }}
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Rejecting this user will prevent them from accessing the platform.
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{ 
            backgroundColor: 'var(--card)', 
            borderTop: '1px solid var(--border)' 
          }}
        >
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
            style={{ 
              backgroundColor: currentTheme === 'dark' ? '#4a4a4a' : '#6c757d',
              borderColor: currentTheme === 'dark' ? '#4a4a4a' : '#6c757d'  
            }}
          >
            Cancel
          </Button>
          <Button 
            variant={action === 'approve' ? 'success' : 'danger'} 
            onClick={handleVerifyUser}
            style={{ 
              backgroundColor: action === 'approve' 
                ? 'var(--accent)'
                : 'var(--danger)',
              borderColor: action === 'approve'
                ? 'var(--accent)'
                : 'var(--danger)'
            }}
          >
            {action === 'approve' ? 'Approve User' : 'Reject User'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* User Details Modal */}
      <UserDetailsModal 
        user={viewingUser}
        show={showUserModal}
        onHide={() => setShowUserModal(false)}
        onApprove={viewingUser && !viewingUser.verified ? 
          () => {
            setShowUserModal(false);
            openVerificationModal(viewingUser, 'approve');
          } : null}
        onReject={viewingUser && !viewingUser.verified ? 
          () => {
            setShowUserModal(false);
            openVerificationModal(viewingUser, 'reject');
          } : null}
        onReverify={viewingUser && viewingUser.verified ?
          () => {
            setShowUserModal(false);
            handleReverifyUser(viewingUser);
          } : null}
      />
    </div>
  );
};

export default UserVerificationPage;