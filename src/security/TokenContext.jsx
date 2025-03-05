import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserDetails } from '../assets/service/fetchUserDetails';
import { useAuth } from './AuthContext';

const TokenContext = createContext();

export const useToken = () => {
  return useContext(TokenContext);
};

export const TokenProvider = ({ children }) => {
  const { token, userId } = useAuth(); // Get token from Auth context
  const [tokensLeft, setTokensLeft] = useState(() => {
    const savedTokens = localStorage.getItem('guestTokens');
    return savedTokens !== null ? Number(savedTokens) : 10;
  });
  const [currentPlan, setCurrentPlan] = useState(null); // Plan of the user (Free, Base, Super)

  useEffect(() => {
    if (!token) {
      const savedTokens = localStorage.getItem('guestTokens');
      setTokensLeft(savedTokens !== null ? Number(savedTokens) : 10);
    }
  }, [token]);

  // Fetch user details and tokens when the user is logged in
  useEffect(() => {
    if (token && userId) {
      fetchUserDetails(token, userId)
        .then((data) => {
          setCurrentPlan(data.planType);
          const usedTokens = data.usedTokens;

          // For Free plan users, calculate tokens left as 10 - usedTokens
          if (data.planType === 'FREE') {
            setTokensLeft(100 - usedTokens); // 10 tokens for free plan users
          } else {
            setTokensLeft("Unlimited"); // Base/Super plans have unlimited tokens
          }
        })
        .catch((error) => console.error('Error fetching user details:', error));
    }
  }, [token, userId]);

  const refreshTokens = async () => {
    if (!token || !userId) return;

    try {
      const data = await fetchUserDetails(token, userId);
      setCurrentPlan(data.planType);

      if (data.planType === 'FREE') {
        const usedTokens = data.usedTokens;
        setTokensLeft(100 - usedTokens);
      } else if (data.planType === 'BASE' || data.planType === 'SUPER') {
        setTokensLeft('Unlimited');
      }
    } catch (error) {
      console.error('Error refreshing tokens:', error);
    }
  };



  // Decrement tokens for guest users when "Convert" is clicked
  const decrementTokens = async () => {
    if (token) {
      fetchUserDetails(token, userId)
        .then((data) => {
          const usedTokens = data.usedTokens;
          if (data.planType === 'FREE' && usedTokens < 100) {
            const newUsedTokens = usedTokens + 1;
            setTokensLeft(100 - newUsedTokens);
            // Add your backend update logic here
          } else if (data.planType === 'BASE' || data.planType === 'SUPER') {
            setTokensLeft("Unlimited");
          }
        })
        .catch((error) => console.error('Error decrementing tokens:', error));
    } else {
      if (tokensLeft > 0) {
        setTokensLeft((prevTokens) => {
          const updatedTokens = prevTokens - 1;
          localStorage.setItem('guestTokens', updatedTokens); // ✅ Save to localStorage
          return updatedTokens;
        });
      } else {
        alert("Guest token limit reached. Please log in for more access.");
      }
    }
  };
  
  
  return (
    <TokenContext.Provider value={{ tokensLeft, decrementTokens, currentPlan, refreshTokens }}>
      {children}
    </TokenContext.Provider>
  );
};
