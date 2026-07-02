import { useEffect, useState } from "react";
import { useClients } from "../lib/auth";
import { create } from "@bufbuild/protobuf";
import { GetGeneralSettingsRequestSchema, GetLoginSettingsRequestSchema, GetPasswordComplexitySettingsRequestSchema, GetPasswordExpirySettingsRequestSchema, GetLockoutSettingsRequestSchema, GetSecuritySettingsRequestSchema, GetBrandingSettingsRequestSchema, GetDomainSettingsRequestSchema } from "@zitadel/proto/zitadel/settings/v2/settings_service_pb.js";

export function SettingsPage() {
  const clients = useClients();
  const [general, setGeneral] = useState<any>(null);
  const [login, setLogin] = useState<any>(null);
  const [passwordComplexity, setPasswordComplexity] = useState<any>(null);
  const [passwordExpiry, setPasswordExpiry] = useState<any>(null);
  const [lockout, setLockout] = useState<any>(null);
  const [security, setSecurity] = useState<any>(null);
  const [branding, setBranding] = useState<any>(null);
  const [domain, setDomain] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      clients.settings.getGeneralSettings(create(GetGeneralSettingsRequestSchema, {})),
      clients.settings.getLoginSettings(create(GetLoginSettingsRequestSchema, {})),
      clients.settings.getPasswordComplexitySettings(create(GetPasswordComplexitySettingsRequestSchema, {})),
      clients.settings.getPasswordExpirySettings(create(GetPasswordExpirySettingsRequestSchema, {})),
      clients.settings.getLockoutSettings(create(GetLockoutSettingsRequestSchema, {})),
      clients.settings.getSecuritySettings(create(GetSecuritySettingsRequestSchema, {})),
      clients.settings.getBrandingSettings(create(GetBrandingSettingsRequestSchema, {})),
      clients.settings.getDomainSettings(create(GetDomainSettingsRequestSchema, {})),
    ]).then(([gen, log, pc, pe, lo, sec, br, dom]) => {
      setGeneral(gen);
      setLogin(log.settings);
      setPasswordComplexity(pc.settings);
      setPasswordExpiry(pe.settings);
      setLockout(lo.settings);
      setSecurity(sec.settings);
      setBranding(br.settings);
      setDomain(dom.settings);
    }).catch((e) => setError(e instanceof Error ? e.message : String(e)))
    .finally(() => setLoading(false));
  }, [clients]);

  if (loading) return <div className="loading">Loading settings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Settings</h2>
        <p>Instance-wide configuration</p>
      </div>

      <div className="settings-grid">
        {general && (
          <div className="card">
            <h3>General</h3>
            <div className="detail-field"><div className="label">Default Org ID</div><div className="value" style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{general.defaultOrgId ?? "-"}</div></div>
            <div className="detail-field"><div className="label">Languages</div><div className="value">{(general.supportedLanguages ?? []).join(", ") || "-"}</div></div>
          </div>
        )}

        {login && (
          <div className="card">
            <h3>Login</h3>
            <div className="detail-field"><div className="label">Allow Username</div><div className="value">{login.allowUserNamePassword ? "Yes" : "No"}</div></div>
            <div className="detail-field"><div className="label">Allow Register</div><div className="value">{login.allowRegister ? "Yes" : "No"}</div></div>
            <div className="detail-field"><div className="label">Allow External IDP</div><div className="value">{login.allowExternalIdp ? "Yes" : "No"}</div></div>
            <div className="detail-field"><div className="label">Force MFA</div><div className="value">{login.forceMfa ? "Yes" : "No"}</div></div>
          </div>
        )}

        {passwordComplexity && (
          <div className="card">
            <h3>Password Complexity</h3>
            <div className="detail-field"><div className="label">Min Length</div><div className="value">{passwordComplexity.minLength ?? "-"}</div></div>
            <div className="detail-field"><div className="label">Requires Upper</div><div className="value">{passwordComplexity.hasUppercase ? "Yes" : "No"}</div></div>
            <div className="detail-field"><div className="label">Requires Lower</div><div className="value">{passwordComplexity.hasLowercase ? "Yes" : "No"}</div></div>
            <div className="detail-field"><div className="label">Requires Number</div><div className="value">{passwordComplexity.hasNumber ? "Yes" : "No"}</div></div>
            <div className="detail-field"><div className="label">Requires Symbol</div><div className="value">{passwordComplexity.hasSymbol ? "Yes" : "No"}</div></div>
          </div>
        )}

        {passwordExpiry && (
          <div className="card">
            <h3>Password Expiry</h3>
            <div className="detail-field"><div className="label">Max Age (days)</div><div className="value">{passwordExpiry.maxAgeDays ?? "-"}</div></div>
            <div className="detail-field"><div className="label">Expire Warning (days)</div><div className="value">{passwordExpiry.expireWarnDays ?? "-"}</div></div>
          </div>
        )}

        {lockout && (
          <div className="card">
            <h3>Lockout</h3>
            <div className="detail-field"><div className="label">Max Attempts</div><div className="value">{lockout.maxPasswordAttempts ?? "-"}</div></div>
            <div className="detail-field"><div className="label">Show Lockout</div><div className="value">{lockout.showLockoutFailure ? "Yes" : "No"}</div></div>
          </div>
        )}

        {security && (
          <div className="card">
            <h3>Security</h3>
            <div className="detail-field"><div className="label">Impersonation</div><div className="value">{security.enableImpersonation ? "Enabled" : "Disabled"}</div></div>
          </div>
        )}

        {branding && (
          <div className="card">
            <h3>Branding</h3>
            <div className="detail-field"><div className="label">Theme Mode</div><div className="value">{branding.themeMode ?? "-"}</div></div>
            <div className="detail-field"><div className="label">Font URL</div><div className="value">{branding.fontUrl ?? "-"}</div></div>
          </div>
        )}

        {domain && (
          <div className="card">
            <h3>Domain</h3>
            <div className="detail-field"><div className="label">Org User Must Be Domain</div><div className="value">{domain.orgUserMustBeDomain ? "Yes" : "No"}</div></div>
            <div className="detail-field"><div className="label">Suffix Username</div><div className="value">{domain.suffixUsername ? "Yes" : "No"}</div></div>
          </div>
        )}
      </div>
    </div>
  );
}
