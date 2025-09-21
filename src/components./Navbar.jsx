import React, { useState, useEffect } from "react";

const Navbar = ({ prompt, setPrompt, onGenerate, darkMode, toggleDarkMode, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState([]);

  // Example prompts for quick access
  const examplePrompts = [
    { text: "Amazon product page", icon: "🛒", category: "E-commerce" },
    { text: "Netflix homepage", icon: "🎬", category: "Streaming" },
    { text: "Analytics dashboard", icon: "📊", category: "Dashboard" },
    { text: "Facebook news feed", icon: "👥", category: "Social" },
    { text: "Twitter/X clone", icon: "💬", category: "Social" },
    { text: "Instagram profile", icon: "📸", category: "Social" },
    { text: "YouTube video page", icon: "📺", category: "Streaming" },
    { text: "Airbnb listing", icon: "🏠", category: "E-commerce" }
  ];

  // Group prompts by category
  const promptsByCategory = examplePrompts.reduce((acc, prompt) => {
    if (!acc[prompt.category]) acc[prompt.category] = [];
    acc[prompt.category].push(prompt);
    return acc;
  }, {});

  const handleExampleClick = (text) => {
    setPrompt(text);
    // Add to recent prompts (limit to 5)
    setRecentPrompts(prev => {
      const filtered = prev.filter(p => p !== text);
      return [text, ...filtered].slice(0, 5);
    });
    setIsExpanded(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-3 shadow-lg relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
          {/* Logo and title */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-white p-1.5 rounded-lg shadow-md flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="text-white">
              <h1 className="font-bold text-xl">AI WebBuilder</h1>
              <p className="text-xs opacity-80">Create website clones instantly</p>
            </div>
          </div>

          {/* Main input area */}
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="flex rounded-lg bg-white shadow-lg overflow-hidden">
                <div className="flex-1 flex">
                  <input
                    type="text"
                    placeholder="Describe the website you want to clone (e.g., 'Create a Netflix homepage clone')..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsExpanded(true)}
                    className="flex-1 p-4 focus:outline-none text-gray-800"
                  />
                </div>
                <div className="flex">
                  <button
                    onClick={onGenerate}
                    disabled={loading || !prompt.trim()}
                    className={`px-6 flex items-center justify-center transition-all ${
                      loading || !prompt.trim() 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">Generating</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden sm:inline">Generate</span>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center"
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Suggestions dropdown */}
              {isExpanded && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    {recentPrompts.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Prompts</h3>
                        <div className="flex flex-wrap gap-2">
                          {recentPrompts.map((prompt, index) => (
                            <button
                              key={index}
                              onClick={() => handleExampleClick(prompt)}
                              className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
                            >
                              <span className="mr-2">↩</span>
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Example Prompts</h3>
                    
                    {Object.entries(promptsByCategory).map(([category, prompts]) => (
                      <div key={category} className="mb-4 last:mb-0">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <span className="mr-2">{prompts[0].icon}</span>
                          {category}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {prompts.map((prompt, index) => (
                            <button
                              key={index}
                              onClick={() => handleExampleClick(prompt.text)}
                              className="text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                            >
                              <div className="font-medium text-gray-900">{prompt.text}</div>
                              <div className="text-xs text-gray-500 mt-1">Click to use this prompt</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default Navbar;