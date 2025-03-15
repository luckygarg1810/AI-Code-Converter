import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const[userId, setUserId] = useState(localStorage.getItem("userId"))
  const navigate = useNavigate()
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  const login = async(username, password) => {
    try{
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/auth/login`, { username, password });
      console.log(response)
      const { id, token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", id)
      setToken(token);
      setUserId(id);
      return { success: true };
    }
    catch(error){
      return { success: false, message: "Incorrect username or password!" };
    }
  };

  // useEffect(() => {
  //   const savedToken = localStorage.getItem("token");
  //   const savedUserId = localStorage.getItem("userId");

  //   if (savedToken && savedUserId) {
  //     // Clear session on app reload
  //     logout();
  //   }
  // }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId")
    setUserId(null);
    setIsLoggedOut(true)
    navigate("/")
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout, isLoggedOut}}>
      {children}
    </AuthContext.Provider>
  );
}
