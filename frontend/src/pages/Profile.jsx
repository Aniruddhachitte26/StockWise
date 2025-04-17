import React, { useState } from 'react';

const styles = {
  root: {
    '--primary': '#1E88E5',
    '--primary-light': '#90CAF9',
    '--secondary': '#00ACC1',
    '--secondary-light': '#80DEEA',
    '--accent': '#43A047',
    '--accent-light': '#A5D6A7',
    '--danger': '#E53935',
    '--danger-light': '#EF9A9A',
    '--neutral-bg': '#F9FAFB',
    '--card-bg': '#FFFFFF',
    '--text-primary': '#212121',
    '--text-secondary': '#757575',
    '--border': '#E0E0E0',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: 'var(--card-bg)',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
  },
  profileHeader: {
    background: 'linear-gradient(120deg, var(--primary), var(--secondary))',
    height: '150px',
    borderRadius: '12px 12px 0 0',
  },
  profileImgContainer: {
    position: 'relative',
    marginTop: '-75px',
    zIndex: 1,
  },
  profileImg: {
    width: '150px',
    height: '150px',
    border: '5px solid white',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  },
  editAvatar: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    backgroundColor: 'var(--primary)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    color: 'white',
  },
  heading: {
    fontFamily: "'Poppins', sans-serif",
  },
  verifiedBadge: {
    backgroundColor: 'var(--accent-light)',
    color: 'var(--accent)',
    padding: '0.5em 0.8em',
    borderRadius: '6px',
    fontWeight: 500,
  },
  primaryBtn: {
    backgroundColor: 'var(--primary)',
    borderColor: 'var(--primary)',
    boxShadow: '0 2px 5px rgba(30, 136, 229, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'var(--primary)',
      borderColor: 'var(--primary)',
      boxShadow: '0 4px 12px rgba(30, 136, 229, 0.3)',
      transform: 'translateY(-2px)',
    },
  },
  secondaryBtn: {
    backgroundColor: 'var(--secondary)',
    borderColor: 'var(--secondary)',
    boxShadow: '0 2px 5px rgba(0, 172, 193, 0.2)',
  },
  tabItem: {
    cursor: 'pointer',
    padding: '1rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(30, 136, 229, 0.05)',
    },
  },
  activeTab: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
  },
  formControl: {
    borderRadius: '8px',
    borderColor: 'var(--border)',
    padding: '0.6rem 1rem',
    '&:focus': {
      borderColor: 'var(--primary-light)',
      boxShadow: '0 0 0 0.25rem rgba(30, 136, 229, 0.25)',
    },
  },
  formLabel: {
    color: 'var(--text-secondary)',
    fontWeight: 500,
    marginBottom: '0.5rem',
  },
};

function ProfileComponent() {
  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  const [userData, setUserData] = useState({
    firstName: 'Jessica',
    lastName: 'Williams',
    email: 'jessica.williams@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    documents: [
      { id: 1, name: 'ID_Card.pdf', type: 'Identity', verified: true },
      { id: 2, name: 'Address_Proof.pdf', type: 'Address', verified: false }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = () => {
    // Password change logic would go here
    console.log('Password change requested');
    setUserData(prev => ({
      ...prev,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = () => {
    // Save changes logic would go here
    console.log('Saving user data:', userData);
    setIsEditing(false);
  };

  return (
    <div style={styles.root} className="container py-5">
      <div className="row">
        {/* Left Column */}
        <div className="col-lg-4 mb-4">
          {/* Profile Card */}
          <div style={styles.card} className="card mb-4">
            <div style={styles.profileHeader}></div>
            <div className="card-body text-center pt-0">
              <div style={styles.profileImgContainer} className="d-inline-block">
                <img 
                  src="https://via.placeholder.com/150" 
                  className="rounded-circle" 
                  alt="Profile" 
                  style={styles.profileImg}
                />
                <button style={styles.editAvatar}>
                  <i className="bi bi-camera-fill"></i>
                </button>
              </div>
              <h4 style={styles.heading} className="mt-3 mb-1">{userData.firstName} {userData.lastName}</h4>
              <p className="text-secondary mb-2">
                <i className="bi bi-geo-alt-fill me-1"></i>New York, USA
              </p>
              <div className="mb-3">
                <span style={styles.verifiedBadge}>
                  <i className="bi bi-check-circle-fill me-1"></i>Verified Account
                </span>
              </div>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary" 
                  style={styles.primaryBtn}
                  onClick={toggleEdit}
                >
                  <i className="bi bi-pencil-fill me-2"></i>Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={styles.card} className="card">
            <div className="card-body p-4">
              <h5 style={styles.heading} className="mb-3">Profile Management</h5>
              
              <div 
                style={{...styles.tabItem, ...(activeSection === 'personal' ? styles.activeTab : {})}} 
                className="mb-2 d-flex align-items-center"
                onClick={() => setActiveSection('personal')}
              >
                <i className="bi bi-person-fill me-3 fs-5"></i>
                <div>
                  <h6 className="mb-0" style={styles.heading}>Personal Info</h6>
                  <small className="text-secondary">Manage your details</small>
                </div>
              </div>
              
              <div 
                style={{...styles.tabItem, ...(activeSection === 'security' ? styles.activeTab : {})}}
                className="mb-2 d-flex align-items-center"
                onClick={() => setActiveSection('security')}
              >
                <i className="bi bi-shield-lock-fill me-3 fs-5"></i>
                <div>
                  <h6 className="mb-0" style={styles.heading}>Security</h6>
                  <small className="text-secondary">Update password</small>
                </div>
              </div>
              
              <div 
                style={{...styles.tabItem, ...(activeSection === 'documents' ? styles.activeTab : {})}}
                className="mb-2 d-flex align-items-center"
                onClick={() => setActiveSection('documents')}
              >
                <i className="bi bi-file-earmark-text-fill me-3 fs-5"></i>
                <div>
                  <h6 className="mb-0" style={styles.heading}>Documents</h6>
                  <small className="text-secondary">Upload verification</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-8">
          {/* Personal Information Section */}
          {activeSection === 'personal' && (
            <div style={styles.card} className="card mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 style={styles.heading} className="card-title mb-0">
                    <i className="bi bi-person-fill me-2 text-primary"></i>
                    Personal Information
                  </h4>
                  {!isEditing ? (
                    <button 
                      className="btn btn-sm btn-outline-primary rounded-pill px-3"
                      onClick={toggleEdit}
                    >
                      <i className="bi bi-pencil-fill me-1"></i>
                      Edit
                    </button>
                  ) : (
                    <button 
                      className="btn btn-sm btn-primary rounded-pill px-3"
                      onClick={saveChanges}
                    >
                      <i className="bi bi-check-lg me-1"></i>
                      Save
                    </button>
                  )}
                </div>
                
                <form>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="firstName" style={styles.formLabel}>First Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="firstName"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={styles.formControl}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lastName" style={styles.formLabel}>Last Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="lastName"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={styles.formControl}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="email" style={styles.formLabel}>Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="email"
                          name="email"
                          value={userData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          style={styles.formControl}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phone" style={styles.formLabel}>Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                        <input 
                          type="tel" 
                          className="form-control" 
                          id="phone"
                          name="phone"
                          value={userData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          style={styles.formControl}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address" style={styles.formLabel}>Address</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
                      <textarea 
                        className="form-control" 
                        id="address"
                        name="address"
                        rows="3"
                        value={userData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={styles.formControl}
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div style={styles.card} className="card mb-4">
              <div className="card-body p-4">
                <h4 style={styles.heading} className="card-title mb-4">
                  <i className="bi bi-shield-lock-fill me-2 text-primary"></i>
                  Change Password
                </h4>
                
                <form>
                  <div className="mb-3">
                    <label htmlFor="oldPassword" style={styles.formLabel}>Current Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-key"></i></span>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="oldPassword"
                        name="oldPassword"
                        value={userData.oldPassword}
                        onChange={handleChange}
                        style={styles.formControl}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="newPassword" style={styles.formLabel}>New Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-lock"></i></span>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="newPassword"
                        name="newPassword"
                        value={userData.newPassword}
                        onChange={handleChange}
                        style={styles.formControl}
                      />
                    </div>
                    <div className="form-text">
                      Password must be at least 8 characters with letters, numbers, and symbols
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" style={styles.formLabel}>Confirm New Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="confirmPassword"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        style={styles.formControl}
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={styles.primaryBtn}
                    onClick={handlePasswordChange}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Documents Section */}
          {activeSection === 'documents' && (
            <div style={styles.card} className="card mb-4">
              <div className="card-body p-4">
                <h4 style={styles.heading} className="card-title mb-4">
                  <i className="bi bi-file-earmark-text-fill me-2 text-primary"></i>
                  Uploaded Documents
                </h4>
                
                <div className="row mb-4">
                  {userData.documents.map(doc => (
                    <div className="col-md-6 mb-3" key={doc.id}>
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="me-3" style={{
                              width: '40px',
                              height: '40px',
                              backgroundColor: 'rgba(30, 136, 229, 0.1)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <i className="bi bi-file-pdf fs-4 text-primary"></i>
                            </div>
                            <div>
                              <h6 className="mb-0">{doc.name}</h6>
                              <small className="text-secondary">{doc.type} Document</small>
                            </div>
                          </div>
                          <div className="mt-3 d-flex justify-content-between align-items-center">
                            {doc.verified ? (
                              <span className="badge" style={{
                                backgroundColor: 'var(--accent-light)',
                                color: 'var(--accent)',
                              }}>
                                <i className="bi bi-check-circle-fill me-1"></i>
                                Verified
                              </span>
                            ) : (
                              <span className="badge bg-warning text-dark">
                                <i className="bi bi-hourglass-split me-1"></i>
                                Pending
                              </span>
                            )}
                            <button className="btn btn-sm btn-outline-secondary">
                              <i className="bi bi-download"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 border-dashed" style={{borderStyle: 'dashed', borderColor: 'var(--border)'}}>
                      <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                        <div style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: 'rgba(30, 136, 229, 0.1)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1rem'
                        }}>
                          <i className="bi bi-upload fs-4 text-primary"></i>
                        </div>
                        <h6 style={styles.heading}>Upload New Document</h6>
                        <p className="text-secondary small mb-3">
                          Supported formats: PDF, JPG, PNG (Max: 5MB)
                        </p>
                        <button 
                          className="btn btn-primary"
                          style={styles.primaryBtn}
                        >
                          <i className="bi bi-plus-lg me-2"></i>
                          Select File
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;