import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import LoadingScreen from "./Loading";

export default function ChatResponse({ response, loading }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState("Copy code")
  const handleCopy = () =>{
    if(response){
        navigator.clipboard.writeText(response)
        .then(() => setCopied("copied"))
    }
  }



  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current); // Apply syntax highlighting
    }
  },); // Reapply when response changes

  return (
    <div className="chat-response-container">
        {loading && <LoadingScreen/>}
      <div className="preResponse">
        <pre>
          <code ref={codeRef} className="javascript" >
            {response || "No response yet..."}
          </code>
        </pre>
        {response && (
            <button className="copyButton" onClick={handleCopy}>{copied}</button>
        )}
      </div>
    </div>
  );
}
