import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // You can choose any style you like

export default function ExampleInput() {
  const codeString = `
 console.log("My First Java Program.");
  `;
  
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current);
    }
  }, []);

  return (
    <div>
      <pre>
        <code ref={codeRef} className="javascript">
          {codeString}
        </code>
      </pre>
    </div>
  );
}
