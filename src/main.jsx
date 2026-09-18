import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("PACATIS runtime error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 32,
            fontFamily: "system-ui",
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          <h1>PACATIS could not start</h1>
          <p>
            The application hit a runtime error. See the browser console for
            details.
          </p>
          <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
            {this.state.error.stack || this.state.error.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("PACATIS: #root element was not found.");
}

createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
