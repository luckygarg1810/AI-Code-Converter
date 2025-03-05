import { askQuestion } from "./apiservice";
import { useToken } from "../../security/TokenContext";


export const handleApiRequest = async (question, sourceLang, targetLang, setResponse, setLoading, token) => {
  setLoading(true); // Start loading
  try {
    const result = await askQuestion(question, sourceLang, targetLang, token);
    setResponse(result);
  } catch (error) {
    setResponse("Failed to get a response. Please try again.");
  } finally {
    setLoading(false); // Stop loading
  }
};
