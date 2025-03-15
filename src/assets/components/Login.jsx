import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../security/AuthContext";
import { useEffect } from "react";  
import { BeatLoader } from "react-spinners";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();  // Access the login function from AuthContext

  useEffect(() => {
    // Retrieve message from localStorage
    const message = localStorage.getItem("successMessage");
    if (message) {
      setSuccessMessage(message);
      localStorage.removeItem("successMessage"); // Clear message after displaying
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
  const { success, message } = await login(username, password);
  if (success) {
    navigate("/"); // Navigate to homepage on successful login
  } else {
    setLoading(false)
    setErrorMessage(message); // Set error message if login fails
  }
  };


  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button">{loading ? <BeatLoader className="loader-container" color="#ffffff" size={8} /> : "Login"}</button>
      </form>
      <p className="login-register-link">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;
