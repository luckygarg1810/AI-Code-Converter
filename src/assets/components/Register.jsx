import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css"; // Import the external CSS file
import { BeatLoader } from "react-spinners";

function Register() {
  const navigate = useNavigate();
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Track which fields have been touched
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    username: false,
    password: false
  });
  
  // Error states
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    form: ""
  });
  
  // Form validity state
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Validate form on input changes
  useEffect(() => {
    validateForm();
  }, [fullName, email, username, password]);
  
  // Validation function
  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      username: "",
      password: "",
      form: ""
    };
    
    // Full name validation
    if (!fullName) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.length < 3 || fullName.length > 50) {
      newErrors.fullName = "Full name must be between 3 and 50 characters";
    } else if (!/^[a-zA-Z ]+$/.test(fullName)) {
      newErrors.fullName = "Full name can only contain letters and spaces";
    }
    
    // Username validation
    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 3 || username.length > 30) {
      newErrors.username = "Username must be between 3 and 30 characters";
    }
    
    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 5 characters long";
    }
    
    setErrors(newErrors);
    
    // Check if form is valid (no errors)
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    setIsFormValid(!hasErrors);
  };
  
  // Mark field as touched when user interacts with it
  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched on submit attempt
    setTouched({
      fullName: true,
      email: true,
      username: true,
      password: true
    });
    
    if (!isFormValid) {
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/auth/register`, {
        fullName,
        email,
        username,
        password
      });
      localStorage.setItem("successMessage", "Registered Successfully. Login to continue.");
      navigate("/login");
    } catch (error) {
      let errorMessage = "Registration failed!";
      setLoading(false)
      // Get specific error message from the server if available
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors({
        ...errors,
        form: errorMessage
      });
    }
  };
  
  return (
    <div className="register-container">
      <h2 className="register-heading">Register</h2>
      
      <form onSubmit={handleSubmit} className="register-form">
        {errors.form && (
          <div className="form-error">
            {errors.form}
          </div>
        )}
        
        <div className="form-group">
          <input
            type="text"
            className={`register-input ${touched.fullName && errors.fullName ? "error-input" : ""}`}
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={() => handleBlur("fullName")}
            onFocus={() => handleBlur("fullName")}
          />
          {touched.fullName && errors.fullName && (
            <div className="validation-message">
              {errors.fullName}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <input
            type="text"
            className={`register-input ${touched.email && errors.email ? "error-input" : ""}`}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            onFocus={() => handleBlur("email")}
          />
          {touched.email && errors.email && (
            <div className="validation-message">
              {errors.email}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <input
            type="text"
            className={`register-input ${touched.username && errors.username ? "error-input" : ""}`}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => handleBlur("username")}
            onFocus={() => handleBlur("username")}
          />
          {touched.username && errors.username && (
            <div className="validation-message">
              {errors.username}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <input
            type="password"
            className={`register-input ${touched.password && errors.password ? "error-input" : ""}`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            onFocus={() => handleBlur("password")}
          />
          {touched.password && errors.password && (
            <div className="validation-message">
              {errors.password}
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="register-button"
          disabled={!isFormValid}
        >
          {loading ? <BeatLoader className="loader-container" color="#ffffff" size={8} /> : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;