import React from "react";
import Editor from "@monaco-editor/react";

const languageMap = {
  "index.html": "html",
  "style.css": "css",
  "script.js": "javascript",
};

export default function CodeEditor({ code, fileName, onChange }) {
  const language = languageMap[fileName] || "javascript";

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
          fontSize: 14,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
