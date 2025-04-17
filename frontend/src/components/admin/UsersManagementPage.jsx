// src/pages/admin/UsersManagementPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Loader from '../../components/common/Loader';
import Error from '../../components/common/Error';
import Pagination from '../../components/common/Pagination';
import UserDetailsModal from '../../components/admin/UserDetailsModal';
import axios from 'axios';
import { useTheme } from '../../components/common/themeProvider';


  

const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentTheme } = useTheme();
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
    <div style={{ backgroundColor: 'var(--neutralBg)', minHeight: '100vh' }}>
      <AdminNavbar />
      
      <Container className="py-4">
        <Card style={{ 
          backgroundColor: 'var(--card)', 
          color: 'var(--textPrimary)', 
          border: '1px solid var(--border)' 
        }}>
          <Card.Body>
            <h2 style={{ color: 'var(--textPrimary)' }}>User Management</h2>
            
            {/* Search and filter controls */}
            <div className="mb-3">
              <InputGroup>
                <Form.Control 
                  style={{ 
                    backgroundColor: 'var(--card)', 
                    color: 'var(--textPrimary)', 
                    border: '1px solid var(--border)' 
                  }}
                  placeholder="Search users..." 
                />
                <Button variant="outline-primary">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </div>
            
            {/* Table of users */}
            <Table 
              hover 
              style={{ 
                color: 'var(--textPrimary)', 
                '--bs-table-hover-bg': currentTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
              }}
            >
              <thead>
                <tr style={{ borderBottomColor: 'var(--border)' }}>
                  <th style={{ color: 'var(--textSecondary)' }}>ID</th>
                  <th style={{ color: 'var(--textSecondary)' }}>Name</th>
                  {/* More table headers */}
                </tr>
              </thead>
              <tbody>
                {/* Table rows */}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UsersManagementPage;