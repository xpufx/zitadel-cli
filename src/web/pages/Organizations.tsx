import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useClients } from "@/lib/auth";
import { fmtDate, fmtState } from "@/lib/format";
import { create } from "@bufbuild/protobuf";
import { ListOrganizationsRequestSchema } from "@zitadel/proto/zitadel/org/v2beta/org_service_pb.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Organizations</h2>
      <p className="text-muted-foreground text-sm mb-4">{loading ? "Loading..." : `${orgs.length} organization${orgs.length !== 1 ? "s" : ""}`}</p>
      {error && <div className="text-destructive text-sm mb-4">{error}</div>}
      {orgs.length === 0 && !loading ? (
        <div className="text-center py-8 text-muted-foreground">No organizations found</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Primary Domain</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgs.map((o: any) => {
                const s = fmtState(o.state);
                return (
                  <TableRow key={o.id}>
                    <TableCell>
                      <Link to={`/orgs/${o.id}`} className="font-medium hover:underline">{o.name}</Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{o.primaryDomain ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant={s.variant as any}>{s.label}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{fmtDate(o.details?.creationDate)}</TableCell>
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
