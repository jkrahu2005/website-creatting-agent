import React, { useState, useEffect } from "react";
import Navbar from "./components./Navbar";
import Sidebar from "./components./Sidebar";
import TabBar from "./components./TabBar";
import CodeEditor from "./components./CodeEditor";
import PreviewPane from "./components./PreviewPane";
import { GoogleGenAI } from "@google/genai";

// Initialize AI safely
let ai = null;

// System instruction for frontend website generation with enhanced cloning capability
const systemInstruction = `
You are an expert front-end developer specializing in cloning popular web platforms.
Generate a complete, working frontend website with proper HTML structure that works within a React preview environment.

IMPORTANT: You MUST return ONLY valid JSON in this exact format:
{
  "files": {
    "index.html": "VALID HTML CODE with proper structure",
    "style.css": "CSS content",
    "script.js": "JavaScript code"
  }
}

CRITICAL RULES:
1. HTML MUST be properly structured with: <!DOCTYPE html>, <html>, <head>, and <body> tags
2. HTML must include: <meta charset="UTF-8"> and <meta name="viewport"> in head
3. All content must be placed inside the <body> tags
4. Use semantic HTML5 elements: <header>, <nav>, <main>, <section>, <article>, <footer>
5. Include proper CSS linking: <link rel="stylesheet" href="style.css">
6. Include proper JS linking: <script src="script.js"></script> at the end of body
7. Escape all double quotes inside strings with \\"
8. Replace all actual newlines with \\\\n
9. No markdown, backticks, or extra text outside the JSON
10. Use only plain HTML, CSS, and JavaScript (no frameworks)
11. Ensure the code is complete, functional, and responsive
12. Create modern, visually appealing designs that mimic real-world websites

SPECIAL INSTRUCTIONS FOR NAVIGATION:
- NEVER use <a href="#"> or <a href=""> for navigation links
- Use buttons or span elements for navigation instead of anchor tags
- Implement navigation using JavaScript event listeners
- Prevent default behavior on all click events
- Use data attributes for navigation targets: data-page="home"
- Example: <button class="nav-link" data-page="home">Home</button>

SPECIAL INSTRUCTIONS FOR PREVIEW ENVIRONMENT:
- All navigation must work without reloading the page
- Avoid using target="_blank" in links
- Use event.preventDefault() on all interactive elements
- Ensure all functionality works within an iframe environment

WEBSITE TYPES TO SUPPORT (FOCUS ON POPULAR WEBSITE CLONES):

E-COMMERCE (Amazon, Flipkart, eBay):
- Product grid layout with cards
- Each product card should contain: image, title, price, rating, "Add to Cart" button
- Header with search bar, cart icon, user account dropdown
- Category navigation menu
- Hero banner or carousel
- Footer with multiple columns of links

STREAMING (Netflix, YouTube, Disney+):
- Hero banner with featured content
- Horizontal scrolling content rows
- Content cards with hover effects showing more info
- Minimal navigation with logo and user profile
- Footer with links and copyright

SOCIAL MEDIA (Facebook, Instagram, Twitter):
- Feed layout with posts
- Post cards containing: user avatar, content, engagement buttons
- Sidebar with trending topics or friend suggestions
- Top navigation with icons for notifications, messages, etc.

DASHBOARDS (Analytics, Admin Panels, Stock Trackers):
- Grid layout with cards/widgets
- Data visualizations (charts, graphs, metrics)
- Clean, minimal design with clear typography
- Sidebar navigation with icons
- Header with user profile and notifications

NEWS/MEDIA (BBC, CNN, Medium):
- Article grid or list layout
- Featured article with large image
- Category navigation
- Newsletter signup form
- Footer with extensive links

For images, use these placeholder services:
- Product images: https://picsum.photos/200/300?random=1 (change number for different images)
- Profile avatars: https://i.pravatar.cc/150?img=1 (change number for different avatars)
- Content images: https://source.unsplash.com/400x300/?movie (change keyword)

For icons, use:
- Font Awesome CDN: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

For fonts, use Google Fonts:
- <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
- <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
- <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

ESSENTIAL FEATURES TO INCLUDE WHEN APPROPRIATE:
- Responsive navigation with hamburger menu for mobile
- CSS animations and transitions for interactive elements
- Modal windows for product details or login
- Carousels and image sliders for featured content
- Tabbed interfaces for category browsing
- Hover effects on cards and buttons
- Loading states for dynamic content

SPECIFIC PATTERNS FOR DIFFERENT WEBSITE TYPES:

E-COMMERCE PATTERN (Follow this exact structure):
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>E-Commerce Store</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50 text-gray-800">

  <!-- Header -->
  <header id="site-header" class="bg-white sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo + Categories -->
        <div class="flex items-center gap-4">
          <a href="#" class="flex items-center gap-2">
            <img src="https://picsum.photos/40/40?random=99" alt="logo" class="rounded" />
            <span class="font-bold text-lg">ShopMock</span>
          </a>

          <nav class="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <a href="#" class="hover:text-gray-900">Electronics</a>
            <a href="#" class="hover:text-gray-900">Fashion</a>
            <a href="#" class="hover:text-gray-900">Home</a>
            <a href="#" class="hover:text-gray-900">Grocery</a>
          </nav>
        </div>

        <!-- Search bar -->
        <div class="flex-1 mx-4">
          <div class="relative">
            <input id="searchInput" type="search" placeholder="Search for products, brands and more" class="w-full border rounded-md py-2 px-4 pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <button id="searchBtn" class="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded">Search</button>

            <ul id="suggestions" class="absolute left-0 right-0 bg-white border mt-1 rounded-md shadow-md hidden max-h-56 overflow-auto"></ul>
          </div>
        </div>

        <!-- User actions -->
        <div class="flex items-center gap-4">
          <button id="loginBtn" class="hidden sm:inline-block text-sm px-3 py-1 rounded hover:bg-gray-100">Login</button>
          <button id="wishlistBtn" class="text-sm px-3 py-1 rounded hover:bg-gray-100">Wishlist</button>

          <button id="cartBtn" class="relative bg-white border rounded px-3 py-1 hover:bg-gray-50">
            Cart
            <span id="cartCount" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>

      </div>
    </div>
  </header>

  <!-- Main -->
  <main class="max-w-7xl mx-auto p-4 md:p-6">

    <!-- Hero -->
    <section class="hero-banner bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-lg p-6 mb-6">
      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="flex-1">
          <h1 class="text-3xl md:text-4xl font-bold">Big deals, everyday low prices</h1>
          <p class="mt-2 opacity-90">Discover top brands, instant discounts and fast delivery. Free returns within 7 days.</p>
          <div class="mt-4 flex gap-3">
            <a href="#featured" class="bg-white text-indigo-600 font-semibold px-4 py-2 rounded shadow">Shop Featured</a>
            <a href="#categories" class="border border-white px-4 py-2 rounded text-white">Browse Categories</a>
          </div>
        </div>
        <div class="w-64 hidden md:block">
          <img src="https://picsum.photos/320/220?random=20" alt="hero" class="rounded shadow-lg" />
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section id="categories" class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Top Categories</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        <div class="bg-white p-3 rounded text-center shadow-sm">Mobiles</div>
        <div class="bg-white p-3 rounded text-center shadow-sm">Fashion</div>
        <div class="bg-white p-3 rounded text-center shadow-sm">Home</div>
        <div class="bg-white p-3 rounded text-center shadow-sm">Appliances</div>
        <div class="bg-white p-3 rounded text-center shadow-sm">Beauty</div>
        <div class="bg-white p-3 rounded text-center shadow-sm">Grocery</div>
      </div>
    </section>

    <!-- Featured Products -->
    <section id="featured" class="featured-products mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold">Featured Products</h2>
        <div class="text-sm text-gray-600">Showing <span id="productsCount"></span> results</div>
      </div>

      <div class="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="productGrid">
        <!-- Product cards will be populated by JavaScript -->
      </div>
    </section>

    <!-- Simple footer CTA -->
    <section class="bg-white rounded p-6 text-center shadow-sm">
      <h3 class="font-semibold text-lg">Want daily deals in your inbox?</h3>
      <p class="text-sm text-gray-600 mt-2">Sign up for our newsletter and never miss a discount.</p>
      <div class="mt-4 flex justify-center gap-2">
        <input id="newsletterEmail" type="email" placeholder="you@example.com" class="border rounded-l px-3 py-2 w-64" />
        <button id="subscribeBtn" class="bg-indigo-600 text-white px-4 rounded-r">Subscribe</button>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="mt-8 border-t bg-white">
    <div class="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h4 class="font-semibold">ShopMock</h4>
        <p class="text-sm text-gray-600 mt-2">A demo e-commerce frontend pattern inspired by big marketplaces.</p>
      </div>
      <div>
        <h4 class="font-semibold">Help</h4>
        <ul class="text-sm text-gray-600 mt-2 space-y-1">
          <li>Customer Care</li>
          <li>Shipping</li>
          <li>Returns</li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold">Follow</h4>
        <div class="flex gap-2 mt-2">
          <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">F</div>
          <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">T</div>
          <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">I</div>
        </div>
      </div>
    </div>
    <div class="text-center py-4 text-sm text-gray-500">© 2025 ShopMock. All rights reserved.</div>
  </footer>

  <!-- Cart Drawer (hidden by default) -->
  <div id="cartDrawer" class="fixed right-4 bottom-4 bg-white border rounded shadow-lg w-80 p-4 hidden">
    <h3 class="font-semibold mb-2">Cart</h3>
    <div id="cartItems" class="space-y-2 max-h-56 overflow-auto"></div>
    <div class="mt-3 flex justify-between items-center">
      <div class="font-semibold">Total: <span id="cartTotal">$0.00</span></div>
      <button id="checkoutBtn" class="bg-indigo-600 text-white px-3 py-1 rounded">Checkout</button>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>

STREAMING SERVICE PATTERN:
<header>...</header>
<main>
  <section class="featured-content">...</section>
  <section class="content-row">
    <h2>Popular Movies</h2>
    <div class="row-scroll">
      <div class="content-card">
        <img src="https://source.unsplash.com/200x300/?movie" alt="Movie">
        <div class="card-hover-info">
          <h3>Movie Title</h3>
          <p>Description goes here...</p>
          <button>Play</button>
        </div>
      </div>
      <!-- More content cards -->
    </div>
  </section>
  <!-- More content rows -->
</main>
<footer>...</footer>

DASHBOARD PATTERN:
<div class="dashboard-container">
  <aside class="sidebar">...</aside>
  <main class="dashboard-content">
    <header class="dashboard-header">...</header>
    <div class="metrics-grid">
      <div class="metric-card">
        <h3>Total Revenue</h3>
        <div class="metric-value">$24,582</div>
        <div class="metric-chart">Simple bar chart using CSS</div>
      </div>
      <!-- More metric cards -->
    </div>
    <div class="data-section">
      <h2>Performance Analysis</h2>
      <div class="chart-container">
        <!-- Chart would go here -->
        <div class="placeholder-chart">Chart visualization</div>
      </div>
    </div>
  </main>
</div>

Example of proper JavaScript for navigation:
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Show initial page
    showPage('home');
});

function showPage(page) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none');
    
    // Show selected page
    const currentPage = document.getElementById(page + '-page');
    if (currentPage) {
        currentPage.style.display = 'block';
    }
}

When creating clones, focus on:
1. Replicating the core layout and visual design
2. Implementing key functionality with JavaScript
3. Maintaining responsive design principles
4. Using appropriate color schemes and typography
5. Creating intuitive user interactions
6. Ensuring accessibility standards
`.trim();

// Function to fix malformed HTML structure
function fixHTMLStructure(html) {
  let fixedHtml = html;
  
  // Ensure DOCTYPE is present
  if (!fixedHtml.includes('<!DOCTYPE html>')) {
    fixedHtml = '<!DOCTYPE html>\n' + fixedHtml;
  }
  
  // Ensure html tags are present
  if (!fixedHtml.includes('<html')) {
    fixedHtml = fixedHtml.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<html lang="en">');
  }
  if (!fixedHtml.includes('</html>')) {
    fixedHtml += '\n</html>';
  }
  
  // Ensure head and body are present
  if (!fixedHtml.includes('<head>')) {
    const headContent = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link rel="stylesheet" href="style.css">
</head>`;
    
    if (fixedHtml.includes('<html')) {
      fixedHtml = fixedHtml.replace('<html', '<html lang="en">\n' + headContent + '\n<body>');
    } else {
      fixedHtml = fixedHtml.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<html lang="en">\n' + headContent + '\n<body>');
    }
  }
  
  if (!fixedHtml.includes('</body>')) {
    fixedHtml += '\n</body>';
  }
  
  // Ensure script tag is present
  if (!fixedHtml.includes('<script src="script.js"')) {
    if (fixedHtml.includes('</body>')) {
      fixedHtml = fixedHtml.replace('</body>', '    <script src="script.js"></script>\n</body>');
    } else {
      fixedHtml += '\n    <script src="script.js"></script>';
    }
  }
  
  return fixedHtml;
}

// Safe JSON parse function with HTML validation
function safeJSONParse(str) {
  try {
    // First, try to parse directly
    const parsed = JSON.parse(str);
    
    // Validate the HTML structure
    if (parsed.files && parsed.files["index.html"]) {
      const html = parsed.files["index.html"];
      
      // Basic HTML validation
      if (!html.includes('<!DOCTYPE html>') || !html.includes('<html') || !html.includes('</html>')) {
        console.warn("HTML structure is incomplete, fixing it");
        parsed.files["index.html"] = fixHTMLStructure(html);
      }
    }
    
    return parsed;
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
        const parsed = JSON.parse(cleaned);
        
        // Fix HTML structure if needed
        if (parsed.files && parsed.files["index.html"]) {
          parsed.files["index.html"] = fixHTMLStructure(parsed.files["index.html"]);
        }
        
        return parsed;
      }
      
      // Try to extract JSON from the response
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Fix HTML structure if needed
        if (parsed.files && parsed.files["index.html"]) {
          parsed.files["index.html"] = fixHTMLStructure(parsed.files["index.html"]);
        }
        
        return parsed;
      }
      
      throw new Error("No JSON found in response");
    } catch (secondError) {
      console.error("All parsing attempts failed:", secondError, "Original response:", str);
      
      // Last resort: create a basic error response with proper HTML structure
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
    <div class="container">
        <h1>Website Generation Issue</h1>
        <p>There was a problem generating your website. Please try a different prompt.</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
          "style.css": `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
    color: #333;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    text-align: center;
}

h1 {
    color: #d32f2f;
    margin-bottom: 20px;
}`,
          "script.js": `console.log("Website loaded");
// Basic functionality can be added here`
        }
      };
    }
  }
}

// Generate website code from AI with enhanced cloning capability
async function generateWebsiteCode(prompt) {
  if (!ai) {
    console.error("AI not initialized");
    throw new Error("AI service not available. Check your API key.");
  }

  try {
    // Updated list of reliable models for website generation
    const modelsToTry = [
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro-latest", 
      "gemini-2.0-flash-exp",
      "models/gemini-1.5-flash",
      "gemini-pro"
    ];
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}`);
        const response = await ai.models.generateContent({
          model: model,
          contents: [{ 
            role: "user", 
            parts: [{ 
              text: `Create a complete frontend website for: ${prompt}. 
              Use proper HTML5 structure with semantic elements.
              Make it responsive and modern-looking.
              Include CSS styling and JavaScript functionality.
              Focus on creating a functional, visually appealing website.
              Use button elements for navigation instead of anchor tags.
              Return only valid JSON with index.html, style.css, and script.js.
              Format: {"files": {"index.html": "...", "style.css": "...", "script.js": "..."}}` 
            }] 
          }],
          config: { 
            temperature: 0.3, // Lower temperature for more consistent output
            maxOutputTokens: 8000, // Increased tokens for better website code
            topP: 0.8,
            topK: 40
          },
        });

        if (response && response.text) {
          console.log("Raw AI response received");
          let responseText = response.text;
          
          // Clean the response text first
          responseText = responseText.trim();
          
          // Remove markdown code blocks if present
          responseText = responseText.replace(/```json\s*|\s*```/g, '');
          
          // Try to parse the response
          let parsed = safeJSONParse(responseText);
          
          // If parsing fails, try to extract JSON from the response
          if (!parsed) {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              parsed = safeJSONParse(jsonMatch[0]);
            }
          }
          
          if (parsed && parsed.files) {
            console.log(`Successfully generated website with model: ${model}`);
            // Clean up the code - replace escaped newlines with actual newlines
            const cleanedFiles = {};
            Object.keys(parsed.files).forEach(key => {
              if (parsed.files[key]) {
                cleanedFiles[key] = parsed.files[key]
                  .replace(/\\n/g, '\n')
                  .replace(/\\"/g, '"')
                  .replace(/\\\\/g, '\\')
                  .replace(/\\t/g, '  ')
                  .trim();
              }
            });
            return cleanedFiles;
          } else {
            console.log(`Model ${model} returned invalid JSON format, trying next model...`);
          }
        }
      } catch (modelError) {
        console.log(`Model ${model} failed:`, modelError.message);
        // Continue to next model
      }
    }
    
    // If all specific models failed, try with simplified prompt
    console.log("All specific models failed, trying simplified approach");
    const response = await ai.models.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ 
          text: `Create a simple website for: ${prompt}. Return JSON with HTML, CSS, and JS files in this exact format:
          {
            "files": {
              "index.html": "<!DOCTYPE html>...",
              "style.css": "body { ... }",
              "script.js": "// JavaScript code"
            }
          }` 
        }] 
      }],
      config: { 
        temperature: 0.1, // Very low temperature for consistent format
        maxOutputTokens: 4000,
      },
    });

    if (response && response.text) {
      console.log("Raw simplified response:", response.text);
      let responseText = response.text.trim();
      responseText = responseText.replace(/```json\s*|\s*```/g, '');
      
      const parsed = safeJSONParse(responseText);
      
      if (parsed && parsed.files) {
        const cleanedFiles = {};
        Object.keys(parsed.files).forEach(key => {
          cleanedFiles[key] = parsed.files[key]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .trim();
        });
        return cleanedFiles;
      }
    }
    
    // Final fallback - create a basic website template
    console.log("Creating fallback basic website");
    return {
      "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Welcome to ${prompt}</h1>
    </header>
    <main>
        <section>
            <h2>About</h2>
            <p>This is a website for ${prompt}.</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 ${prompt}</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>`,
      "style.css": `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
}

header {
    background: #35424a;
    color: white;
    padding: 1rem;
    text-align: center;
}

main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

section {
    background: white;
    padding: 2rem;
    margin: 1rem 0;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

footer {
    background: #35424a;
    color: white;
    text-align: center;
    padding: 1rem;
    position: fixed;
    bottom: 0;
    width: 100%;
}`,
      "script.js": `// JavaScript for ${prompt}
console.log('Website loaded successfully');

// Add basic interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('${prompt} website ready');
});`
    };
    
  } catch (err) {
    console.error("AI generation error:", err);
    
    // Provide more user-friendly error messages
    if (err.message && err.message.includes("overload")) {
      throw new Error("The AI service is busy. Please try again in a few moments.");
    }
    if (err.message && err.message.includes("503") || err.message.includes("500")) {
      throw new Error("AI service is temporarily unavailable. Please try again later.");
    }
    if (err.message && err.message.includes("quota")) {
      throw new Error("API quota exceeded. Please check your Google AI Studio quota.");
    }
    if (err.message && err.message.includes("404")) {
      throw new Error("Model not available. Please check your API configuration.");
    }
    if (err.message && err.message.includes("429")) {
      throw new Error("Too many requests. Please wait a moment before trying again.");
    }
    
    // Return a basic template instead of throwing error
    console.log("Returning fallback template due to error");
    return {
      "index.html": `<!DOCTYPE html>
<html>
<head>
    <title>${prompt}</title>
    <style>body{font-family:Arial;padding:20px;text-align:center;}</style>
</head>
<body>
    <h1>${prompt}</h1>
    <p>Website coming soon...</p>
</body>
</html>`,
      "style.css": "body { margin: 0; padding: 20px; font-family: Arial; }",
      "script.js": "console.log('Basic website loaded');"
    };
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
    <title>AI WebBuilder - Website Cloner</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <nav>
            <div class="nav-container">
                <h1 class="logo">AI WebBuilder</h1>
                <ul class="nav-menu">
                    <li><button class="nav-link" data-page="home">Home</button></li>
                    <li><button class="nav-link" data-page="examples">Examples</button></li>
                    <li><button class="nav-link" data-page="about">About</button></li>
                </ul>
            </div>
        </nav>
    </header>

    <main>
        <section id="home-page" class="page">
            <div class="hero">
                <div class="hero-content">
                    <h2>Clone Any Website Instantly</h2>
                    <p>Generate fully functional frontend clones of popular websites with just a description</p>
                    <div class="example-prompts">
                        <p>Try prompts like:</p>
                        <ul>
                            <li>"Create an Amazon product page clone"</li>
                            <li>"Build a Netflix-style homepage"</li>
                            <li>"Make a dashboard similar to Google Analytics"</li>
                            <li>"Create a Facebook news feed clone"</li>
                        </ul>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="https://picsum.photos/600/400?random=1" alt="Website Cloning">
                </div>
            </div>
        </section>

        <section id="examples-page" class="page" style="display:none;">
            <div class="examples">
                <h3>Website Cloning Examples</h3>
                <div class="examples-grid">
                    <div class="example-card">
                        <img src="https://picsum.photos/300/200?random=2" alt="E-commerce Example">
                        <h4>E-commerce Sites</h4>
                        <p>Amazon, Flipkart, eBay product pages with grids, carts, and filters</p>
                    </div>
                    <div class="example-card">
                        <img src="https://picsum.photos/300/200?random=3" alt="Streaming Example">
                        <h4>Streaming Services</h4>
                        <p>Netflix, YouTube, Disney+ interfaces with content rows and cards</p>
                    </div>
                    <div class="example-card">
                        <img src="https://picsum.photos/300/200?random=4" alt="Dashboard Example">
                        <h4>Dashboards</h4>
                        <p>Analytics panels with charts, metrics, and data visualizations</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="about-page" class="page" style="display:none;">
            <div class="about">
                <h3>About AI WebBuilder Cloner</h3>
                <p>This tool specializes in creating frontend clones of popular websites using AI. It generates clean HTML, CSS, and JavaScript that mimics the visual design and functionality of real-world platforms.</p>
            </div>
        </section>
    </main>

    <footer>
        <div class="footer-content">
            <p>&copy; 2024 AI WebBuilder. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`,
    "style.css": `/* Global Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

/* Navigation */
nav {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #4a4a4a;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    background: none;
    border: none;
    color: #666;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s;
    font-size: 1rem;
    font-family: inherit;
}

.nav-link:hover {
    color: #007bff;
    background-color: #f0f0f0;
}

.nav-link.active {
    color: #007bff;
    background-color: #e6f0ff;
}

/* Hero Section */
.hero {
    max-width: 1200px;
    margin: 6rem auto 3rem;
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
}

.hero-content h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #666;
}

.example-prompts {
    background: #f0f4f8;
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 2rem;
}

.example-prompts p {
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.example-prompts ul {
    list-style: none;
}

.example-prompts li {
    padding: 0.3rem 0;
    color: #4a5568;
    position: relative;
    padding-left: 1.2rem;
}

.example-prompts li:before {
    content: "•";
    color: #4299e1;
    position: absolute;
    left: 0;
}

.cta-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.cta-button:hover {
    background: #0056b3;
}

.hero-image img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

/* Examples Section */
.examples {
    max-width: 1200px;
    margin: 4rem auto;
    padding: 2rem;
}

.examples h3 {
    font-size: 2rem;
    margin-bottom: 3rem;
    color: #2c3e50;
    text-align: center;
}

.examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.example-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s;
    text-align: center;
}

.example-card:hover {
    transform: translateY(-5px);
}

.example-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.example-card h4 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

/* About and Contact Sections */
.about, .contact {
    max-width: 1200px;
    margin: 6rem auto;
    padding: 2rem;
    text-align: center;
}

.about h3, .contact h3 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #2c3e50;
}

/* Footer */
footer {
    background: #2c3e50;
    color: white;
    text-align: center;
    padding: 2rem;
    margin-top: 4rem;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .nav-menu {
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero-content h2 {
        font-size: 2rem;
    }
}`,
    "script.js": `console.log("AI WebBuilder website cloner loaded successfully!");

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Show initial page
    showPage('home');
    document.querySelector('[data-page="home"]').classList.add('active');
});

function showPage(page) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none');
    
    // Show selected page
    const currentPage = document.getElementById(page + '-page');
    if (currentPage) {
        currentPage.style.display = 'block';
    }
}

// Add animation to example cards on scroll
const exampleCards = document.querySelectorAll('.example-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

exampleCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Image error handling
function handleImageError(img) {
    console.log('Image failed to load:', img.src);
    img.src = 'https://via.placeholder.com/300x200/cccccc/969696?text=Image+Not+Found';
    img.alt = 'Placeholder image';
}

// Initialize image error handling
const images = document.querySelectorAll('img');
images.forEach(img => {
    img.addEventListener('error', function() {
        handleImageError(this);
    });
});

console.log("All JavaScript functionality loaded");`
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
      setError("Please enter a prompt first. Example: 'create an Amazon product page clone' or 'build a Netflix-style homepage'");
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
                    <p>Generating your website clone... ⏳</p>
                    <p className="text-sm mt-2">Creating responsive frontend code</p>
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