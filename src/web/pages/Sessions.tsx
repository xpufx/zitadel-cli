import { useEffect, useState } from "react";
import { useClients } from "@/lib/auth";
import { fmtDate, fmtState } from "@/lib/format";
import { create } from "@bufbuild/protobuf";
import { ListSessionsRequestSchema } from "@zitadel/proto/zitadel/session/v2/session_service_pb.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function SessionsPage() {
  const clients = useClients();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clients.session.listSessions(create(ListSessionsRequestSchema, { queries: [], sortingColumn: 0 }))
      .then((res: any) => setSessions(res.sessions ?? []))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Sessions</h2>
      <p className="text-muted-foreground text-sm mb-4">{loading ? "Loading..." : `${sessions.length} session${sessions.length !== 1 ? "s" : ""}`}</p>
      {error && <div className="text-destructive text-sm mb-4">{error}</div>}
      {sessions.length === 0 && !loading ? (
        <div className="text-center py-8 text-muted-foreground">No sessions found</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell">Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s: any) => {
                const state = fmtState(s.state);
                const username = s.user?.loginName ?? s.user?.userId ?? "-";
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id?.substring(0, 12)}...</TableCell>
                    <TableCell>{username}</TableCell>
                    <TableCell><Badge variant={state.variant}>{state.label}</Badge></TableCell>
                    <TableCell className="hidden sm:table-cell">{fmtDate(s.creationDate)}</TableCell>
                    <TableCell className="hidden md:table-cell">{fmtDate(s.expirationDate)}</TableCell>
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
