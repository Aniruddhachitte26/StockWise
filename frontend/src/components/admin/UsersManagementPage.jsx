// src/pages/admin/UsersManagementPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Loader from '../../components/common/Loader';
import Error from '../../components/common/Error';
import Pagination from '../../components/common/Pagination';
import UserDetailsModal from '../../components/admin/UserDetailsModal';
import axios from 'axios';

const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filter, setFilter] = useState('all'); // all, active, pending, rejected
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  const pageSize = 10;
  
  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would make API calls with these parameters
        // const response = await axios.get(`${API_URL}/user/getAll`, {
        //   params: { page: currentPage, limit: pageSize, search: searchTerm, filter, sortBy, sortOrder }
        // });
        
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        const mockUsers = Array.from({ length: 35 }, (_, index) => ({
          id: index + 1,
          fullName: `User ${index + 1}`,
          email: `user${index + 1}@example.com`,
          type: index % 10 === 0 ? 'admin' : 'user',
          status: index % 3 === 0 ? 'active' : index % 3 === 1 ? 'pending' : 'rejected',
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          lastLogin: index % 4 !== 0 ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString() : null
        }));
        
        // Apply filtering
        let filteredUsers = [...mockUsers];
        
        if (filter !== 'all') {
          filteredUsers = filteredUsers.filter(user => user.status === filter);
        }
        
        // Apply search
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          filteredUsers = filteredUsers.filter(user => 
            user.fullName.toLowerCase().includes(term) || 
            user.email.toLowerCase().includes(term)
          );
        }
        
        // Apply sorting
        filteredUsers.sort((a, b) => {
          if (sortBy === 'createdAt') {
            return sortOrder === 'asc' 
              ? new Date(a.createdAt) - new Date(b.createdAt)
              : new Date(b.createdAt) - new Date(a.createdAt);
          } else if (sortBy === 'fullName') {
            return sortOrder === 'asc'
              ? a.fullName.localeCompare(b.fullName)
              : b.fullName.localeCompare(a.fullName);
          }
          return 0;
        });
        
        setTotalUsers(filteredUsers.length);
        
        // Paginate
        const startIndex = (currentPage - 1) * pageSize;
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
        
        setUsers(paginatedUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again.');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [currentPage, searchTerm, filter, sortBy, sortOrder]);
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle sort change
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };
  
  // Handle status update (in a real app, this would be an API call)
  const handleStatusUpdate = (userId, newStatus) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
  
  return (
    <>
      <AdminNavbar />
      
      <Container className="py-4">
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row className="align-items-center mb-3">
              <Col>
                <h2 className="mb-0">User Management</h2>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6} className="mb-3 mb-md-0">
                <InputGroup>
                  <Form.Control
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <Button variant="outline-secondary">
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </Col>
              
              <Col md={3}>
                <Form.Select value={filter} onChange={handleFilterChange}>
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </Col>
              
              <Col md={3} className="text-md-end">
                <span className="me-2">Total: {totalUsers} users</span>
              </Col>
            </Row>
            
            {error && (
              <Error message={error} dismissible onClose={() => setError(null)} />
            )}
            
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th onClick={() => handleSort('fullName')} style={{ cursor: 'pointer' }}>
                      Name {sortBy === 'fullName' && (
                        <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                      Created At {sortBy === 'createdAt' && (
                        <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                      )}
                    </th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={user.type === 'admin' ? 'danger' : 'primary'}>
                          {user.type}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={
                          user.status === 'active' ? 'success' : 
                          user.status === 'pending' ? 'warning' :
                          'danger'
                        }>
                          {user.status}
                        </Badge>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{formatDate(user.lastLogin)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          
                          {user.status !== 'active' && (
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleStatusUpdate(user.id, 'active')}
                            >
                              <i className="bi bi-check-lg"></i>
                            </Button>
                          )}
                          
                          {user.status !== 'rejected' && (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleStatusUpdate(user.id, 'rejected')}
                            >
                              <i className="bi bi-x-lg"></i>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No users found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            
            <div className="mt-3">
              <Pagination
                currentPage={currentPage}
                totalItems={totalUsers}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          </Card.Body>
        </Card>
      </Container>
      
      {/* User Details Modal */}
      <UserDetailsModal 
        user={selectedUser}
        show={showUserModal}
        onHide={() => setShowUserModal(false)}
      />
    </>
  );
};

export default UsersManagementPage;