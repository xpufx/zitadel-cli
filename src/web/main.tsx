import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");
if (!root) throw new Error("no #root");

createRoot(root).render(
  <StrictMode>
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>ZITADEL Console</h1>
      <p style={{ color: "#666" }}>CLI + Web shared management tool</p>
      <p>Use the CLI for now. Web UI coming soon.</p>
    </div>
  </StrictMode>,
);
