// src/components/admin/AdminDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminNavbar from './../../components/admin/AdminNavbar';
import Loader from './../../components/common/Loader';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from './../../components/common/themeProvider';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const { currentTheme } = useTheme();
  
  // Color configuration based on theme
  const getChartColors = () => {
    return currentTheme === 'dark' 
      ? ['#90CAF9', '#80DEEA', '#A5D6A7', '#EF9A9A', '#CE93D8'] 
      : ['#1E88E5', '#00ACC1', '#43A047', '#E53935', '#8E24AA'];
  };
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        // Mock statistics
        const mockStats = {
          totalUsers: 127,
          activeUsers: 98,
          pendingUsers: 15,
          rejectedUsers: 14,
          weeklyRegistrations: [
            { day: 'Mon', count: 3 },
            { day: 'Tue', count: 5 },
            { day: 'Wed', count: 2 },
            { day: 'Thu', count: 7 },
            { day: 'Fri', count: 4 },
            { day: 'Sat', count: 1 },
            { day: 'Sun', count: 2 }
          ],
          userStatuses: [
            { name: 'Active', value: 98 },
            { name: 'Pending', value: 15 },
            { name: 'Rejected', value: 14 }
          ],
          userTypes: [
            { name: 'Regular User', value: 120 },
            { name: 'Admin', value: 7 }
          ],
          stockPerformance: [
            { name: 'Jan', value: 1000 },
            { name: 'Feb', value: 1200 },
            { name: 'Mar', value: 1100 },
            { name: 'Apr', value: 1300 },
            { name: 'May', value: 1600 },
            { name: 'Jun', value: 1500 },
            { name: 'Jul', value: 1800 }
          ]
        };
        
        // Mock recent users
        const mockRecentUsers = Array.from({ length: 5 }, (_, index) => ({
          id: index + 1,
          fullName: `User ${index + 1}`,
          email: `user${index + 1}@example.com`,
          type: index === 0 ? 'admin' : 'user',
          status: index % 3 === 0 ? 'active' : index % 3 === 1 ? 'pending' : 'rejected',
          createdAt: new Date(Date.now() - (index * 86400000)).toISOString() // Each day back
        }));
        
        setStats(mockStats);
        setRecentUsers(mockRecentUsers);
        setPendingApprovals(15);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (loading) {
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
        <h2 className="mb-4">Admin Dashboard</h2>
        
        {/* Alert for pending approvals */}
        {pendingApprovals > 0 && (
          <Alert variant="warning" className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <i className="bi bi-exclamation-triangle me-2"></i>
              You have <strong>{pendingApprovals}</strong> user registrations pending approval.
            </div>
            <Link to="/admin/verify-users">
              <Button variant="warning">Review Now</Button>
            </Link>
          </Alert>
        )}
        
        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3 mb-md-0">
            <Card className="stockwise-card h-100">
              <Card.Body className="text-center">
                <div className="display-4 fw-bold" style={{ color: 'var(--primary)' }}>{stats.totalUsers}</div>
                <p className="mb-0">Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <Card className="stockwise-card h-100">
              <Card.Body className="text-center">
                <div className="display-4 fw-bold" style={{ color: 'var(--accent)' }}>{stats.activeUsers}</div>
                <p className="mb-0">Active Users</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <Card className="stockwise-card h-100">
              <Card.Body className="text-center">
                <div className="display-4 fw-bold" style={{ color: 'var(--warning)' }}>{stats.pendingUsers}</div>
                <p className="mb-0">Pending Users</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <Card className="stockwise-card h-100">
              <Card.Body className="text-center">
                <div className="display-4 fw-bold" style={{ color: 'var(--danger)' }}>{stats.rejectedUsers}</div>
                <p className="mb-0">Rejected Users</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Charts */}
        <Row className="mb-4">
          <Col lg={8} className="mb-4 mb-lg-0">
            <Card className="stockwise-card h-100">
              <Card.Body>
                <h5 className="mb-3">User Registrations (Last 7 Days)</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.weeklyRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--textSecondary)" />
                    <YAxis stroke="var(--textSecondary)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--textPrimary)'
                      }}
                    />
                    <Bar dataKey="count" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="stockwise-card h-100">
              <Card.Body>
                <h5 className="mb-3">User Status Distribution</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.userStatuses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.userStatuses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} users`, 'Count']} 
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--textPrimary)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col md={12}>
            <Card className="stockwise-card">
              <Card.Body>
                <h5 className="mb-3">Market Performance Overview</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.stockPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--textSecondary)" />
                    <YAxis stroke="var(--textSecondary)" />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} 
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--textPrimary)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--accent)" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: 'var(--accent)' }}
                      activeDot={{ r: 6, fill: 'var(--accent)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Recent Users Table */}
        <Card className="stockwise-card">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Recently Registered Users</h5>
              <Link to="/admin/users" className="text-decoration-none" style={{ color: 'var(--primary)' }}>
                View All Users
              </Link>
            </div>
            
            <div className="table-responsive">
              <Table hover className="table-themed">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(user => (
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
                      <td>
                        <Button variant="outline-primary" size="sm">
                          <i className="bi bi-eye"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AdminDashboardPage;