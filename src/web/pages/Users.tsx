import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useClients } from "@/lib/auth";
import { fmtDate, fmtState } from "@/lib/format";
import { create } from "@bufbuild/protobuf";
import { ListUsersRequestSchema } from "@zitadel/proto/zitadel/user/v2/user_service_pb.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Users</h2>
      <p className="text-muted-foreground text-sm mb-4">{loading ? "Loading..." : `${users.length} user${users.length !== 1 ? "s" : ""}`}</p>
      {error && <div className="text-destructive text-sm mb-4">{error}</div>}
      {users.length === 0 && !loading ? (
        <div className="text-center py-8 text-muted-foreground">No users found</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead className="hidden sm:table-cell">Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u: any) => {
                const s = fmtState(u.state);
                return (
                  <TableRow key={u.userId}>
                    <TableCell>
                      <Link to={`/users/${u.userId}`} className="font-medium hover:underline">
                        {u.preferredLoginName ?? u.username ?? u.userId}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {u.type?.human?.profile?.givenName ?? ""} {u.type?.human?.profile?.familyName ?? ""}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{u.type?.human?.email?.email ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant={s.variant as any}>{s.label}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{fmtDate(u.details?.creationDate)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
