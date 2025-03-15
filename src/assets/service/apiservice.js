import axios from "axios";
const API_BASE_URL = `${import.meta.env.VITE_APP_API_URL}/api/qna`;


export const askQuestion = async (question, sourceLang, targetLang, token) =>{
    
    const prompt = `${question.trim()} Convert this code from ${sourceLang} to ${targetLang}. Just answer me with code syntax not even a single word except the code. Not even mention the language from which you are converting. Also don't send in markdown formatting, just send it in raw text. If code is not valid or incorrect return that Please enter valid ${sourceLang} code. If code contains comments, then show comments in ${targetLang} too accordingly. If code contains any instructions like modifying the code little bit or removing all the comments do it too. If the code is not convertable to ${targetLang} then return This ${sourceLang} code can't be converted into ${targetLang}. If user demands for output too in instructions and output can be shown in text, write the output with output heading. `;

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

