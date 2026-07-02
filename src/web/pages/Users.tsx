import { useEffect, useState } from "react";
import { useClients } from "../lib/auth";
import { fmtDate, fmtState } from "../lib/format";
import { create } from "@bufbuild/protobuf";
import { ListUsersRequestSchema } from "@zitadel/proto/zitadel/user/v2/user_service_pb.js";

export function UsersPage() {
  const clients = useClients();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clients.user.listUsers(create(ListUsersRequestSchema, { queries: [] }))
      .then((res) => setUsers(res.result ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients]);

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Users</h2>
        <p>{users.length} user{users.length !== 1 ? "s" : ""}</p>
      </div>
      {users.length === 0 ? (
        <div className="empty-state">No users found</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>State</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => {
                const s = fmtState(u.state);
                return (
                  <tr key={u.userId}>
                    <td><a href={`/users/${u.userId}`} onClick={(e) => { e.preventDefault(); window.location.href = `/users/${u.userId}`; }}>{u.preferredLoginName ?? u.username ?? u.userId}</a></td>
                    <td>{u.type?.human?.profile?.givenName ?? ""} {u.type?.human?.profile?.familyName ?? ""}</td>
                    <td>{u.type?.human?.email?.email ?? "-"}</td>
                    <td><span className={`badge ${s.className}`}>{s.label}</span></td>
                    <td>{fmtDate(u.details?.creationDate)}</td>
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
