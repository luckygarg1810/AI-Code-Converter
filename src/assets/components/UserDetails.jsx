import React from "react";
import "./style.css"; // Custom CSS file
import { useAuth } from "../../security/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails } from "../service/fetchUserDetails";

function UserDetails() {
  const [userDetails, setUserDetails] = useState(null);
  const { token, userId } = useAuth(); // Access token and user from context
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true); 
  
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
          <div className="user-details-info">
            <p><strong>Full Name:</strong> {userDetails.fullName}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p>
              <strong>Plan:</strong> {userDetails.planType}{" "}
              {userDetails.planType !== "SUPER" && (
                <button className="upgrade-button" onClick={handleUpgradeClick}>
                  Upgrade
                </button>
              )}
            </p>
            {userDetails.planType !== "FREE" && (
              <p><strong>Expires on:</strong> {userDetails.planExpiryDate}</p>
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
