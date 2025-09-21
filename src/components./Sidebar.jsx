import React, { useState } from "react";

const fileIcons = {
  "index.html": "📄",
  "style.css": "🎨", 
  "script.js": "⚡",
};

// Mock data for demonstration
const mockFileStats = {
  "index.html": { modified: true, lastModified: "2 minutes ago" },
  "style.css": { modified: false, lastModified: "5 minutes ago" },
  "script.js": { modified: true, lastModified: "1 minute ago" },
};

const Sidebar = ({ files, activeFile, setActiveFile, darkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showFileActions, setShowFileActions] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleFileAction = (action, fileName = null) => {
    console.log(`${action} action triggered`, fileName ? `for ${fileName}` : '');
    setShowFileActions(false);
    // Here you would implement actual file operations
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gray-100 dark:bg-gray-800 p-3 flex flex-col items-center border-r border-gray-300 dark:border-gray-700">
        <button
          onClick={toggleSidebar}
          className="p-2 mb-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow"
          title="Expand sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div className="flex-1 flex flex-col items-center space-y-3">
          {files.map((file) => (
            <button
              key={file}
              onClick={() => setActiveFile(file)}
              className={`p-2 rounded-lg flex items-center justify-center ${
                activeFile === file
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-inner"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title={file}
            >
              <span className="text-lg">{fileIcons[file] || "📁"}</span>
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setShowFileActions(true)}
          className="p-2 mt-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow"
          title="File actions"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col border-r border-gray-300 dark:border-gray-700 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Project Files
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFileActions(true)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="File actions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Collapse sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* File Actions Menu */}
      {showFileActions && (
        <div className="absolute left-4 top-16 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10 p-2 w-56 border border-gray-200 dark:border-gray-600">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">File Actions</div>
          <button
            onClick={() => handleFileAction('new')}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            New File
          </button>
          <button
            onClick={() => handleFileAction('rename', activeFile)}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Rename File
          </button>
          <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
          <button
            onClick={() => setShowFileActions(false)}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
          >
            Cancel
          </button>
        </div>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {files.map((file) => (
            <li
              key={file}
              onClick={() => setActiveFile(file)}
              className={`p-3 rounded-lg cursor-pointer flex items-center justify-between group ${
                activeFile === file
                  ? "bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent"
              } transition-all duration-200`}
            >
              <div className="flex items-center min-w-0">
                <span className="text-lg mr-3">{fileIcons[file] || "📁"}</span>
                <span className={`font-medium truncate ${activeFile === file ? "text-blue-600 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
                  {file}
                </span>
                {mockFileStats[file]?.modified && (
                  <span className="ml-2 text-xs text-orange-500" title="Modified">
                    •
                  </span>
                )}
              </div>
              
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate ml-2">
                  {mockFileStats[file]?.lastModified}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-gray-300 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Total files: {files.length}</span>
            <span>{files.filter(f => mockFileStats[f]?.modified).length} modified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;