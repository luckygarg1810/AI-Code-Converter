import React from "react";
import "./style.css"; // Custom CSS file
import { useAuth } from "../../security/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails } from "../service/fetchUserDetails";
import edit from '../svg/edit.svg'
import axios from "axios";

function UserDetails() {
  const [userDetails, setUserDetails] = useState(null);
  const { token, userId } = useAuth(); // Access token and user from context
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");

  // State for editing full name and username
  const [isEditing, setIsEditing] = useState({ fullName: false, username: false });
  const [editedDetails, setEditedDetails] = useState({ fullName: "", username: "" });
  
  useEffect(() => {
    if (token && userId) {
      fetchUserDetails(token, userId)
      .then((data) => {setUserDetails(data); setLoading(false) })
      .catch((error) => {console.log(error); setLoading(false)}) // Use the user.id from context
    } else {
      setLoading(false)
      setUserDetails(null); // Clear the user details if no token or user data is found
    }
  }, [token, userId]); // Dependency array includes token and user
  
  const handleEditClick = (field) => {
    setEditedDetails((prev) => ({
      ...prev,
      [field]: userDetails[field], // Set the current value before editing
    }));
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (e, field) => {
    setEditedDetails((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const updateUserProfile = async (token, userId, updatedData) => {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API_URL}/users/${userId}/update`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  const handleSave =async (field) => {
    // TODO: Send updated details to backend (Implement API call here)
    try {
      const updatedData = {
        fullName: field === "fullName" ? editedDetails.fullName : userDetails.fullName,
        username: field === "username" ? editedDetails.username : userDetails.username,
      }
      const updatedUser = await updateUserProfile(token, userId, updatedData);
      setUserDetails(updatedUser);
      setIsEditing((prev) => ({ ...prev, [field]: false }));
      setError("");
    }
    catch(err){
      setError("Failed to update. Try again.");
      console.error(err);
    }
  };

  const handleUpgradeClick = () =>{
      navigate("/pricing")
  }
 
  return  (
    <div className="user-details-container">
      {loading ? (
        <div className="user-details-card skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-button"></div>
        </div>
      ) : userDetails ? (
        <div className="user-details-card">
          <h3 className="user-details-title">User Details</h3>
          {error && <p className="error-message">{error}</p>}
          <div className="user-details-info">
            {/* Full Name Field */}
            <p>
              <strong>Full Name:</strong>{" "}
              {isEditing.fullName ? (
                <>
                  <input
                    type="text"
                    value={editedDetails.fullName}
                    onChange={(e) => handleInputChange(e, "fullName")}
                    className="edit-input"
                  />
                  <button className="save-button" onClick={() => handleSave("fullName")}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  {userDetails.fullName}{" "}
                  <button className="icon-button" onClick={() => handleEditClick("fullName")}>
                    <img src={edit} alt="Edit" />
                  </button>
                </>
              )}
            </p>

            {/* Username Field */}
            <p>
              <strong>Username:</strong>{" "}
              {isEditing.username ? (
                <>
                  <input
                    type="text"
                    value={editedDetails.username}
                    onChange={(e) => handleInputChange(e, "username")}
                    className="edit-input"
                  />
                  <button className="save-button" onClick={() => handleSave("username")}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  {userDetails.username}{" "}
                  <button className="icon-button icon-button2" onClick={() => handleEditClick("username")}>
                    <img src={edit} alt="Edit" />
                  </button>
                </>
              )}
            </p>

            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Plan:</strong> {userDetails.planType}{" "}
              {userDetails.planType !== "SUPER" && (
                <button className="upgrade-button" onClick={handleUpgradeClick}>
                  Upgrade
                </button>
              )}
            </p>
            {userDetails.planType !== "FREE" && (
              <p>
                <strong>Expires on:</strong> {userDetails.planExpiryDate}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="user-details-message">
          <p>Please log in to see your details.</p>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
