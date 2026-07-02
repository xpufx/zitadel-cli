import { useEffect, useState } from "react";
import { useClients } from "@/lib/auth";
import { create } from "@bufbuild/protobuf";
import { ListApplicationsRequestSchema } from "@zitadel/proto/zitadel/app/v2beta/app_service_pb.js";
import { fmtDate, fmtState } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function AppsPage() {
  const clients = useClients();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clients.app.listApplications(create(ListApplicationsRequestSchema, { projectId: "" }))
      .then((res: any) => setApps(res.applications ?? []))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Applications</h2>
      <p className="text-muted-foreground text-sm mb-4">{loading ? "Loading..." : `${apps.length} application${apps.length !== 1 ? "s" : ""}`}</p>
      {error && <div className="text-destructive text-sm mb-4">{error}</div>}
      {apps.length === 0 && !loading ? (
        <div className="text-center py-8 text-muted-foreground">No applications found</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((a: any) => {
                const appName = a.oidc?.name ?? a.api?.name ?? a.saml?.name ?? a.id;
                const appType = a.oidc ? "OIDC" : a.api ? "API" : a.saml ? "SAML" : "Unknown";
                const appState = fmtState(a.oidc?.state ?? a.api?.state ?? a.saml?.state);
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <Link to={`/apps/${a.id}?project=${a.projectId}`} className="font-medium hover:underline">{appName}</Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{a.projectId}</TableCell>
                    <TableCell>{appType}</TableCell>
                    <TableCell><Badge variant={appState.variant}>{appState.label}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell">{fmtDate(a.details?.creationDate)}</TableCell>
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
