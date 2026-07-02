import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useClients } from "@/lib/auth";
import { fmtDate, fmtState } from "@/lib/format";
import { create } from "@bufbuild/protobuf";
import { ListProjectsRequestSchema } from "@zitadel/proto/zitadel/project/v2beta/project_service_pb.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function ProjectsPage() {
  const clients = useClients();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clients.project.listProjects(create(ListProjectsRequestSchema, {}))
      .then((res) => setProjects(res.projects ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Projects</h2>
      <p className="text-muted-foreground text-sm mb-4">{loading ? "Loading..." : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}</p>
      {error && <div className="text-destructive text-sm mb-4">{error}</div>}
      {projects.length === 0 && !loading ? (
        <div className="text-center py-8 text-muted-foreground">No projects found</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Owner</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p: any) => {
                const s = fmtState(p.state);
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link to={`/projects/${p.id}`} className="font-medium hover:underline">{p.name}</Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-xs">{p.details?.resourceOwner ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{fmtDate(p.details?.creationDate)}</TableCell>
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
