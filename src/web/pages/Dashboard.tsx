import { useEffect, useState } from "react";
import { useClients } from "@/lib/auth";
import { create } from "@bufbuild/protobuf";
import { ListUsersRequestSchema } from "@zitadel/proto/zitadel/user/v2/user_service_pb.js";
import { ListOrganizationsRequestSchema } from "@zitadel/proto/zitadel/org/v2beta/org_service_pb.js";
import { ListSessionsRequestSchema } from "@zitadel/proto/zitadel/session/v2/session_service_pb.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Globe } from "lucide-react";

export function Dashboard() {
  const clients = useClients();
  const [stats, setStats] = useState<{ users: number; orgs: number; sessions: number } | null>(null);
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
    }).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    .finally(() => setLoading(false));
  }, [clients]);

  if (loading) return <div className="text-muted-foreground py-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="text-destructive py-8 text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Dashboard</h2>
      <p className="text-muted-foreground text-sm mb-6">Overview of your ZITADEL instance</p>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.orgs ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sessions ?? 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
