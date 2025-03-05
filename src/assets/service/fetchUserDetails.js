import axios from "axios";


export const fetchUserDetails = async (token, userId) => {
    try {
      
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Return user details
      } catch (error) {
        console.error("Error fetching user details", error);
        throw error; // Re-throw the error to handle it in the calling function
      }
  };