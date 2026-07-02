import { useEffect, useState } from "react";
import { useClients } from "@/lib/auth";
import { create } from "@bufbuild/protobuf";
import { ListWebKeysRequestSchema } from "@zitadel/proto/zitadel/webkey/v2/webkey_service_pb.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function WebKeysPage() {
  const clients = useClients();
  const [webKeys, setWebKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clients.webkey.listWebKeys(create(ListWebKeysRequestSchema, {}))
      .then((res: any) => setWebKeys(res.webKeys ?? []))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Web Keys</h2>
      <p className="text-muted-foreground text-sm mb-4">{loading ? "Loading..." : `${webKeys.length} key${webKeys.length !== 1 ? "s" : ""}`}</p>
      {error && <div className="text-destructive text-sm mb-4">{error}</div>}
      {webKeys.length === 0 && !loading ? (
        <div className="text-center py-8 text-muted-foreground">No web keys found</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Algorithm</TableHead>
                <TableHead>Use</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webKeys.map((k: any) => (
                <TableRow key={k.id}>
                  <TableCell className="font-mono text-xs">{k.id}</TableCell>
                  <TableCell>{k.algorithm?.toString() ?? "-"}</TableCell>
                  <TableCell>{k.use?.toString() ?? "-"}</TableCell>
                  <TableCell><Badge variant={k.isActive ? "default" : "secondary"}>{k.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell className="hidden sm:table-cell">{k.details?.creationDate?.seconds ? new Date(Number(k.details.creationDate.seconds) * 1000).toLocaleString() : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
