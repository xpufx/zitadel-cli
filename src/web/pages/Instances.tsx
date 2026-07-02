import { useEffect, useState } from "react";
import { useClients } from "@/lib/auth";
import { create } from "@bufbuild/protobuf";
import { ListInstancesRequestSchema } from "@zitadel/proto/zitadel/instance/v2beta/instance_service_pb.js";
import { fmtDate, fmtState } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function InstancesPage() {
  const clients = useClients();
  const [instances, setInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clients.instance.listInstances(create(ListInstancesRequestSchema, { queries: [] }))
      .then((res: any) => setInstances(res.instances ?? []))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Instances</h2>
      <p className="text-muted-foreground text-sm mb-4">{loading ? "Loading..." : `${instances.length} instance${instances.length !== 1 ? "s" : ""}`}</p>
      {error && <div className="text-destructive text-sm mb-4">{error}</div>}
      {instances.length === 0 && !loading ? (
        <div className="text-center py-8 text-muted-foreground">No instances found</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">ID</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instances.map((inst: any) => {
                const s = fmtState(inst.state);
                return (
                  <TableRow key={inst.id}>
                    <TableCell className="font-medium">{inst.name}</TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-xs">{inst.id}</TableCell>
                    <TableCell><Badge variant={s.variant}>{s.label}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell">{fmtDate(inst.details?.creationDate)}</TableCell>
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
