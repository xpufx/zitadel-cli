import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useClients } from "@/lib/auth";
import { fmtDate, fmtState } from "@/lib/format";
import { create } from "@bufbuild/protobuf";
import { GetProjectRequestSchema, ListProjectGrantsRequestSchema } from "@zitadel/proto/zitadel/project/v2beta/project_service_pb.js";
import { ListApplicationsRequestSchema } from "@zitadel/proto/zitadel/app/v2beta/app_service_pb.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const clients = useClients();
  const [project, setProject] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      clients.project.getProject(create(GetProjectRequestSchema, { id })),
      clients.app.listApplications(create(ListApplicationsRequestSchema, { projectId: id })),
      clients.project.listProjectGrants(create(ListProjectGrantsRequestSchema, { filters: [] })),
    ]).then(([p, a, g]) => {
      setProject(p.project);
      setApps(a.applications ?? []);
      setGrants((g.projectGrants ?? []).filter((grant: any) => grant.projectId === id));
    }).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    .finally(() => setLoading(false));
  }, [clients, id]);

  if (loading) return <div className="text-muted-foreground py-8 text-center">Loading project...</div>;
  if (error) return <div className="text-destructive py-8 text-center">{error}</div>;
  if (!project) return <div className="text-center py-8 text-muted-foreground">Project not found</div>;

  const s = fmtState(project.state);

  return (
    <div className="space-y-6">
      <div>
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="mb-2 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Projects
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold">
          {project.name}
          <Badge variant={s.variant} className="ml-2">{s.label}</Badge>
        </h2>
        <p className="text-muted-foreground text-sm" style={{ fontFamily: "monospace" }}>{project.id}</p>
      </div>

      <Tabs defaultValue="apps">
        <TabsList className="flex-wrap">
          <TabsTrigger value="apps">Applications ({apps.length})</TabsTrigger>
          <TabsTrigger value="grants">Grants ({grants.length})</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="apps" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {apps.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No applications</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead className="hidden sm:table-cell">Created</TableHead>
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
                            <Link to={`/apps/${a.id}?project=${id}`} className="font-medium hover:underline">{appName}</Link>
                          </TableCell>
                          <TableCell>{appType}</TableCell>
                          <TableCell><Badge variant={appState.variant}>{appState.label}</Badge></TableCell>
                          <TableCell className="hidden sm:table-cell">{fmtDate(a.details?.creationDate)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grants" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {grants.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No grants</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Role Keys</TableHead>
                      <TableHead>State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grants.map((g: any) => (
                      <TableRow key={g.grantId}>
                        <TableCell className="font-mono text-xs">{g.grantedOrgId}</TableCell>
                        <TableCell className="text-sm">{(g.roleKeys ?? []).join(", ") || "-"}</TableCell>
                        <TableCell><Badge variant={fmtState(g.state).variant}>{fmtState(g.state).label}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Field label="Project ID" value={project.id} mono />
              <Field label="Owner" value={project.details?.resourceOwner} mono />
              <Field label="Role Assertion" value={project.projectRoleAssertion ? "Yes" : "No"} />
              <Field label="Role Check" value={project.projectRoleCheck ? "Yes" : "No"} />
              <Field label="Has Project Check" value={project.hasProjectCheck ? "Yes" : "No"} />
              <Field label="Created" value={fmtDate(project.details?.creationDate)} />
              <Field label="Changed" value={fmtDate(project.details?.changeDate)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className={`text-sm ${mono ? "font-mono text-xs" : ""}`}>{value || "-"}</div>
    </div>
  );
}
