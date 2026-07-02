import { useEffect, useState } from "react";
import { useClients } from "../lib/auth";
import { fmtDate, fmtState } from "../lib/format";
import { create } from "@bufbuild/protobuf";
import { ListProjectsRequestSchema } from "@zitadel/proto/zitadel/project/v2beta/project_service_pb.js";

export function ProjectsPage() {
  const clients = useClients();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clients.project.listProjects(create(ListProjectsRequestSchema, {}))
      .then((res) => setProjects(res.projects ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients]);

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Projects</h2>
        <p>{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
      </div>
      {projects.length === 0 ? (
        <div className="empty-state">No projects found</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>State</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p: any) => {
                const s = fmtState(p.state);
                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td><span className={`badge ${s.className}`}>{s.label}</span></td>
                    <td>{fmtDate(p.details?.creationDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
