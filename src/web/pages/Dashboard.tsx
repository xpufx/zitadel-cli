import { useEffect, useState } from "react";
import { useClients } from "../lib/auth";
import { create } from "@bufbuild/protobuf";
import { ListUsersRequestSchema } from "@zitadel/proto/zitadel/user/v2/user_service_pb.js";
import { ListOrganizationsRequestSchema } from "@zitadel/proto/zitadel/org/v2beta/org_service_pb.js";
import { ListSessionsRequestSchema } from "@zitadel/proto/zitadel/session/v2/session_service_pb.js";

interface Stats {
  users: number;
  orgs: number;
  sessions: number;
}

export function Dashboard() {
  const clients = useClients();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      clients.user.listUsers(create(ListUsersRequestSchema, { queries: [] })),
      clients.org.listOrganizations(create(ListOrganizationsRequestSchema, { sortingColumn: 0, filter: [] })),
      clients.session.listSessions(create(ListSessionsRequestSchema, { queries: [] })),
    ]).then(([users, orgs, sessions]) => {
      setStats({
        users: users.result?.length ?? 0,
        orgs: orgs.organizations?.length ?? 0,
        sessions: sessions.sessions?.length ?? 0,
      });
    }).catch((e) => {
      setError(e instanceof Error ? e.message : String(e));
    }).finally(() => setLoading(false));
  }, [clients]);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your ZITADEL instance</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Users</div>
          <div className="value">{stats?.users ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">Organizations</div>
          <div className="value">{stats?.orgs ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">Sessions</div>
          <div className="value">{stats?.sessions ?? 0}</div>
        </div>
      </div>
    </div>
  );
}
