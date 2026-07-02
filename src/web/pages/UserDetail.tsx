import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useClients } from "@/lib/auth";
import { fmtDate, fmtState } from "@/lib/format";
import { create } from "@bufbuild/protobuf";
import { GetUserByIDRequestSchema, ListUserMetadataRequestSchema, ListAuthenticationFactorsRequestSchema, ListAuthenticationMethodTypesRequestSchema, ListPasskeysRequestSchema } from "@zitadel/proto/zitadel/user/v2/user_service_pb.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const clients = useClients();
  const [user, setUser] = useState<any>(null);
  const [meta, setMeta] = useState<any[]>([]);
  const [factors, setFactors] = useState<any[]>([]);
  const [methods, setMethods] = useState<string[]>([]);
  const [passkeys, setPasskeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      clients.user.getUserByID(create(GetUserByIDRequestSchema, { userId: id })),
      clients.user.listUserMetadata(create(ListUserMetadataRequestSchema, { userId: id })),
      clients.user.listAuthenticationFactors(create(ListAuthenticationFactorsRequestSchema, { userId: id })),
      clients.user.listAuthenticationMethodTypes(create(ListAuthenticationMethodTypesRequestSchema, { userId: id })),
      clients.user.listPasskeys(create(ListPasskeysRequestSchema, { userId: id })),
    ]).then(([u, m, f, mt, pk]) => {
      setUser(u.user);
      setMeta(m.metadata ?? []);
      setFactors(f.result ?? []);
      setMethods((mt.authMethodTypes ?? []).map((t: any) => t.toString()));
      setPasskeys(pk.result ?? []);
    }).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    .finally(() => setLoading(false));
  }, [clients, id]);

  if (loading) return <div className="text-muted-foreground py-8 text-center">Loading user...</div>;
  if (error) return <div className="text-destructive py-8 text-center">{error}</div>;
  if (!user) return <div className="text-center py-8 text-muted-foreground">User not found</div>;

  const profile = user.type?.human?.profile;
  const email = user.type?.human?.email;
  const phone = user.type?.human?.phone;
  const s = fmtState(user.state);

  return (
    <div className="space-y-6">
      <div>
        <Link to="/users">
          <Button variant="ghost" size="sm" className="mb-2 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Users
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold">
          {profile?.givenName ?? ""} {profile?.familyName ?? ""}
          <Badge variant={s.variant as any} className="ml-2">{s.label}</Badge>
        </h2>
        <p className="text-muted-foreground text-sm">{user.preferredLoginName ?? user.username}</p>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Field label="User ID" value={user.userId} mono />
            <Field label="Username" value={user.username} />
            <Field label="Preferred Login" value={user.preferredLoginName} />
            {profile && (
              <>
                <Field label="Display Name" value={profile.displayName} />
                <Field label="Nickname" value={profile.nickName} />
                <Field label="Language" value={profile.preferredLanguage} />
                <Field label="Gender" value={profile.gender} />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {email && (
              <>
                <Field label="Email" value={email.email} />
                <Field label="Email Verified" value={email.isVerified ? "Yes" : "No"} />
              </>
            )}
            {phone && (
              <>
                <Field label="Phone" value={phone.phone} />
                <Field label="Phone Verified" value={phone.isVerified ? "Yes" : "No"} />
              </>
            )}
            <Field label="Created" value={fmtDate(user.details?.creationDate)} />
            <Field label="Changed" value={fmtDate(user.details?.changeDate)} />
          </CardContent>
        </Card>

        {meta.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Metadata ({meta.length})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Key</TableHead><TableHead>Value</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {meta.map((m: any) => (
                    <TableRow key={m.key}>
                      <TableCell className="font-medium">{m.key}</TableCell>
                      <TableCell className="font-mono text-xs">{atob(m.value ?? "")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">Authentication</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Field label="Methods" value={methods.length > 0 ? methods.join(", ") : "None"} />
            <Field label="Factors" value={String(factors.length)} />
            {passkeys.length > 0 && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Passkeys ({passkeys.length})</div>
                <ul className="text-sm space-y-1">
                  {passkeys.map((pk: any) => <li key={pk.id}>{pk.name ?? pk.id}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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
