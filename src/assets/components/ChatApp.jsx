
import './style.css';

import Header from "./Header";

import { AuthProvider } from '../../security/AuthContext';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Pricing from "./Pricing";
import UserDetails from "./UserDetails";
import Homepage from "./HomePage";
import { TokenProvider } from '../../security/TokenContext';

function ChatApp() {
  
  return (
    <div className="chat-wrapper">
        <BrowserRouter>
      <AuthProvider>
        <TokenProvider>
       <Header/>
       <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/pricing" element={<Pricing/>} />
          <Route path="/user-details" element={<UserDetails/>} />
          <Route path="/upgrade" element={<Homepage/>}/>   
          <Route path="/" element={<Homepage/>}/>   
      </Routes>
      </TokenProvider>
      </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default ChatApp;
