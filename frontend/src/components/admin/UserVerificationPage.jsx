// src/pages/admin/UserVerificationPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Loader from '../../components/common/Loader';
import Error from '../../components/common/Error';
import Pagination from '../../components/common/Pagination';
import UserDetailsModal from '../../components/admin/UserDetailsModal';
import axios from 'axios';

const UserVerificationPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPendingUsers, setTotalPendingUsers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [action, setAction] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  
  const pageSize = 10;

  // Fetch pending users
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const response = await axios.get(`${API_URL}/user/pending`, {
        //   params: { page: currentPage, limit: pageSize }
        // });
        
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        const mockPendingUsers = Array.from({ length: 15 }, (_, index) => ({
          id: index + 1,
          fullName: `Pending User ${index + 1}`,
          email: `pending${index + 1}@example.com`,
          phone: `+1 ${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 10000)}`,
          type: 'user',
          status: 'pending',
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          identityDocument: Math.random() > 0.3 ? 'drivers_license.jpg' : null,
          verificationDetails: {
            reason: `Investment and trading ${index}`,
            experience: index % 3 === 0 ? 'beginner' : index % 3 === 1 ? 'intermediate' : 'expert',
            income: `$${(Math.floor(Math.random() * 150) + 50)}k - $${(Math.floor(Math.random() * 100) + 200)}k`
          }
        }));
        
        setTotalPendingUsers(mockPendingUsers.length);
        
        // Paginate
        const startIndex = (currentPage - 1) * pageSize;
        const paginatedUsers = mockPendingUsers.slice(startIndex, startIndex + pageSize);
        
        setPendingUsers(paginatedUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching pending users:', err);
        setError('Failed to fetch pending users. Please try again.');
        setLoading(false);
      }
    };
    
    fetchPendingUsers();
  }, [currentPage]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Open verification modal
  const openVerificationModal = (user, actionType) => {
    setSelectedUser(user);
    setAction(actionType);
    setVerificationNote('');
    setShowModal(true);
  };
  
  // Handle user verification
  const handleVerifyUser = async () => {
    try {
      // In a real app, this would be an API call
      // await axios.post(`${API_URL}/user/verify`, {
      //   userId: selectedUser.id,
      //   action: action,
      //   note: verificationNote
      // });
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Update UI with verification result
      setPendingUsers(prevUsers => 
        prevUsers.filter(user => user.id !== selectedUser.id)
      );
      
      setTotalPendingUsers(prev => prev - 1);
      setShowModal(false);
      
      // Show success message
      alert(`User ${selectedUser.fullName} has been ${action === 'approve' ? 'approved' : 'rejected'}.`);
    } catch (err) {
      console.error('Error verifying user:', err);
      setError('Failed to verify user. Please try again.');
    }
  };
  
  if (loading && pendingUsers.length === 0) {
    return (
      <>
        <AdminNavbar />
        <Container className="py-4">
          <Loader />
        </Container>
      </>
    );
  }
  
  return (
    <>
      <AdminNavbar />
      
      <Container className="py-4">
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row className="align-items-center mb-4">
              <Col>
                <h2>User Verification</h2>
                <p className="text-muted mb-0">Approve or reject pending user registrations</p>
              </Col>
              <Col xs="auto">
                <Badge bg="warning" className="fs-6">
                  {totalPendingUsers} Pending
                </Badge>
              </Col>
            </Row>
            
            {error && (
              <Error message={error} dismissible onClose={() => setError(null)} className="mb-4" />
            )}
            
            {pendingUsers.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-check-circle text-success fs-1"></i>
                <h4 className="mt-3">All Done!</h4>
                <p className="text-muted">No pending users require verification at this time.</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Registration Date</th>
                        <th>Experience</th>
                        <th>Income Range</th>
                        <th>ID Verified</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.fullName}</td>
                          <td>{user.email}</td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <Badge bg={
                              user.verificationDetails.experience === 'beginner' ? 'info' :
                              user.verificationDetails.experience === 'intermediate' ? 'primary' :
                              'success'
                            }>
                              {user.verificationDetails.experience}
                            </Badge>
                          </td>
                          <td>{user.verificationDetails.income}</td>
                          <td>
                            {user.identityDocument ? (
                              <Badge bg="success">Yes</Badge>
                            ) : (
                              <Badge bg="danger">No</Badge>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => {
                                  setViewingUser(user);
                                  setShowUserModal(true);
                                }}
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                              
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => openVerificationModal(user, 'approve')}
                              >
                                Approve
                              </Button>
                              
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => openVerificationModal(user, 'reject')}
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalPendingUsers}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
      
      {/* Verification Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {action === 'approve' ? 'Approve User' : 'Reject User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>
                You are about to <strong>{action === 'approve' ? 'approve' : 'reject'}</strong> the 
                following user:
              </p>
              
              <div className="mb-3 p-3 bg-light rounded">
                <p className="mb-1"><strong>Name:</strong> {selectedUser.fullName}</p>
                <p className="mb-1"><strong>Email:</strong> {selectedUser.email}</p>
                <p className="mb-1"><strong>Registration Date:</strong> {formatDate(selectedUser.createdAt)}</p>
                <p className="mb-1"><strong>Experience:</strong> {selectedUser.verificationDetails.experience}</p>
                <p className="mb-0"><strong>ID Verified:</strong> {selectedUser.identityDocument ? 'Yes' : 'No'}</p>
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label>Verification Note (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={`Add a note about why you're ${action === 'approve' ? 'approving' : 'rejecting'} this user...`}
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                />
              </Form.Group>
              
              {action === 'reject' && (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Rejecting this user will prevent them from accessing the platform. They will receive an 
                  email notification about this decision.
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={action === 'approve' ? 'success' : 'danger'} 
            onClick={handleVerifyUser}
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
      />
    </>
  );
};

export default UserVerificationPage;