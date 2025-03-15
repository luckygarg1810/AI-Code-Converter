import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/atom-one-dark.css";
import LoadingScreen from "./Loading";

export default function ChatResponse({ response, loading, language = "auto" }) {
  const preRef = useRef(null);
  const [copied, setCopied] = useState("Copy code");
  const [highlightedCode, setHighlightedCode] = useState("");
  
  const handleCopy = () => {
    if(response) {
      navigator.clipboard.writeText(response)
        .then(() => {
          setCopied("copied");
          setTimeout(() => setCopied("Copy code"), 2000);
        });
    }
  };

  useEffect(() => {
    if (response) {
      try {
        // Create a temporary element outside the React flow
        const tempElement = document.createElement("code");
        tempElement.textContent = response;
        
        // Apply highlighting based on language
        if (language === "auto") {
          const highlighted = hljs.highlightAuto(response);
          tempElement.innerHTML = highlighted.value;
          tempElement.classList.add(highlighted.language);
        } else {
          const highlighted = hljs.highlight(response, { language });
          tempElement.innerHTML = highlighted.value;
          tempElement.classList.add(language);
        }
        
        // Get the highlighted HTML
        setHighlightedCode(tempElement.outerHTML);
      } catch (error) {
        console.error("Highlighting error:", error);
        // Fallback to plain text if highlighting fails
        setHighlightedCode(`<code>${response}</code>`);
      }
    } else {
      setHighlightedCode("");
    }
  }, [response, language]);

  return (
    <div className="chat-response-container">
      {loading && <LoadingScreen/>}
      <div className="preResponse">
        <pre ref={preRef} className="hljs">
          {highlightedCode ? (
            <div className="responsediv" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          ) : (
            <code>{response || "No response yet..."}</code>
          )}
        </pre>
        {response && (
          <button className="copyButton" onClick={handleCopy}>{copied}</button>
        )}
      </div>
    </div>
  );
}