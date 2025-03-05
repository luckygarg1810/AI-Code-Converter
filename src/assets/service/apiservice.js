import axios from "axios";
const API_BASE_URL = `${import.meta.env.VITE_APP_API_URL}/api/qna`;


export const askQuestion = async (question, sourceLang, targetLang, token) =>{
    
    const prompt = `${question.trim()} Convert this code from ${sourceLang} to ${targetLang}. Just answer me with code syntax not even a single word except the code. Not even mention the language from which you are converting. Please return the code in raw text without any markdown formatting (i.e., without the triple backticks or any additional characters around the code). If code is not valid or incorrect return that Please enter valid ${sourceLang} code.`;

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.post(`${API_BASE_URL}/ask`, { question: prompt } ,  { headers } );
        return response.data.candidates[0].content.parts[0].text; // Extract raw text
      } 
      catch (error) {
        console.error("API call failed:", error);
        throw new Error("Failed to get a response. Please try again.");
      }
  
}

