import { useEffect, useState } from "react";
import { useClients } from "@/lib/auth";
import { create } from "@bufbuild/protobuf";
import { GetPasswordComplexitySettingsRequestSchema, GetLoginSettingsRequestSchema, GetLockoutSettingsRequestSchema, GetDomainSettingsRequestSchema } from "@zitadel/proto/zitadel/settings/v2/settings_service_pb.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsPage() {
  const clients = useClients();
  const [complexity, setComplexity] = useState<any>(null);
  const [loginPolicy, setLoginPolicy] = useState<any>(null);
  const [lockout, setLockout] = useState<any>(null);
  const [domain, setDomain] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      clients.settings.getPasswordComplexitySettings(create(GetPasswordComplexitySettingsRequestSchema, {})),
      clients.settings.getLoginSettings(create(GetLoginSettingsRequestSchema, {})),
      clients.settings.getLockoutSettings(create(GetLockoutSettingsRequestSchema, {})),
      clients.settings.getDomainSettings(create(GetDomainSettingsRequestSchema, {})),
    ]).then(([c, lp, lo, d]) => {
      setComplexity(c.settings);
      setLoginPolicy(lp.settings);
      setLockout(lo.settings);
      setDomain(d.settings);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [clients]);

  if (loading) return <div className="text-muted-foreground py-8 text-center">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Password Complexity</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Field label="Min Length" value={String(complexity?.minLength ?? "-")} />
            <Field label="Has Uppercase" value={complexity?.hasUppercase ? "Yes" : "No"} />
            <Field label="Has Lowercase" value={complexity?.hasLowercase ? "Yes" : "No"} />
            <Field label="Has Number" value={complexity?.hasNumber ? "Yes" : "No"} />
            <Field label="Has Symbol" value={complexity?.hasSymbol ? "Yes" : "No"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Login Policy</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Field label="Allow Username/Password" value={loginPolicy?.allowUsernamePassword ? "Yes" : "No"} />
            <Field label="Allow Register" value={loginPolicy?.allowRegister ? "Yes" : "No"} />
            <Field label="Allow External IDP" value={loginPolicy?.allowExternalIdp ? "Yes" : "No"} />
            <Field label="Force MFA" value={loginPolicy?.forceMfa ? "Yes" : "No"} />
            <Field label="Passwordless Type" value={loginPolicy?.passkeysType} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Lockout Policy</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Field label="Max Password Attempts" value={String(lockout?.maxPasswordAttempts ?? "Unlimited")} />
            <Field label="Max OTP Attempts" value={String(lockout?.maxOtpAttempts ?? "Unlimited")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Domain Settings</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Field label="User Login Must Be Domain" value={domain?.userLoginMustBeDomain ? "Yes" : "No"} />
            <Field label="Domain Verification" value={domain?.domainVerification ? "Enabled" : "Disabled"} />
            <Field label="Disable Organization Discovery" value={domain?.disableOrganizationDiscovery ? "Yes" : "No"} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">{value || "-"}</div>
    </div>
  );
}
