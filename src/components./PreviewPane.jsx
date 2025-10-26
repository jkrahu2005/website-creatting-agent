import React, { useState, useEffect, useRef } from "react";

const PreviewPane = ({ html, css, js }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  // Function to clean HTML and remove external file references
  const processHtml = (html) => {
    let processedHtml = html;
    
    // Remove external script references
    processedHtml = processedHtml.replace(
      /<script\s+[^>]*src=["']script\.js["'][^>]*><\/script>/gi,
      ''
    );
    
    // Remove external CSS references
    processedHtml = processedHtml.replace(
      /<link\s+[^>]*href=["']style\.css["'][^>]*>/gi,
      ''
    );
    
    // Ensure proper HTML structure
    if (!processedHtml.includes('<!DOCTYPE html>')) {
      processedHtml = `<!DOCTYPE html>\n${processedHtml}`;
    }
    
    return processedHtml;
  };

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Injected CSS -->
        <style>
          ${css}
          
          /* Fallback styles for empty content */
          body:empty::before {
            content: "No content to display. The website will appear here after generation.";
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #666;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 2rem;
          }
          
          /* Basic reset for better consistency */
          * {
            box-sizing: border-box;
          }
          
          /* Image error handling */
          img {
            max-width: 100%;
          }
          
          img[src=""], img:not([src]) {
            display: none;
          }
        </style>
        
        <!-- External CDN Resources -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        ${processHtml(html)}
        
        <!-- Injected JavaScript -->
        <script>
          // Enhanced error handling
          window.addEventListener('error', (e) => {
            console.error('Preview runtime error:', e.error);
            window.parent.postMessage({ 
              type: 'console', 
              level: 'error', 
              message: 'Runtime Error: ' + e.error.message 
            }, '*');
          });
          
          // Handle unhandled promise rejections
          window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            window.parent.postMessage({ 
              type: 'console', 
              level: 'error', 
              message: 'Unhandled Promise: ' + e.reason 
            }, '*');
          });
          
          // Console interception
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          const originalInfo = console.info;
          
          console.log = function(...args) {
            originalLog.apply(console, args);
            window.parent.postMessage({ 
              type: 'console', 
              level: 'log', 
              message: args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ') 
            }, '*');
          };
          
          console.error = function(...args) {
            originalError.apply(console, args);
            window.parent.postMessage({ 
              type: 'console', 
              level: 'error', 
              message: args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ') 
            }, '*');
          };
          
          console.warn = function(...args) {
            originalWarn.apply(console, args);
            window.parent.postMessage({ 
              type: 'console', 
              level: 'warn', 
              message: args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ') 
            }, '*');
          };
          
          console.info = function(...args) {
            originalInfo.apply(console, args);
            window.parent.postMessage({ 
              type: 'console', 
              level: 'info', 
              message: args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ') 
            }, '*');
          };
          
          // Image error handling
          document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
              // Handle broken images
              img.addEventListener('error', function() {
                console.warn('Image failed to load:', this.src);
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                this.alt = 'Image not found';
              });
              
              // Handle empty src
              if (!img.src || img.src === '') {
                img.style.display = 'none';
              }
            });
            
            // Prevent default behavior on all links to avoid navigation
            const links = document.querySelectorAll('a');
            links.forEach(link => {
              link.addEventListener('click', function(e) {
                if (this.href && this.href !== '#') {
                  e.preventDefault();
                  console.log('Link clicked:', this.href, '(navigation disabled in preview)');
                }
              });
            });
          });
          
          // Execute the user's JavaScript code
          try {
            ${js}
          } catch (error) {
            console.error('JavaScript execution error:', error.message, 'at line', error.lineNumber);
          }
          
          // Notify parent that the iframe is ready
          window.addEventListener('load', () => {
            console.log('Preview loaded successfully');
          });
        </script>
      </body>
    </html>
  `;

  // Handle messages from the iframe (like console logs)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'console') {
        const { level, message } = event.data;
        if (console[level]) {
          console[level](`[Preview] ${message}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle iframe load and error events
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log('Preview iframe loaded successfully');
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error('Preview iframe failed to load');
  };

  // Reset loading state when content changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [html, css, js]);

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
    // The iframe will automatically reload when srcDoc changes
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-white dark:bg-gray-900 shadow-inner ${
        isFullscreen ? 'fixed inset-0 z-50' : 'h-full'
      }`}
    >
      {/* Preview Header with Controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Live Preview</h3>
          <div className="flex items-center space-x-1">
            {isLoading && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Loading</span>
              </div>
            )}
            {hasError && (
              <span className="text-xs text-red-500 flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Error</span>
              </span>
            )}
            {!isLoading && !hasError && (
              <span className="text-xs text-green-500 flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ready</span>
              </span>
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
                iframe.style.margin = '0 auto';
                iframe.style.display = 'block';
                
                // Add border for non-responsive sizes
                if (e.target.value !== '100%') {
                  iframe.style.border = '1px solid #e5e7eb';
                  iframe.style.borderRadius = '8px';
                  iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                } else {
                  iframe.style.border = 'none';
                  iframe.style.borderRadius = '0';
                  iframe.style.boxShadow = 'none';
                }
              }
            }}
            defaultValue="100%"
          >
            <option value="100%">Responsive</option>
            <option value="375px">Mobile (375px)</option>
            <option value="768px">Tablet (768px)</option>
            <option value="1024px">Desktop (1024px)</option>
            <option value="1280px">Large Desktop (1280px)</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={refreshPreview}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Refresh Preview"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
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
      <div className="flex-1 relative bg-gray-100 dark:bg-gray-800">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Building preview...</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Processing HTML, CSS, and JavaScript</p>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 z-10">
            <div className="text-center p-6 max-w-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-500 font-medium mb-2">Failed to load preview</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                There might be an error in your code or the preview environment.
              </p>
              <button
                onClick={refreshPreview}
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
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
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          className="w-full h-full bg-white"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
      
      {/* Preview Footer with Info */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Previewing generated website</span>
          <div className="flex space-x-3">
            <span title="HTML size">HTML: {(html.length / 1024).toFixed(1)}KB</span>
            <span title="CSS size">CSS: {(css.length / 1024).toFixed(1)}KB</span>
            <span title="JavaScript size">JS: {(js.length / 1024).toFixed(1)}KB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPane;