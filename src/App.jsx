import React, { useState, useEffect } from "react";
import Navbar from "./components./Navbar";
import Sidebar from "./components./Sidebar";
import TabBar from "./components./TabBar";
import CodeEditor from "./components./CodeEditor";
import PreviewPane from "./components./PreviewPane";
import { GoogleGenAI } from "@google/genai";

// Initialize AI safely
let ai = null;

// System instruction for dynamic website generation with images
const systemInstruction = `
You are an expert front-end developer specializing in dynamic, modern websites.
Generate a complete, working website where:
1. index.html contains ONLY a root div with id="root" and script tags
2. All content is dynamically created using JavaScript in script.js
3. style.css contains all styling
4. Include relevant images from placeholder services like Picsum, Unsplash, etc.

Return ONLY valid JSON in this exact format:
{
  "files": {
    "index.html": "<!DOCTYPE html>...<div id=\\"root\\"></div>...",
    "style.css": "CSS content with escaped newlines as \\\\n and escaped quotes as \\"",
    "script.js": "JavaScript that dynamically creates all content inside div#root"
  }
}

CRITICAL RULES:
1. HTML must be minimal: only doctype, html, head, body with div#root, and script tags
2. All visible content must be created dynamically by JavaScript
3. Use placeholder images from services like:
   - https://picsum.photos/ (random: https://picsum.photos/400/300)
   - https://via.placeholder.com/ (specific: https://via.placeholder.com/400x300)
   - https://source.unsplash.com/ (themed: https://source.unsplash.com/400x300/?nature)
4. Make websites interactive with JavaScript event handlers
5. Escape all double quotes inside strings with \\"
6. Replace all actual newlines with \\\\n
7. No markdown, backticks, or extra text outside the JSON
8. Use only plain HTML, CSS, and JavaScript (no frameworks)
9. Ensure the code is complete, functional, and responsive
10. Create modern, visually appealing designs with gradients, shadows, and animations
`.trim();

// Safe JSON parse function
function safeJSONParse(str) {
  try {
    // First, try to parse directly
    return JSON.parse(str);
  } catch (firstError) {
    console.log("First parse attempt failed, trying cleanup");
    
    try {
      // Remove any markdown code blocks and trim
      let cleaned = str.replace(/```(json)?/g, "").trim();
      
      // If the response seems to be just the JSON content without wrapper
      if (cleaned.includes('"index.html"') && cleaned.includes('"style.css"') && cleaned.includes('"script.js"')) {
        // Try to wrap it in a files object if needed
        if (!cleaned.startsWith('{')) {
          cleaned = `{"files":${cleaned}}`;
        }
        return JSON.parse(cleaned);
      }
      
      // Try to extract JSON from the response
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("No JSON found in response");
    } catch (secondError) {
      console.error("All parsing attempts failed:", secondError, "Original response:", str);
      
      // Last resort: create a basic error response
      return {
        files: {
          "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI WebBuilder</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="root"></div>
    <script src="script.js"></script>
</body>
</html>`,
          "style.css": "body { font-family: Arial, sans-serif; padding: 20px; } h1 { color: #d32f2f; }",
          "script.js": `console.error('Website generation failed');
const root = document.getElementById('root');
root.innerHTML = '<h1>Error Generating Website</h1><p>There was an issue generating your website. Please try again with a different prompt.</p>';`
        }
      };
    }
  }
}

// Generate website code from AI
async function generateWebsiteCode(prompt) {
  if (!ai) {
    console.error("AI not initialized");
    throw new Error("AI service not available. Check your API key.");
  }

  try {
    // Try different model names that might work
    const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "models/gemini-pro"];
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}`);
        const response = await ai.models.generateContent({
          model: model,
          contents: [{ 
            role: "user", 
            parts: [{ 
              text: `Create a dynamic, modern website for: ${prompt}. 
              HTML should only have a root div, all content must be created by JavaScript. 
              Include relevant images from placeholder services. 
              Make it interactive and visually appealing. 
              Return only valid JSON.` 
            }] 
          }],
          config: { 
            systemInstruction,
            temperature: 0.8, // Slightly higher temperature for more creativity
            maxOutputTokens: 4096,
          },
        });

        if (response.text) {
          console.log("Raw AI response:", response.text);
          const parsed = safeJSONParse(response.text);
          
          if (parsed && parsed.files) {
            // Clean up the code - replace escaped newlines with actual newlines
            const cleanedFiles = {};
            Object.keys(parsed.files).forEach(key => {
              cleanedFiles[key] = parsed.files[key]
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
            });
            return cleanedFiles;
          }
        }
      } catch (modelError) {
        console.log(`Model ${model} failed:`, modelError.message);
        // Continue to next model
      }
    }
    
    // If all models failed, try the default approach
    console.log("All specific models failed, trying default approach");
    const response = await ai.models.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ 
          text: `Create a dynamic website for: ${prompt}. HTML should only have a root div, all content must be created by JavaScript. Include relevant images. Return only valid JSON.` 
        }] 
      }],
      config: { 
        systemInstruction,
        temperature: 0.8,
        maxOutputTokens: 4096,
      },
    });

    if (response.text) {
      console.log("Raw AI response:", response.text);
      const parsed = safeJSONParse(response.text);
      
      if (parsed && parsed.files) {
        // Clean up the code - replace escaped newlines with actual newlines
        const cleanedFiles = {};
        Object.keys(parsed.files).forEach(key => {
          cleanedFiles[key] = parsed.files[key]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        });
        return cleanedFiles;
      }
    }
    
    throw new Error("No valid response from AI");
  } catch (err) {
    console.error("AI generation error:", err);
    if (err.message && err.message.includes("overload")) {
      throw new Error("The AI model is currently overloaded. Please try again in a few moments.");
    }
    if (err.message && err.message.includes("503")) {
      throw new Error("AI service is temporarily unavailable. Please try again later.");
    }
    if (err.message && err.message.includes("quota")) {
      throw new Error("API quota exceeded. Please check your Google AI Studio quota.");
    }
    if (err.message && err.message.includes("404")) {
      throw new Error("Model not found. Please check your Google AI Studio setup and available models.");
    }
    throw new Error("Failed to generate website. Please try a different prompt.");
  }
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const files = ["index.html", "style.css", "script.js"];
  const [activeFile, setActiveFile] = useState("index.html");

  const [code, setCode] = useState({
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI WebBuilder</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="root"></div>
    <script src="script.js"></script>
</body>
</html>`,
    "style.css": `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
    min-height: 100vh;
}

#root {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}`,
    "script.js": `console.log("AI WebBuilder loaded successfully!");

// Dynamic content creation
document.addEventListener('DOMContentLoaded', function() {
    const root = document.getElementById('root');
    
    // Create header
    const header = document.createElement('header');
    header.innerHTML = \`
        <h1>Welcome to AI WebBuilder!</h1>
        <p>Create dynamic websites with images and interactivity</p>
    \`;
    header.style.cssText = \`
        text-align: center;
        color: white;
        padding: 2rem;
        margin-bottom: 2rem;
    \`;
    
    // Create main content
    const main = document.createElement('main');
    main.innerHTML = \`
        <div class="features">
            <div class="feature">
                <img src="https://picsum.photos/300/200?random=1" alt="Dynamic Generation">
                <h2>🚀 Dynamic Generation</h2>
                <p>All content created dynamically with JavaScript</p>
                <button class="feature-btn">Learn More</button>
            </div>
            <div class="feature">
                <img src="https://picsum.photos/300/200?random=2" alt="Modern Design">
                <h2>🎨 Modern Design</h2>
                <p>Beautiful, responsive websites automatically</p>
                <button class="feature-btn">Learn More</button>
            </div>
            <div class="feature">
                <img src="https://picsum.photos/300/200?random=3" alt="Fast Development">
                <h2>⚡ Fast Development</h2>
                <p>Generate complete websites in seconds</p>
                <button class="feature-btn">Learn More</button>
            </div>
        </div>
        <div class="cta">
            <h2>Ready to Create Your Website?</h2>
            <p>Enter a prompt above to generate your website!</p>
            <button id="generateBtn">Generate Website</button>
        </div>
    \`;
    main.style.cssText = \`
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    \`;
    
    // Add styles for features
    const style = document.createElement('style');
    style.textContent = \`
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        .feature {
            text-align: center;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 10px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .feature:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.2);
        }
        .feature img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        .feature h2 {
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        .feature p {
            color: #666;
            margin-bottom: 1rem;
        }
        .feature-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .feature-btn:hover {
            background: #5a67d8;
        }
        .cta {
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            border-radius: 10px;
        }
        .cta h2 {
            margin-bottom: 1rem;
        }
        #generateBtn {
            background: white;
            color: #28a745;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 25px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 1rem;
        }
        #generateBtn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        @media (max-width: 768px) {
            .features {
                grid-template-columns: 1fr;
            }
        }
    \`;
    
    // Append everything to root
    root.appendChild(header);
    root.appendChild(main);
    document.head.appendChild(style);
    
    // Add interactivity
    const featureButtons = document.querySelectorAll('.feature-btn');
    featureButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Feature button clicked! This could open a modal or navigate to a section.');
        });
    });
    
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.addEventListener('click', () => {
        alert('Ready to generate your website! Enter a prompt in the input field above.');
    });
    
    console.log("Dynamic content with images created successfully!");
});`
  });

  // Resizable panel state
  const [editorWidth, setEditorWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize AI
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
    if (!key) {
      console.error("Google GenAI API key missing! Check .env file.");
      setError("API key missing. Please check your .env file and add VITE_GOOGLE_GENAI_API_KEY=your_api_key_here");
      return;
    }
    try {
      ai = new GoogleGenAI({ apiKey: key });
      console.log("AI initialized successfully");
    } catch (err) {
      console.error("Failed to initialize AI:", err);
      setError("Failed to initialize AI service. Check your API key.");
    }
  }, []);

  // Resizing logic
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth >= 20 && newWidth <= 80) setEditorWidth(newWidth);
  };
  
  const handleMouseUp = () => setIsDragging(false);
  
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt first. Example: 'create a portfolio website with image gallery'");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const generatedFiles = await generateWebsiteCode(prompt);
      if (generatedFiles) {
        setCode(generatedFiles);
      } else {
        setError("Failed to generate website. Try a different prompt.");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        {/* Navbar */}
        <Navbar
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          loading={loading}
        />

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 mt-2">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 right-0 p-3"
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            files={files}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
          />

          {/* Editor + Preview */}
          <div className="flex-1 flex relative">
            {/* Code Editor */}
            <div
              className="flex flex-col border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              style={{ width: `${editorWidth}%` }}
            >
              <TabBar
                files={files}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
              />
              {loading ? (
                <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Generating your dynamic website... ⏳</p>
                    <p className="text-sm mt-2">Creating interactive content with images</p>
                  </div>
                </div>
              ) : (
                <CodeEditor
                  code={code[activeFile]}
                  fileName={activeFile}
                  onChange={(newCode) =>
                    setCode((prev) => ({ ...prev, [activeFile]: newCode }))
                  }
                />
              )}
            </div>

            {/* Draggable Divider */}
            <div
              className="w-2 cursor-col-resize bg-gray-300 dark:bg-gray-600 hover:bg-blue-400 transition-colors"
              onMouseDown={() => setIsDragging(true)}
              style={{ cursor: isDragging ? 'col-resize' : 'default' }}
            ></div>

            {/* Preview Panel */}
            <div 
              className="flex-1 bg-white dark:bg-gray-800" 
              style={{ width: `${100 - editorWidth}%` }}
            >
              <PreviewPane
                html={code["index.html"]}
                css={code["style.css"]}
                js={code["script.js"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;