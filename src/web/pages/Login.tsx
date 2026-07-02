import { useState } from "react";
import { useAuth } from "../lib/auth";

export function LoginPage() {
  const { login } = useAuth();
  const [apiUrl, setApiUrl] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiUrl || !token) { setError("Both fields are required"); return; }
    setLoading(true);
    setError("");
    try {
      const url = apiUrl.replace(/\/+$/, "");
      new URL(url);
      login(url, token);
    } catch {
      setError("Invalid URL");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>ZITADEL Console</h1>
        <p>Connect to your ZITADEL instance</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Instance URL</label>
            <input
              type="url"
              placeholder="https://zit.mrs.uppidi.com"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Personal Access Token (PAT)</label>
            <input
              type="password"
              placeholder="paste your PAT"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Connecting..." : "Connect"}
          </button>
        </form>
      </div>
    </div>
  );
}
