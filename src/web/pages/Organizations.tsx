import { useEffect, useState } from "react";
import { useClients } from "../lib/auth";
import { fmtDate, fmtState } from "../lib/format";
import { create } from "@bufbuild/protobuf";
import { ListOrganizationsRequestSchema } from "@zitadel/proto/zitadel/org/v2beta/org_service_pb.js";

export function OrganizationsPage() {
  const clients = useClients();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clients.org.listOrganizations(create(ListOrganizationsRequestSchema, { sortingColumn: 0, filter: [] }))
      .then((res) => setOrgs(res.organizations ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients]);

  if (loading) return <div className="loading">Loading organizations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Organizations</h2>
        <p>{orgs.length} organization{orgs.length !== 1 ? "s" : ""}</p>
      </div>
      {orgs.length === 0 ? (
        <div className="empty-state">No organizations found</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Primary Domain</th>
                <th>State</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((o: any) => {
                const s = fmtState(o.state);
                return (
                  <tr key={o.id}>
                    <td>{o.name}</td>
                    <td>{o.primaryDomain ?? "-"}</td>
                    <td><span className={`badge ${s.className}`}>{s.label}</span></td>
                    <td>{fmtDate(o.details?.creationDate)}</td>
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
