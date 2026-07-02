import { useEffect, useState } from "react";
import { useClients } from "../lib/auth";
import { fmtDate, fmtState } from "../lib/format";
import { create } from "@bufbuild/protobuf";
import { ListApplicationsRequestSchema } from "@zitadel/proto/zitadel/app/v2beta/app_service_pb.js";

export function AppsPage() {
  const clients = useClients();
  const [apps, setApps] = useState<any[]>([]);
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetch = (pid: string) => {
    setLoading(true);
    setError("");
    clients.app.listApplications(create(ListApplicationsRequestSchema, { projectId: pid }))
      .then((res) => setApps(res.applications ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="page-header">
        <h2>Applications</h2>
        <p>Enter a Project ID to list its applications</p>
      </div>
      <div className="card" style={{ display: "flex", gap: "0.5rem", alignItems: "end" }}>
        <div className="form-group" style={{ flex: 1, margin: 0 }}>
          <label>Project ID</label>
          <input
            placeholder="Enter project ID..."
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => fetch(projectId)} disabled={!projectId || loading}>
          {loading ? "Loading..." : "List"}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {!loading && apps.length > 0 && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>State</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a: any) => {
                const s = fmtState(a.state);
                const type = a.oidcConfig ? "OIDC" : a.samlConfig ? "SAML" : a.apiConfig ? "API" : "Unknown";
                return (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{type}</td>
                    <td><span className={`badge ${s.className}`}>{s.label}</span></td>
                    <td>{fmtDate(a.details?.creationDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!loading && projectId && apps.length === 0 && !error && (
        <div className="empty-state">No applications found for this project</div>
      )}
    </div>
  );
}
