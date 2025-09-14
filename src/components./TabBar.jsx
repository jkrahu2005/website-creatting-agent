import React from "react";

const TabBar = ({ files, activeFile, setActiveFile }) => {
  return (
    <div className="flex border-b border-gray-300 dark:border-gray-700">
      {files.map((file) => (
        <div
          key={file}
          onClick={() => setActiveFile(file)}
          className={`px-4 py-2 cursor-pointer ${
            activeFile === file
              ? "border-b-2 border-blue-500 font-bold"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {file}
        </div>
      ))}
    </div>
  );
};

export default TabBar;
