// src/components/admin/UserDetailsModal.jsx

import React from 'react';
import { Modal, Button, Table, Badge, Row, Col, Card } from 'react-bootstrap';

const UserDetailsModal = ({ user, show, onHide }) => {
  if (!user) return null;
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="user-details-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="user-details-modal">
          User Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col md={6}>
            <h5>{user.fullName}</h5>
            <p className="text-muted mb-2">{user.email}</p>
            <div className="d-flex align-items-center mb-3">
              <Badge bg={user.type === 'admin' ? 'danger' : 'primary'} className="me-2">
                {user.type}
              </Badge>
              <Badge bg={
                user.status === 'active' ? 'success' : 
                user.status === 'pending' ? 'warning' :
                'danger'
              }>
                {user.status}
              </Badge>
            </div>
            <p className="mb-1"><strong>ID:</strong> {user.id}</p>
            <p className="mb-1">
              <strong>Registered:</strong> {formatDate(user.createdAt)}
            </p>
            <p className="mb-0">
              <strong>Last Login:</strong> {user.lastLogin ? formatDate(user.lastLogin) : 'Never logged in'}
            </p>
          </Col>
          
          <Col md={6}>
            {user.imagePath ? (
              <div className="text-center">
                <img 
                  src={user.imagePath} 
                  alt={user.fullName} 
                  className="img-fluid rounded"
                  style={{ maxHeight: '150px' }}
                />
              </div>
            ) : (
              <div className="text-center">
                <div 
                  className="d-flex align-items-center justify-content-center bg-light rounded"
                  style={{ height: '150px' }}
                >
                  <i className="bi bi-person display-1 text-secondary"></i>
                </div>
                <p className="text-muted mt-2">No profile image</p>
              </div>
            )}
          </Col>
        </Row>
        
        {/* Verification Information (if available) */}
        {user.verificationDetails && (
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">Verification Information</h6>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm" className="mb-0">
                <tbody>
                  <tr>
                    <td width="30%"><strong>Reason for Joining</strong></td>
                    <td>{user.verificationDetails.reason || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>Trading Experience</strong></td>
                    <td>
                      <Badge bg={
                        user.verificationDetails.experience === 'beginner' ? 'info' :
                        user.verificationDetails.experience === 'intermediate' ? 'primary' :
                        'success'
                      }>
                        {user.verificationDetails.experience || 'Not specified'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Income Range</strong></td>
                    <td>{user.verificationDetails.income || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td><strong>ID Document</strong></td>
                    <td>
                      {user.verificationDetails.documentPath ? (
                        <Button variant="link" size="sm" className="p-0">
                          View Document
                        </Button>
                      ) : (
                        'Not uploaded'
                      )}
                    </td>
                  </tr>
                  {user.verificationDetails.verifiedAt && (
                    <>
                      <tr>
                        <td><strong>Verified At</strong></td>
                        <td>{formatDate(user.verificationDetails.verifiedAt)}</td>
                      </tr>
                      <tr>
                        <td><strong>Verification Note</strong></td>
                        <td>{user.verificationDetails.verificationNote || 'No notes'}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
        
        {/* Account Activity */}
        <Card>
          <Card.Header>
            <h6 className="mb-0">Account Activity</h6>
          </Card.Header>
          <Card.Body>
            {/* In a real application, you would display actual account activity data here */}
            <p className="text-muted text-center">No recent activity to display</p>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        
        {/* Add action buttons based on user status */}
        {user.status === 'pending' && (
          <>
            <Button variant="success">
              Approve User
            </Button>
            <Button variant="danger">
              Reject User
            </Button>
          </>
        )}
        
        {user.status === 'active' && (
          <Button variant="danger">
            Suspend User
          </Button>
        )}
        
        {user.status === 'rejected' && (
          <Button variant="success">
            Activate User
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailsModal;