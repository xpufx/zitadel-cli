import { useEffect, useState } from "react";
import { useClients } from "../lib/auth";
import { fmtDate } from "../lib/format";
import { create } from "@bufbuild/protobuf";
import { ListSessionsRequestSchema } from "@zitadel/proto/zitadel/session/v2/session_service_pb.js";

export function SessionsPage() {
  const clients = useClients();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clients.session.listSessions(create(ListSessionsRequestSchema, { queries: [] }))
      .then((res) => setSessions(res.sessions ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients]);

  if (loading) return <div className="loading">Loading sessions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Sessions</h2>
        <p>{sessions.length} session{sessions.length !== 1 ? "s" : ""}</p>
      </div>
      {sessions.length === 0 ? (
        <div className="empty-state">No sessions found</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Auth Methods</th>
                <th>Created</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s: any) => {
                const user = s.factors?.user;
                const userDisplay = user?.displayName ?? user?.loginName ?? user?.userId ?? "-";
                const methods: string[] = [];
                if (s.factors?.password) methods.push("password");
                if (s.factors?.webAuthN) methods.push("webauthn");
                if (s.factors?.totp) methods.push("totp");
                if (s.factors?.otp) methods.push("otp");
                if (s.factors?.intent) methods.push("idp");
                return (
                  <tr key={s.id}>
                    <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{s.id}</td>
                    <td>{userDisplay}</td>
                    <td>{methods.join(", ") || "none"}</td>
                    <td>{fmtDate(s.creationDate)}</td>
                    <td>{fmtDate(s.expirationDate)}</td>
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
