import React from 'react';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../security/AuthContext'; // Import useAuth
import usericon from '../svg/usericon.svg'
import logo from '../svg/logo.svg'
import { useToken } from '../../security/TokenContext';

function Header() {
  const { token, logout } = useAuth();  // Access token and logout from AuthContext
  const navigate = useNavigate()
  const {tokensLeft, currentPlan} = useToken()

  const handleHomeClick = () => {
    navigate('/');  // Navigate to homepage on title click
  };

  return (
    <div className="container headerwidth d-flex justify-content-between align-items-center">
      {/* Title with click to go to homepage */}
      <div className="app-name" onClick={handleHomeClick}>
        <div className="title">
          <img src={logo} alt="" />
          <h4 className="m-0 text-white name">AI Code Converter</h4>
          </div>
      </div>

      {!token && (
        <div className="tokens-left">
          <p className="text-white m-0">Tokens Left: {tokensLeft}</p>
        </div>
      )}

      {token && (
        <div className="tokens-left">
          <p className="text-white m-0">Tokens Left: {tokensLeft}</p>
        </div>
      )}

      {/* Button Container */}
      <div className="button-container d-flex">
  
        
        {token && currentPlan !== 'SUPER' && (
          <Link to="/pricing">
            <button className="btn btn-outline-success m-2">Upgrade</button>
          </Link>
        )}
      
        {/* Show Login button when user is not logged in */}
        {!token ? (
          <Link to="/login">
            <button className="btn btn-success loginButton m-2">Login</button>
          </Link>
        ) : (
          <button className="btn btn-outline-danger m-2" onClick={logout}>
            Logout
          </button>
        )}
        {
          token &&
          <Link to="/user-details">
          <div  className='m-2 userdetailicon'> <img src={usericon} alt="" /></div>
          </Link>
        }
              
      </div>
    </div>
  );
}

export default Header;
