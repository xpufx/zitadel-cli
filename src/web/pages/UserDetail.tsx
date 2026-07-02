import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useClients } from "../lib/auth";
import { fmtDate, fmtState } from "../lib/format";
import { create } from "@bufbuild/protobuf";
import { GetUserByIDRequestSchema, ListUserMetadataRequestSchema, ListAuthenticationFactorsRequestSchema, ListAuthenticationMethodTypesRequestSchema, ListPasskeysRequestSchema } from "@zitadel/proto/zitadel/user/v2/user_service_pb.js";

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const clients = useClients();
  const [user, setUser] = useState<any>(null);
  const [meta, setMeta] = useState<any[]>([]);
  const [factors, setFactors] = useState<any[]>([]);
  const [methods, setMethods] = useState<string[]>([]);
  const [passkeys, setPasskeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      clients.user.getUserByID(create(GetUserByIDRequestSchema, { userId: id })),
      clients.user.listUserMetadata(create(ListUserMetadataRequestSchema, { userId: id })),
      clients.user.listAuthenticationFactors(create(ListAuthenticationFactorsRequestSchema, { userId: id })),
      clients.user.listAuthenticationMethodTypes(create(ListAuthenticationMethodTypesRequestSchema, { userId: id })),
      clients.user.listPasskeys(create(ListPasskeysRequestSchema, { userId: id })),
    ]).then(([u, m, f, mt, pk]) => {
      setUser(u.user);
      setMeta(m.metadata ?? []);
      setFactors(f.result ?? []);
      setMethods((mt.authMethodTypes ?? []).map((t: any) => t.toString()));
      setPasskeys(pk.result ?? []);
    }).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    .finally(() => setLoading(false));
  }, [clients, id]);

  if (loading) return <div className="loading">Loading user...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="empty-state">User not found</div>;

  const profile = user.type?.human?.profile;
  const email = user.type?.human?.email;
  const phone = user.type?.human?.phone;

  return (
    <div>
      <div className="page-header">
        <Link to="/users" style={{ fontSize: "0.875rem" }}>&larr; Back to Users</Link>
        <h2>{profile?.givenName ?? ""} {profile?.familyName ?? ""} <span className={`badge ${fmtState(user.state).className}`}>{fmtState(user.state).label}</span></h2>
        <p>{user.preferredLoginName ?? user.username}</p>
      </div>

      <div className="detail-grid">
        <div className="card">
          <h3>Profile</h3>
          <div className="detail-field"><div className="label">User ID</div><div className="value" style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{user.userId}</div></div>
          <div className="detail-field"><div className="label">Username</div><div className="value">{user.username ?? "-"}</div></div>
          <div className="detail-field"><div className="label">Preferred Login</div><div className="value">{user.preferredLoginName ?? "-"}</div></div>
          {profile && <>
            <div className="detail-field"><div className="label">Display Name</div><div className="value">{profile.displayName ?? "-"}</div></div>
            <div className="detail-field"><div className="label">Nickname</div><div className="value">{profile.nickName ?? "-"}</div></div>
            <div className="detail-field"><div className="label">Language</div><div className="value">{profile.preferredLanguage ?? "-"}</div></div>
            <div className="detail-field"><div className="label">Gender</div><div className="value">{profile.gender ?? "-"}</div></div>
          </>}
        </div>

        <div className="card">
          <h3>Contact</h3>
          {email && <>
            <div className="detail-field"><div className="label">Email</div><div className="value">{email.email ?? "-"}</div></div>
            <div className="detail-field"><div className="label">Email Verified</div><div className="value">{email.isVerified ? "Yes" : "No"}</div></div>
          </>}
          {phone && <>
            <div className="detail-field"><div className="label">Phone</div><div className="value">{phone.phone ?? "-"}</div></div>
            <div className="detail-field"><div className="label">Phone Verified</div><div className="value">{phone.isVerified ? "Yes" : "No"}</div></div>
          </>}
          <div className="detail-field"><div className="label">Created</div><div className="value">{fmtDate(user.details?.creationDate)}</div></div>
          <div className="detail-field"><div className="label">Changed</div><div className="value">{fmtDate(user.details?.changeDate)}</div></div>
        </div>

        {meta.length > 0 && (
          <div className="card">
            <h3>Metadata ({meta.length})</h3>
            <table>
              <thead><tr><th>Key</th><th>Value</th></tr></thead>
              <tbody>
                {meta.map((m: any) => (
                  <tr key={m.key}><td>{m.key}</td><td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{atob(m.value ?? "")}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="card">
          <h3>Authentication</h3>
          <div className="detail-field"><div className="label">Methods</div><div className="value">{methods.length > 0 ? methods.join(", ") : "None"}</div></div>
          <div className="detail-field"><div className="label">Factors</div><div className="value">{factors.length}</div></div>
          {passkeys.length > 0 && (
            <div style={{ marginTop: "0.75rem" }}>
              <div className="label">Passkeys ({passkeys.length})</div>
              <ul style={{ marginTop: "0.25rem", fontSize: "0.875rem" }}>
                {passkeys.map((pk: any) => (
                  <li key={pk.id}>{pk.name ?? pk.id}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
