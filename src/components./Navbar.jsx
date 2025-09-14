import React from "react";

const Navbar = ({ prompt, setPrompt, onGenerate, darkMode, toggleDarkMode }) => {
  return (
    <div className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 p-4 flex items-center justify-between">
      <div className="text-white font-bold text-xl">⚡ AI WebBuilder</div>
      <div className="flex flex-1 mx-4">
        <input
          type="text"
          placeholder="Enter your website prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 p-2 rounded-l-lg focus:outline-none"
        />
        <button
          onClick={onGenerate}
          className="btn btn-primary rounded-r-lg"
        >
          Generate
        </button>
        <button
          onClick={toggleDarkMode}
          className="ml-2 btn btn-ghost"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
