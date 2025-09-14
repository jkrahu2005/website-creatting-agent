import React, { useState, useEffect, useRef } from "react";

const PreviewPane = ({ html, css, js }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          ${css}
          /* Add some basic styles if none provided */
          body:empty::before {
            content: "No content to display. The website will appear here after generation.";
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #666;
            font-family: Arial, sans-serif;
          }
        </style>
      </head>
      <body>
        ${html}
        <script>
          // Error handling for the preview
          window.addEventListener('error', (e) => {
            console.error('Preview error:', e.error);
          });
          
          // Handle console logs from the iframe
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          
          console.log = function(...args) {
            originalLog.apply(console, args);
            window.parent.postMessage({ type: 'console', level: 'log', message: args.join(' ') }, '*');
          };
          
          console.error = function(...args) {
            originalError.apply(console, args);
            window.parent.postMessage({ type: 'console', level: 'error', message: args.join(' ') }, '*');
          };
          
          console.warn = function(...args) {
            originalWarn.apply(console, args);
            window.parent.postMessage({ type: 'console', level: 'warn', message: args.join(' ') }, '*');
          };
          
          ${js}
        </script>
      </body>
    </html>
  `;

  // Handle messages from the iframe (like console logs)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'console') {
        console[event.data.level](`[Preview] ${event.data.message}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle iframe load and error events
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Refresh the iframe
  const refreshPreview = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe to reload by temporarily changing the key
    iframeRef.current?.contentWindow?.location.reload();
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-white dark:bg-gray-900 shadow-inner ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}
    >
      {/* Preview Header with Controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Live Preview</h3>
          <div className="flex items-center space-x-1">
            {isLoading && (
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            )}
            {hasError && (
              <span className="text-xs text-red-500">Error</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Device Size Selector */}
          <select 
            className="text-xs p-1 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            onChange={(e) => {
              const iframe = iframeRef.current;
              if (iframe) {
                iframe.style.width = e.target.value;
              }
            }}
            defaultValue="100%"
          >
            <option value="100%">Responsive</option>
            <option value="320px">Mobile (320px)</option>
            <option value="768px">Tablet (768px)</option>
            <option value="1024px">Desktop (1024px)</option>
            <option value="1280px">Large Desktop (1280px)</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={refreshPreview}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            title="Refresh Preview"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8V4m0 0h4M3 4l4 4m8 0V4m0 0h-4m4 0l-4 4m-8 4v4m0 0h4m-4 0l4-4m8 4l-4-4m4 4v-4m0 4h-4" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Preview Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-80 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading preview...</p>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-80 z-10">
            <div className="text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-500 font-medium">Failed to load preview</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">There might be an error in your code</p>
              <button
                onClick={refreshPreview}
                className="mt-3 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          srcDoc={srcDoc}
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin"
          frameBorder="0"
          className="w-full h-full"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
      
      {/* Preview Footer with Info */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex justify-between items-center">
          <span>Previewing your website</span>
          <span>HTML: {html.length} chars | CSS: {css.length} chars | JS: {js.length} chars</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewPane;