import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useClients } from "@/lib/auth";
import { fmtDate, fmtState } from "@/lib/format";
import { create } from "@bufbuild/protobuf";
import { GetApplicationRequestSchema, ListApplicationsRequestSchema } from "@zitadel/proto/zitadel/app/v2beta/app_service_pb.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const clients = useClients();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    clients.app.getApplication(create(GetApplicationRequestSchema, { id }))
      .then((res) => setApp(res.app))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients, id, projectId]);

  if (loading) return <div className="text-muted-foreground py-8 text-center">Loading application...</div>;
  if (error) return <div className="text-destructive py-8 text-center">{error}</div>;
  if (!app) return <div className="text-center py-8 text-muted-foreground">Application not found</div>;

  const oidc = app.oidc;
  const api = app.api;
  const saml = app.saml;
  const appName = oidc?.name ?? api?.name ?? saml?.name ?? app.id;
  const appState = fmtState(oidc?.state ?? api?.state ?? saml?.state);

  return (
    <div className="space-y-6">
      <div>
        <Link to={projectId ? `/projects/${projectId}` : "/apps"}>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> {projectId ? "Project" : "Apps"}
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold">
          {appName}
          <Badge variant={appState.variant} className="ml-2">{appState.label}</Badge>
        </h2>
        <p className="text-muted-foreground text-sm" style={{ fontFamily: "monospace" }}>{app.id}</p>
      </div>

      <Tabs defaultValue="config">
        <TabsList className="flex-wrap">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              {oidc && (
                <>
                  <Field label="App Type" value={oidc.appType} />
                  <Field label="Auth Method" value={oidc.authMethodType} />
                  <Field label="Dev Mode" value={oidc.devMode ? "Yes" : "No"} />
                  <Field label="Client ID" value={oidc.clientId} mono />
                  <Field label="Redirect URIs" value={(oidc.redirectUris ?? []).join("\n")} />
                  <Field label="Post Logout Redirect" value={(oidc.postLogoutRedirectUris ?? []).join("\n")} />
                  <Field label="Response Types" value={(oidc.responseTypes ?? []).join(", ")} />
                  <Field label="Grant Types" value={(oidc.grantTypes ?? []).join(", ")} />
                </>
              )}
              {api && (
                <>
                  <Field label="App Type" value="API" />
                  <Field label="Auth Method" value={api.authMethodType} />
                </>
              )}
              {saml && (
                <>
                  <Field label="App Type" value="SAML" />
                  <Field label="Entity ID" value={saml.metadataUrl} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Field label="App ID" value={app.id} mono />
              <Field label="Project ID" value={app.projectId} mono />
              <Field label="Created" value={fmtDate(app.details?.creationDate)} />
              <Field label="Changed" value={fmtDate(app.details?.changeDate)} />
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
      <div className={`text-sm whitespace-pre-wrap ${mono ? "font-mono text-xs" : ""}`}>{value || "-"}</div>
    </div>
  );
}
