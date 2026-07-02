import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useClients } from "../lib/auth";
import { fmtDate, fmtState } from "../lib/format";
import { create } from "@bufbuild/protobuf";
import { ListOrganizationsRequestSchema, ListOrganizationDomainsRequestSchema } from "@zitadel/proto/zitadel/org/v2beta/org_service_pb.js";

export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const clients = useClients();
  const [org, setOrg] = useState<any>(null);
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      clients.org.listOrganizations(create(ListOrganizationsRequestSchema, { sortingColumn: 0, filter: [{ filter: { case: "idFilter", value: { id } } }] })),
      clients.org.listOrganizationDomains(create(ListOrganizationDomainsRequestSchema, { organizationId: id, filters: [] })),
    ]).then(([o, d]) => {
      const orgs = o.organizations ?? [];
      setOrg(orgs.length > 0 ? orgs[0] : null);
      setDomains(d.domains ?? []);
    }).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    .finally(() => setLoading(false));
  }, [clients, id]);

  if (loading) return <div className="loading">Loading organization...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!org) return <div className="empty-state">Organization not found</div>;

  return (
    <div>
      <div className="page-header">
        <Link to="/orgs" style={{ fontSize: "0.875rem" }}>&larr; Back to Organizations</Link>
        <h2>{org.name} <span className={`badge ${fmtState(org.state).className}`}>{fmtState(org.state).label}</span></h2>
      </div>

      <div className="detail-grid">
        <div className="card">
          <h3>Details</h3>
          <div className="detail-field"><div className="label">Org ID</div><div className="value" style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{org.id}</div></div>
          <div className="detail-field"><div className="label">Primary Domain</div><div className="value">{org.primaryDomain ?? "-"}</div></div>
          <div className="detail-field"><div className="label">Created</div><div className="value">{fmtDate(org.details?.creationDate)}</div></div>
          <div className="detail-field"><div className="label">Changed</div><div className="value">{fmtDate(org.details?.changeDate)}</div></div>
        </div>

        <div className="card">
          <h3>Domains ({domains.length})</h3>
          {domains.length === 0 ? (
            <div className="empty-state" style={{ padding: "1rem" }}>No domains</div>
          ) : (
            <table>
              <thead><tr><th>Domain</th><th>Verified</th><th>Primary</th></tr></thead>
              <tbody>
                {domains.map((d: any) => (
                  <tr key={d.domain}>
                    <td>{d.domain}</td>
                    <td>{d.isVerified ? "Yes" : "No"}</td>
                    <td>{d.isPrimary ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
