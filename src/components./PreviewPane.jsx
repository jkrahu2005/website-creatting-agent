import React from "react";

const PreviewPane = ({ html, css, js }) => {
  const srcDoc = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `;

  return (
    <div className="flex-1 p-4 bg-white dark:bg-gray-900 shadow-inner">
      <iframe
        srcDoc={srcDoc}
        title="Live Preview"
        sandbox="allow-scripts"
        frameBorder="0"
        className="w-full h-[400px] rounded-lg"
      />
    </div>
  );
};

export default PreviewPane;
