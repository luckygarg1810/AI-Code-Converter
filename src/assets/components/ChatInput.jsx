import { useState, useEffect, useRef } from "react";
import hljs from "highlight.js";
import { useAuth } from "../../security/AuthContext";
import "highlight.js/styles/atom-one-dark.css"; // Import the Atom One Dark theme
import { useToken } from "../../security/TokenContext";


export default function ChatInput({ onSend }) {
  const [question, setQuestion] = useState("");
  const codeRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const {isLoggedOut, token} = useAuth()
  const {decrementTokens, tokensLeft, currentPlan} = useToken()
  const [guestTokensLeft, setGuestTokensLeft] = useState(() => {
    const savedTokens = localStorage.getItem("guestTokens");
    return savedTokens !== null ? Number(savedTokens) : 10;
  });


  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!isConvertDisabled) {
      if (question.trim()) {
        onSend(question);
      }
      decrementTokens();

      if (!token) {
        // For guest users, manually update local tokens
        setGuestTokensLeft((prev) => {
          const updatedTokens = prev - 1;
          localStorage.setItem("guestTokens", updatedTokens);
          return updatedTokens;
        });
      }
    }
  };

  const clear = () => {
    setQuestion("");
  };

  const isGuest = !token;
  const effectiveTokensLeft = isGuest ? guestTokensLeft : tokensLeft;
  const isConvertDisabled = effectiveTokensLeft === 0;

  const getTooltip = () => {
    if (isGuest) return "Please login to use more";
    if (currentPlan === "FREE") return "Please upgrade to use more";
    return "";
  };

 
  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(codeRef.current); // Highlight the code every time it changes
    }
  }, [question]); // Reapply highlighting whenever the question (code) changes

  return (
    <div className="chat-input-container">
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
      <div
        className="m-2"
        title={isConvertDisabled ? getTooltip() : ""}
        style={{ display: "inline-block" }}
      >
        <button
          type="submit"
          className="btn btn-success"
          disabled={isConvertDisabled}
        >
          Convert
        </button>
      </div>
      <button
        type="reset"
        onClick={clear}
        className="btn btn-secondary m-2"
      >
        Clear
      </button>
    </div>
  </form>
</div>
  );
}
