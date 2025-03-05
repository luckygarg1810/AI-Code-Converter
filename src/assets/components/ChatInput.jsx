import { useState, useEffect, useRef } from "react";
import hljs from "highlight.js";
import { useAuth } from "../../security/AuthContext";
import "highlight.js/styles/atom-one-dark.css"; // Import the Atom One Dark theme
import { useToken } from "../../security/TokenContext";


export default function ChatInput({ onSend }) {
  const [question, setQuestion] = useState("");
  const codeRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const {isLoggedOut} = useAuth()
  const {decrementTokens} = useToken()

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (question.trim()) {
      onSend(question);
    }
     decrementTokens()
  };

  const clear = () => {
    setQuestion("");
  };

 
  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(codeRef.current); // Highlight the code every time it changes
    }
  }, [question]); // Reapply highlighting whenever the question (code) changes

  // useEffect(() => {
  //   if (isLoggedOut) {
  //     setShowPopup(true);
  //     const timer = setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
  //     return () => clearTimeout(timer); // Cleanup timeout on component unmount
  //   }
  // }, [isLoggedOut]);

  return (
    <div className="chat-input-container">
     {/* {showPopup && (
  <div className="popup-message">
    <span className="popup-icon">✅</span>
    <p>You have been logged out successfully.</p>
  </div>
     )} */}
      <form className="d-flex flex-column" onSubmit={handleSendMessage}>
        <textarea
          ref={codeRef}
          className="chat-textarea language-java"
          placeholder="Type your code here..."
          value={question}
          rows={20}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="d-flex justify-content-center mt-2">
          <button type="submit" className="btn btn-success m-2">
            Convert
          </button>
          <button type="reset" onClick={clear} className="btn btn-secondary m-2">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
