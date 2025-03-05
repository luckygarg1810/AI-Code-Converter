import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../security/AuthContext";  

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();  // Access the login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
  const { success, message } = await login(username, password);
  if (success) {
    navigate("/"); // Navigate to homepage on successful login
  } else {
    setErrorMessage(message); // Set error message if login fails
  }
  };


  const handleOAuthLogin = (provider) => {
    // Redirect to OAuth authorization endpoint
    window.location.href = `${import.meta.env.VITE_APP_API_URL}/oauth2/authorization/${provider}`;
  };
  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
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
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="login-register-link">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;
