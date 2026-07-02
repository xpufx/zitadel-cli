import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useClients } from "@/lib/auth";
import { fmtDate, fmtState } from "@/lib/format";
import { create } from "@bufbuild/protobuf";
import { ListOrganizationsRequestSchema, ListOrganizationDomainsRequestSchema } from "@zitadel/proto/zitadel/org/v2beta/org_service_pb.js";
import { ListProjectsRequestSchema } from "@zitadel/proto/zitadel/project/v2beta/project_service_pb.js";
import { ListProjectGrantsRequestSchema } from "@zitadel/proto/zitadel/project/v2beta/project_service_pb.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const clients = useClients();
  const [org, setOrg] = useState<any>(null);
  const [domains, setDomains] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      clients.org.listOrganizations(create(ListOrganizationsRequestSchema, { sortingColumn: 0, filter: [{ filter: { case: "idFilter", value: { id } } }] })),
      clients.org.listOrganizationDomains(create(ListOrganizationDomainsRequestSchema, { organizationId: id, filters: [] })),
      clients.project.listProjects(create(ListProjectsRequestSchema, {})),
      clients.project.listProjectGrants(create(ListProjectGrantsRequestSchema, { filters: [] })),
    ]).then(([o, d, p, g]) => {
      const orgs = o.organizations ?? [];
      setOrg(orgs.length > 0 ? orgs[0] : null);
      setDomains(d.domains ?? []);
      setProjects(p.projects ?? []);
      setGrants(g.projectGrants ?? []);
    }).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    .finally(() => setLoading(false));
  }, [clients, id]);

  if (loading) return <div className="text-muted-foreground py-8 text-center">Loading organization...</div>;
  if (error) return <div className="text-destructive py-8 text-center">{error}</div>;
  if (!org) return <div className="text-center py-8 text-muted-foreground">Organization not found</div>;

  const s = fmtState(org.state);

  return (
    <div className="space-y-6">
      <div>
        <Link to="/orgs">
          <Button variant="ghost" size="sm" className="mb-2 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Organizations
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold">
          {org.name}
          <Badge variant={s.variant as any} className="ml-2">{s.label}</Badge>
        </h2>
        <p className="text-muted-foreground text-sm" style={{ fontFamily: "monospace" }}>{org.id}</p>
      </div>

      <Tabs defaultValue="projects">
        <TabsList className="flex-wrap">
          <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="grants">Granted ({grants.length})</TabsTrigger>
          <TabsTrigger value="domains">Domains ({domains.length})</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {projects.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No projects</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead className="hidden sm:table-cell">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <Link to={`/projects/${p.id}`} className="font-medium hover:underline">{p.name}</Link>
                        </TableCell>
                        <TableCell><Badge variant={fmtState(p.state).variant as any}>{fmtState(p.state).label}</Badge></TableCell>
                        <TableCell className="hidden sm:table-cell">{fmtDate(p.details?.creationDate)}</TableCell>
                      </TableRow>
                    ))}
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
                <div className="text-center py-4 text-muted-foreground">No granted projects</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Role Keys</TableHead>
                      <TableHead>State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grants.map((g: any, i: number) => (
                      <TableRow key={`${g.projectId}-${i}`}>
                        <TableCell>
                          <Link to={`/projects/${g.projectId}`} className="font-medium hover:underline">{g.projectId}</Link>
                        </TableCell>
                        <TableCell className="text-sm">{(g.roleKeys ?? []).join(", ") || "-"}</TableCell>
                        <TableCell><Badge variant={fmtState(g.state).variant as any}>{fmtState(g.state).label}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {domains.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No domains</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Primary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {domains.map((d: any) => (
                      <TableRow key={d.domain}>
                        <TableCell className="font-medium">{d.domain}</TableCell>
                        <TableCell>{d.isVerified ? "Yes" : "No"}</TableCell>
                        <TableCell>{d.isPrimary ? "Yes" : "No"}</TableCell>
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
              <Field label="Org ID" value={org.id} mono />
              <Field label="Primary Domain" value={org.primaryDomain} />
              <Field label="Created" value={fmtDate(org.details?.creationDate)} />
              <Field label="Changed" value={fmtDate(org.details?.changeDate)} />
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
