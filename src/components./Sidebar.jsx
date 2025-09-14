import React from "react";

const fileIcons = {
  "index.html": "📄",
  "style.css": "🎨",
  "script.js": "⚡",
};

const Sidebar = ({ files, activeFile, setActiveFile }) => {
  return (
    <div className="w-60 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col">
      <h2 className="font-bold mb-4">Project Files</h2>
      <ul>
        {files.map((file) => (
          <li
            key={file}
            onClick={() => setActiveFile(file)}
            className={`p-2 rounded cursor-pointer flex items-center gap-2 ${
              activeFile === file
                ? "bg-blue-200 dark:bg-blue-700 font-bold"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span>{fileIcons[file] || "📁"}</span>
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
