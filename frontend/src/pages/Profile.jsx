import React, { useState, useEffect, useRef } from "react";
import AppNavbar from "../components/common/Navbar";
import axios from "axios";
import WalletComponent from "../pages/WalletComponent";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RFOTpCedU17Fc7wGrEfO14CXtqFurHULvCFQccgYf5DgPnJ9VIAOJw5RjWrlfgeXoHs6IVPqFqQDUfIRoOcii7K00cHFKj2Hy"
);
const styles = {
  root: {
    "--primary": "#1E88E5",
    "--primary-light": "#90CAF9",
    "--secondary": "#00ACC1",
    "--secondary-light": "#80DEEA",
    "--accent": "#43A047",
    "--accent-light": "#A5D6A7",
    "--danger": "#E53935",
    "--danger-light": "#EF9A9A",
    "--warning": "#FFC107",
    "--neutral-bg": "#F9FAFB",
    "--card-bg": "#FFFFFF",
    "--text-primary": "#212121",
    "--text-secondary": "#757575",
    "--border": "#E0E0E0",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: "var(--card-bg)",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
  },
  profileHeader: {
    background: "linear-gradient(120deg, var(--primary), var(--secondary))",
    height: "150px",
    borderRadius: "12px 12px 0 0",
  },
  profileImgContainer: {
    position: "relative",
    marginTop: "-75px",
    zIndex: 1,
  },
  profileImg: {
    width: "150px",
    height: "150px",
    border: "5px solid white",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  },
  editAvatar: {
    position: "absolute",
    bottom: "0",
    right: "0",
    backgroundColor: "var(--primary)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    color: "white",
  },
  heading: {
    fontFamily: "'Poppins', sans-serif",
  },
  verifiedBadge: {
    backgroundColor: "var(--accent-light)",
    color: "var(--accent)",
    padding: "0.5em 0.8em",
    borderRadius: "6px",
    fontWeight: 500,
  },
  primaryBtn: {
    backgroundColor: "var(--primary)",
    borderColor: "var(--primary)",
    boxShadow: "0 2px 5px rgba(30, 136, 229, 0.2)",
    transition: "all 0.3s ease",
  },
  secondaryBtn: {
    backgroundColor: "var(--secondary)",
    borderColor: "var(--secondary)",
    boxShadow: "0 2px 5px rgba(0, 172, 193, 0.2)",
  },
  tabItem: {
    cursor: "pointer",
    padding: "1rem",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(30, 136, 229, 0.05)",
    },
  },
  activeTab: {
    backgroundColor: "var(--primary-light)",
    color: "var(--primary)",
  },
  formControl: {
    borderRadius: "8px",
    borderColor: "var(--border)",
    padding: "0.6rem 1rem",
  },
  formLabel: {
    color: "var(--text-secondary)",
    fontWeight: 500,
    marginBottom: "0.5rem",
  },
  documentPreview: {
    maxWidth: "100%",
    maxHeight: "200px",
    objectFit: "contain",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    backgroundColor: "#f8f9fa",
  },
};

function ProfileComponent() {
  const [activeSection, setActiveSection] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  // Document upload state
  const [proofType, setProofType] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedUser = localStorage.getItem("currentUser");
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      console.log("currentUser is", currentUser?.id);

      if (!currentUser?.id) {
        console.warn("No user ID found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/user/${currentUser.id}`
        );
        console.log("User data response:", response.data);
        setUserData(response.data);

        // Set proofType from loaded data
        if (response.data.proofType) {
          setProofType(response.data.proofType);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = async () => {
    const storedUser = localStorage.getItem("currentUser");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const { currentPassword, newPassword, confirmPassword } = userData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/auth/change-password/${currentUser.id}`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Password changed successfully");
      // Clear password fields
      setUserData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
      console.error("Password change error:", error);
    }
  };

  const handleSelectFileClick = () => {
    if (!proofType) {
      alert("Please select a document type first");
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    // Verify file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit");
      setIsUploading(false);
      return;
    }

    // Verify file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload a JPG, PNG or PDF file");
      setIsUploading(false);
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("proof", file);
    formData.append("userId", userData._id);
    formData.append("proofType", proofType);

    try {
      const response = await axios.post(
        "http://localhost:3000/user/uploadProof",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Document uploaded:", response.data);
      setUploadSuccess(true);

      // Update user data with the new proof information
      setUserData((prev) => ({
        ...prev,
        proof: response.data.proof,
        proofType: response.data.proofType,
      }));
    } catch (error) {
      console.error(
        "Upload failed:",
        error.response?.data?.error || error.message
      );
      setUploadError(
        error.response?.data?.error || "Failed to upload document"
      );
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = async () => {
    console.log("Saving user data:", userData);
    try {
      const res = await axios.patch(
        "http://localhost:3000/user/update-profile",
        userData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Updated user:", res.data.user);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Failed to update profile");
    }
  };

  const getVerificationStatusBadge = () => {
    switch (userData.verified) {
      case "approved":
        return (
          <span
            style={{
              backgroundColor: "var(--accent-light)",
              color: "var(--accent)",
              padding: "0.5em 0.8em",
              borderRadius: "6px",
              fontWeight: 500,
            }}
          >
            <i className="bi bi-check-circle-fill me-1"></i>
            Approved
          </span>
        );
      case "rejected":
        return (
          <span
            style={{
              backgroundColor: "var(--danger-light)",
              color: "var(--danger)",
              padding: "0.5em 0.8em",
              borderRadius: "6px",
              fontWeight: 500,
            }}
          >
            <i className="bi bi-x-circle-fill me-1"></i>
            Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span
            style={{
              backgroundColor: "var(--warning)",
              color: "#856404",
              padding: "0.5em 0.8em",
              borderRadius: "6px",
              fontWeight: 500,
            }}
          >
            <i className="bi bi-hourglass-split me-1"></i>
            Pending Verification
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div>
        <AppNavbar />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppNavbar />
      <div style={styles.root} className="container py-5">
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-4 mb-4">
            {/* Profile Card */}
            <div style={styles.card} className="card mb-4">
              <div style={styles.profileHeader}></div>
              <div className="card-body text-center pt-0">
                <div
                  style={styles.profileImgContainer}
                  className="d-inline-block"
                >
                  <img
                    src={
                      userData.imagePath || "https://via.placeholder.com/150"
                    }
                    className="rounded-circle"
                    alt="Profile"
                    style={styles.profileImg}
                  />
                  <button style={styles.editAvatar}>
                    <i className="bi bi-camera-fill"></i>
                  </button>
                </div>
                <h4 style={styles.heading} className="mt-3 mb-1">
                  {userData.fullName}
                </h4>
                <p className="text-secondary mb-2">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {userData.address || "No address provided"}
                </p>
                <div className="mb-3">{getVerificationStatusBadge()}</div>
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
                <h5 style={styles.heading} className="mb-3">
                  Profile Management
                </h5>

                <div
                  style={{
                    ...styles.tabItem,
                    ...(activeSection === "personal" ? styles.activeTab : {}),
                  }}
                  className="mb-2 d-flex align-items-center"
                  onClick={() => setActiveSection("personal")}
                >
                  <i className="bi bi-person-fill me-3 fs-5"></i>
                  <div>
                    <h6 className="mb-0" style={styles.heading}>
                      Personal Info
                    </h6>
                    <small className="text-secondary">
                      Manage your details
                    </small>
                  </div>
                </div>

                <div
                  style={{
                    ...styles.tabItem,
                    ...(activeSection === "security" ? styles.activeTab : {}),
                  }}
                  className="mb-2 d-flex align-items-center"
                  onClick={() => setActiveSection("security")}
                >
                  <i className="bi bi-shield-lock-fill me-3 fs-5"></i>
                  <div>
                    <h6 className="mb-0" style={styles.heading}>
                      Security
                    </h6>
                    <small className="text-secondary">Update password</small>
                  </div>
                </div>

                <div
                  style={{
                    ...styles.tabItem,
                    ...(activeSection === "wallet" ? styles.activeTab : {}),
                  }}
                  className="mb-2 d-flex align-items-center"
                  onClick={() => setActiveSection("wallet")}
                >
                  <i className="bi bi-wallet2 me-3 fs-5"></i>
                  <div>
                    <h6 className="mb-0" style={styles.heading}>
                      Wallet
                    </h6>
                    <small className="text-secondary">Manage your funds</small>
                  </div>
                </div>

                <div
                  style={{
                    ...styles.tabItem,
                    ...(activeSection === "documents" ? styles.activeTab : {}),
                  }}
                  className="mb-2 d-flex align-items-center"
                  onClick={() => setActiveSection("documents")}
                >
                  <i className="bi bi-file-earmark-text-fill me-3 fs-5"></i>
                  <div>
                    <h6 className="mb-0" style={styles.heading}>
                      Documents
                    </h6>
                    <small className="text-secondary">
                      Upload verification
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-8">
            {/* Personal Information Section */}
            {activeSection === "personal" && (
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
                        <label htmlFor="fullName" style={styles.formLabel}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          name="fullName"
                          value={userData.fullName || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          style={styles.formControl}
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label htmlFor="email" style={styles.formLabel}>
                          Email Address
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-envelope"></i>
                          </span>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={userData.email || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            style={styles.formControl}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone" style={styles.formLabel}>
                          Phone Number
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-telephone"></i>
                          </span>
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={userData.phone || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            style={styles.formControl}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="address" style={styles.formLabel}>
                        Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-geo-alt"></i>
                        </span>
                        <textarea
                          className="form-control"
                          id="address"
                          name="address"
                          rows="3"
                          value={userData.address || ""}
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
            {activeSection === "security" && (
              <div style={styles.card} className="card mb-4">
                <div className="card-body p-4">
                  <h4 style={styles.heading} className="card-title mb-4">
                    <i className="bi bi-shield-lock-fill me-2 text-primary"></i>
                    Change Password
                  </h4>

                  <form>
                    <div className="mb-3">
                      <label htmlFor="currentPassword" style={styles.formLabel}>
                        Current Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-key"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          name="currentPassword"
                          value={userData.currentPassword || ""}
                          onChange={handleChange}
                          style={styles.formControl}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="newPassword" style={styles.formLabel}>
                        New Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={userData.newPassword || ""}
                          onChange={handleChange}
                          style={styles.formControl}
                        />
                      </div>
                      <div className="form-text">
                        Password must be at least 8 characters with letters,
                        numbers, and symbols
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" style={styles.formLabel}>
                        Confirm New Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={userData.confirmPassword || ""}
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

            {/* Wallet Section */}
            {activeSection === "wallet" && (
              <Elements stripe={stripePromise}>
                <WalletComponent onClose={() => setActiveSection("wallet")} />
              </Elements>
            )}

            {/* Documents Section */}
            {activeSection === "documents" && (
              <div style={styles.card} className="card mb-4">
                <div className="card-body p-4">
                  <h4 style={styles.heading} className="card-title mb-4">
                    <i className="bi bi-file-earmark-text-fill me-2 text-primary"></i>
                    Verification Documents
                  </h4>

                  <div className="row mb-4">
                    {/* Existing Document Card */}
                    {userData.proof && (
                      <div className="col-md-6 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <div
                                className="me-3"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: "rgba(30, 136, 229, 0.1)",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <i className="bi bi-file-earmark-text fs-4 text-primary"></i>
                              </div>
                              <div>
                                <h6 className="mb-0">Verification Document</h6>
                                <small className="text-secondary">
                                  {userData.proofType === "driving license"
                                    ? "Driver's License"
                                    : userData.proofType === "passport"
                                    ? "Passport"
                                    : "Document"}
                                </small>
                              </div>
                            </div>

                            {/* Document Preview */}
                            <div className="text-center mb-3">
                              <img
                                src={`http://localhost:3000/images/${userData.proof}`}
                                alt="Document Preview"
                                style={styles.documentPreview}
                                onError={(e) => {
                                  // If error loading image (e.g., if it's a PDF)
                                  e.target.style.display = "none";
                                  const fallbackElement =
                                    document.createElement("div");
                                  fallbackElement.innerHTML = `
                                    <div class="p-4 text-center" style="border: 1px solid var(--border); border-radius: 8px;">
                                      <i class="bi bi-file-earmark-pdf fs-1 text-danger"></i>
                                      <p class="mt-2 mb-0">Document preview not available</p>
                                    </div>
                                  `;
                                  e.target.parentNode.appendChild(
                                    fallbackElement
                                  );
                                }}
                              />
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                              <span
                                className="badge"
                                style={{
                                  backgroundColor:
                                    userData.verified === "approved"
                                      ? "var(--accent-light)"
                                      : userData.verified === "rejected"
                                      ? "var(--danger-light)"
                                      : "var(--warning)",
                                  color:
                                    userData.verified === "approved"
                                      ? "var(--accent)"
                                      : userData.verified === "rejected"
                                      ? "var(--danger)"
                                      : "#856404",
                                }}
                              >
                                <i
                                  className={`bi bi-${
                                    userData.verified === "approved"
                                      ? "check-circle-fill"
                                      : userData.verified === "rejected"
                                      ? "x-circle-fill"
                                      : "hourglass-split"
                                  } me-1`}
                                ></i>
                                {userData.verified === "approved"
                                  ? "Approved"
                                  : userData.verified === "rejected"
                                  ? "Rejected"
                                  : "Pending"}
                              </span>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() =>
                                  window.open(
                                    `http://localhost:3000/images/${userData.proof}`,
                                    "_blank"
                                  )
                                }
                              >
                                <i className="bi bi-eye me-1"></i>
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upload New Document */}
                    <div
                      className={
                        userData.proof ? "col-md-6 mb-3" : "col-md-12 mb-3"
                      }
                    >
                      <div
                        className="card h-100 border-dashed"
                        style={{
                          borderStyle: "dashed",
                          borderColor: "var(--border)",
                        }}
                      >
                        <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              backgroundColor: "rgba(30, 136, 229, 0.1)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "1rem",
                            }}
                          >
                            <i className="bi bi-upload fs-4 text-primary"></i>
                          </div>
                          <h6 style={styles.heading}>
                            {userData.proof
                              ? "Update Document"
                              : "Upload Document"}
                          </h6>
                          <p className="text-secondary small mb-3">
                            Supported formats: PDF, JPG, PNG (Max: 5MB)
                          </p>

                          {/* Document Type Selection */}
                          <div className="form-group mb-3 w-100">
                            <select
                              className="form-control"
                              value={proofType}
                              onChange={(e) => setProofType(e.target.value)}
                              style={styles.formControl}
                            >
                              <option value="">Select Document Type</option>
                              <option value="driving license">
                                Driver's License
                              </option>
                              <option value="passport">Passport</option>
                            </select>
                          </div>

                          {/* Status Messages */}
                          {uploadSuccess && (
                            <div className="alert alert-success w-100 py-2">
                              <i className="bi bi-check-circle me-2"></i>
                              Document uploaded successfully
                            </div>
                          )}

                          {uploadError && (
                            <div className="alert alert-danger w-100 py-2">
                              <i className="bi bi-exclamation-triangle me-2"></i>
                              {uploadError}
                            </div>
                          )}

                          {/* Upload Button */}
                          <button
                            className="btn btn-primary"
                            style={styles.primaryBtn}
                            onClick={handleSelectFileClick}
                            disabled={isUploading || !proofType}
                          >
                            {isUploading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-plus-lg me-2"></i>
                                {userData.proof
                                  ? "Update Document"
                                  : "Select Document"}
                              </>
                            )}
                          </button>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Information and Help Text */}
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Why do we need this?</strong> Document verification
                    helps us confirm your identity and increases the security of
                    your account. Your document will be reviewed by our team
                    within 24-48 hours. You'll receive a notification when your
                    verification is complete.
                  </div>

                  {userData.verified === "rejected" && (
                    <div className="alert alert-danger mt-3">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <strong>Your verification was rejected.</strong> Please
                      upload a clearer image of your identification document.
                      Make sure all details are visible and the document is
                      valid.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;
