import { useState } from "react";
import { handleApiRequest } from "../service/handleApiRequest";
import { useAuth } from "../../security/AuthContext";

const useChatAppHook = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState("java");
  const [targetLang, setTargetLang] = useState("c++");
  const {token} = useAuth()

  const handleSubmitApi = (question) => {
    handleApiRequest(question, sourceLang, targetLang, setResponse, setLoading, token);
  };

  return {
    response,
    loading,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    handleSubmitApi,
  };
};

export default useChatAppHook;
