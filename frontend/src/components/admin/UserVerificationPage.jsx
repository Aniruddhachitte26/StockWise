// src/pages/admin/UserVerificationPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form ,Alert} from 'react-bootstrap';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Loader from '../../components/common/Loader';
import Error from '../../components/common/Error';
import Pagination from '../../components/common/Pagination';
import UserDetailsModal from '../../components/admin/UserDetailsModal';
import axios from 'axios';
import { useTheme } from '../common/themeProvider';

const UserVerificationPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentTheme } = useTheme();
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
    <div style={{ backgroundColor: 'var(--neutralBg)', minHeight: '100vh' }}>
      <AdminNavbar />
      
      <Container className="py-4">
        <Card style={{ 
          backgroundColor: 'var(--card)', 
          color: 'var(--textPrimary)', 
          border: '1px solid var(--border)' 
        }}>
          <Card.Body>
            <h2 style={{ color: 'var(--textPrimary)' }}>User Verification</h2>
            <p style={{ color: 'var(--textSecondary)' }}>
              Approve or reject pending user registrations
            </p>
            
            {/* Alert for pending verifications */}
            <Alert 
              variant="warning" 
              style={{ 
                backgroundColor: currentTheme === 'dark' ? '#332d1a' : '#fff3cd',
                color: currentTheme === 'dark' ? '#e0c160' : '#856404',
                border: currentTheme === 'dark' ? '1px solid #665d30' : '1px solid #ffeeba'
              }}
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              You have <strong>15</strong> user registrations pending approval.
            </Alert>
            
            {/* Table of pending users */}
            <Table 
              hover 
              style={{ 
                color: 'var(--textPrimary)', 
                '--bs-table-hover-bg': currentTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
              }}
            >
              {/* Table content */}
            </Table>
          </Card.Body>
        </Card>
      </Container>
      
      {/* Verification Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        contentClassName="bg-modal"
      >
        <Modal.Header 
          closeButton 
          style={{ 
            backgroundColor: 'var(--card)', 
            color: 'var(--textPrimary)', 
            borderBottom: '1px solid var(--border)' 
          }}
        >
          <Modal.Title>Verify User</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--card)', color: 'var(--textPrimary)' }}>
          {/* Modal content */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserVerificationPage;