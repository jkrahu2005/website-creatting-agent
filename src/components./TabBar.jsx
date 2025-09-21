import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { FaJs, FaHtml5, FaCss3Alt, FaPython, FaFile } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Helper to get file type icon
const getFileIcon = (file) => {
  const ext = file.split(".").pop();
  switch (ext) {
    case "js":
      return <FaJs className="w-4 h-4 text-yellow-400 mr-2" />;
    case "html":
      return <FaHtml5 className="w-4 h-4 text-orange-500 mr-2" />;
    case "css":
      return <FaCss3Alt className="w-4 h-4 text-blue-500 mr-2" />;
    case "py":
      return <FaPython className="w-4 h-4 text-blue-300 mr-2" />;
    default:
      return <FaFile className="w-4 h-4 text-gray-400 mr-2" />;
  }
};

const TabBar = ({ files, activeFile, setActiveFile, closeFile, addFile }) => {
  return (
    <div className="flex overflow-x-auto border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center px-5 py-2 cursor-pointer relative rounded-t-md min-w-max mr-1 transition-all duration-200 ${
              activeFile === file
                ? "bg-indigo-600 text-white font-bold shadow-md"
                : "text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-700"
            }`}
          >
            {getFileIcon(file)}
            <span onClick={() => setActiveFile(file)} className="mr-2">
              {file}
            </span>
            <XMarkIcon
              className="w-4 h-4 text-gray-300 hover:text-red-500"
              onClick={() => closeFile(file)}
            />
            {activeFile === file && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400 rounded-t-md"
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* New Tab Button */}
      <div
        onClick={addFile}
        className="flex items-center px-4 py-2 cursor-pointer text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-700 rounded-t-md font-bold min-w-max"
      >
        + New
      </div>
    </div>
  );
};

export default TabBar;
