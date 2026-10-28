
import { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./App.css";
import "./animations.css";

marked.setOptions({
  gfm: true,
  breaks: true,
});

const defaultMarkdown = [
  "# Your Name",
  "",
  "> Frontend Developer | UI Designer | Creative Thinker",
  "",
  "Welcome to my portfolio! I build clean, modern, and user-friendly digital experiences.",
  "",
  "## About Me",
  "",
  "I'm a passionate developer who enjoys creating beautiful websites and solving problems through code.",
  "",
  "## Skills",
  "",
  "- HTML",
  "- CSS",
  "- JavaScript",
  "- React",
  "- UI/UX Design",
  "",
  "## Projects",
  "",
  "### Project One",
  "",
  "A responsive website built with React and modern CSS.",
  "",
  "[View Project](https://example.com)",
  "",
  "### Project Two",
  "",
  "A creative web application designed to improve productivity.",
  "",
  "[View Project](https://example.com)",
  "",
  "## Experience",
  "",
  "### Frontend Developer",
  "",
  "Built responsive interfaces and reusable UI components.",
  "",
  "## Education",
  "",
  "Add your degree, college, or certification here.",
  "",
  "## Contact",
  "",
  "- Email: yourname@example.com",
  "- GitHub: https://github.com/your-username",
  "- LinkedIn: https://www.linkedin.com/in/your-profile/",
  "- Portfolio: https://your-website.com",
].join("\n");

const themes = {
  midnight: {
    name: "Midnight Pro",
    bg: "#10111c",
    card: "#1a1b29",
    text: "#e8eaf2",
    heading: "#b5a4ff",
    link: "#b5a4ff",
    border: "#343248",
  },
  aurora: {
    name: "Aurora",
    bg: "#081311",
    card: "#122c2b",
    text: "#e5fff8",
    heading: "#7cf0d0",
    link: "#7cf0d0",
    border: "#28514a",
  },
  light: {
    name: "Light",
    bg: "#f5f4fa",
    card: "#ffffff",
    text: "#514b65",
    heading: "#7458ce",
    link: "#7458ce",
    border: "#e4def1",
  },
};

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [theme, setTheme] = useState("midnight");
  const [message, setMessage] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  const selectedTheme = themes[theme] || themes.midnight;

  const html = useMemo(() => {
    return DOMPurify.sanitize(marked.parse(markdown));
  }, [markdown]);

  function copyMarkdown() {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(markdown)
        .then(() => setMessage("Markdown copied successfully!"))
        .catch(() => setMessage("Copy failed. Please copy directly from the editor."));
    } else {
      setMessage("Clipboard is not supported in this browser.");
    }
  }

  function resetEditor() {
    const confirmed = window.confirm(
      "Reset the editor to the starter portfolio?"
    );

    if (confirmed) {
      setMarkdown(defaultMarkdown);
      setMessage("Starter portfolio restored.");
    }
  }

  function downloadMarkdown() {
    downloadFile(
      markdown,
      "my-portfolio.md",
      "text/markdown;charset=utf-8"
    );
    setMessage("Markdown file downloaded!");
  }

  function downloadHTML() {
    const css = [
      "*{box-sizing:border-box}",
      "html{scroll-behavior:smooth}",
      "body{margin:0;padding:40px 20px;font:16px/1.8 Arial,sans-serif;background:" +
        selectedTheme.bg +
        ";color:" +
        selectedTheme.text +
        "}",
      ".container{max-width:850px;margin:0 auto;padding:clamp(22px,5vw,50px);background:" +
        selectedTheme.card +
        ";border:1px solid " +
        selectedTheme.border +
        ";border-radius:20px;box-shadow:0 20px 60px #00000015}",
      "h1,h2,h3{color:" +
        selectedTheme.heading +
        ";line-height:1.3}",
      "h1{font-size:clamp(32px,6vw,48px);letter-spacing:-1px;overflow-wrap:anywhere}",
      "h2{margin-top:32px;padding-bottom:8px;border-bottom:1px solid " +
        selectedTheme.border +
        "}",
      "a{color:" +
        selectedTheme.link +
        ";overflow-wrap:anywhere}",
      "img{max-width:100%;height:auto;border-radius:10px}",
      "pre{overflow-x:auto;padding:16px;border-radius:10px;background:" +
        selectedTheme.bg +
        "}",
      "code{overflow-wrap:anywhere}",
      "blockquote{border-left:3px solid " +
        selectedTheme.heading +
        ";padding-left:16px;margin-left:0}",
      "li{margin:5px 0}",
      "table{width:100%;border-collapse:collapse;display:block;overflow-x:auto}",
      "th,td{border:1px solid " +
        selectedTheme.border +
        ";padding:8px;text-align:left}",
      "hr{border:0;border-top:1px solid " + selectedTheme.border + "}",
      "@media(max-width:480px){body{padding:15px 10px}.container{padding:20px;border-radius:12px}}",
    ].join("\n");

    const page = [
      "<!DOCTYPE html>",
      '<html lang="en">',
      "<head>",
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      "<title>My Portfolio</title>",
      "<style>",
      css,
      "</style>",
      "</head>",
      "<body>",
      '<main class="container">',
      html,
      "</main>",
      "</body>",
      "</html>",
    ].join("\n");

    downloadFile(
      page,
      "my-portfolio.html",
      "text/html;charset=utf-8"
    );

    setMessage("HTML exported with " + selectedTheme.name + " theme!");
  }

  return (
    <div className={"app-shell theme-" + theme}>
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Portify home">
          <span className="brand-mark">P</span>
          <span>Portify</span>
        </a>

        <span className="topbar-caption">MARKDOWN PORTFOLIO STUDIO</span>

        <span className="status-indicator">
          <span className="status-dot" />
          Live Preview
        </span>
      </header>

      <main className="studio" id="home">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">YOUR WORK. YOUR STORY.</span>
            <h1>
              Build your portfolio.
              <br />
              <span>Make it yours.</span>
            </h1>
            <p>
              Write in Markdown, preview instantly, and export a beautiful
              portfolio in seconds.
            </p>
          </div>

          <div className="hero-chip">
            <span>✦</span> Creator Studio
          </div>
        </section>

        <section className="toolbar" aria-label="Portfolio controls">
          <div className="theme-picker">
            <span className="toolbar-label">THEME</span>

            {Object.entries(themes).map(([key, item]) => (
              <button
                type="button"
                key={key}
                className={
                  "theme-button " + (theme === key ? "active" : "")
                }
                onClick={() => {
                  setTheme(key);
                  setMessage(item.name + " theme selected.");
                }}
                aria-pressed={theme === key}
              >
                <span className={"theme-swatch swatch-" + key} />
                {item.name}
              </button>
            ))}
          </div>

          <div className="toolbar-actions">
            <button
              type="button"
              className="btn btn-quiet"
              onClick={copyMarkdown}
            >
              Copy Markdown
            </button>

            <button
              type="button"
              className="btn btn-quiet"
              onClick={resetEditor}
            >
              Reset
            </button>
          </div>
        </section>

        {message && (
          <div className="toast-message" role="status">
            <span>✓</span> {message}
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <section className="workspace">
          <article className="panel editor-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span className="panel-icon">⌘</span>
                <div>
                  <h2>Markdown Editor</h2>
                  <p>Write your story in plain text</p>
                </div>
              </div>

              <span className="file-pill">.md</span>
            </div>

            <div className="editor-meta">
              <span>EDIT SOURCE</span>
              <span>{markdown.length} characters</span>
            </div>

            <textarea
              className="markdown-editor"
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              placeholder="# Your Name&#10;Write your portfolio here..."
              spellCheck="false"
              aria-label="Portfolio Markdown editor"
            />

            <div className="editor-footer">
              <span>
                <span className="status-dot" /> Auto-updating preview
              </span>
              <button
                type="button"
                className="text-button"
                onClick={downloadMarkdown}
              >
                ↓ Download .md
              </button>
            </div>
          </article>

          <article className="panel preview-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span className="panel-icon">◈</span>
                <div>
                  <h2>Live Preview</h2>
                  <p>Your portfolio as visitors will see it</p>
                </div>
              </div>

              <span className="live-pill">
                <span className="status-dot" /> LIVE
              </span>
            </div>

            <div
              className="preview-canvas"
              style={{
                backgroundColor: selectedTheme.bg,
                borderColor: selectedTheme.border,
              }}
            >
              <article
                className="rendered-portfolio"
                style={{
                  backgroundColor: selectedTheme.card,
                  color: selectedTheme.text,
                  borderColor: selectedTheme.border,
                }}
              >
                <div
                  className="markdown-output"
                  style={{
                    "--portfolio-heading": selectedTheme.heading,
                    "--portfolio-link": selectedTheme.link,
                    "--portfolio-border": selectedTheme.border,
                    "--portfolio-bg": selectedTheme.bg,
                  }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </article>
            </div>

            <div className="preview-footer">
              <span>Theme: {selectedTheme.name}</span>
              <span>Responsive portfolio</span>
            </div>
          </article>
        </section>

        <section className="export-section">
          <div className="export-copy">
            <span className="eyebrow">READY TO SHARE?</span>
            <h2>Your portfolio, ready for the world.</h2>
            <p>
              Export a standalone HTML page with your selected theme, or save
              the Markdown source to edit later.
            </p>
          </div>

          <div className="export-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={downloadHTML}
            >
              <span>↓</span> Export HTML
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={downloadMarkdown}
            >
              Download Markdown
            </button>
          </div>
        </section>

        <section className="publish-panel">
          <button
            type="button"
            className="publish-toggle"
            onClick={() => setShowGuide((current) => !current)}
            aria-expanded={showGuide}
          >
            <span className="publish-icon">↗</span>
            <span className="publish-text">
              <strong>How to publish your portfolio</strong>
              <small>Take your exported HTML online for free.</small>
            </span>
            <span className="publish-chevron">
              {showGuide ? "−" : "+"}
            </span>
          </button>

          {showGuide && (
            <div className="publish-content">
              <ol>
                <li>
                  Click <strong>Export HTML</strong> and save
                  <code> my-portfolio.html</code>.
                </li>
                <li>
                  Rename it to <code>index.html</code>.
                </li>
                <li>
                  Upload it to a static hosting service such as GitHub Pages
                  or Netlify.
                </li>
                <li>
                  Open your published URL and share it on LinkedIn or your
                  resume.
                </li>
              </ol>
              <p>
                Before publishing, replace the sample name, project links,
                email, GitHub URL, and LinkedIn URL with your own details.
              </p>
            </div>
          )}
        </section>

        <footer className="app-footer">
          <a className="footer-brand" href="#home">
            <span className="brand-mark">P</span> Portify
          </a>
          <span>Made for creators who want to stand out.</span>
          <span>Markdown in. Portfolio out. ✦</span>
        </footer>
      </main>
    </div>
  );
}
