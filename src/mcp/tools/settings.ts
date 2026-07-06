import { create } from "@bufbuild/protobuf";
import {
  GetGeneralSettingsRequestSchema,
  GetLoginSettingsRequestSchema,
  GetBrandingSettingsRequestSchema,
  GetPasswordComplexitySettingsRequestSchema,
  GetPasswordExpirySettingsRequestSchema,
  GetLockoutSettingsRequestSchema,
  GetDomainSettingsRequestSchema,
  GetSecuritySettingsRequestSchema,
  SetSecuritySettingsRequestSchema,
  GetActiveIdentityProvidersRequestSchema,
  GetHostedLoginTranslationRequestSchema,
  SetHostedLoginTranslationRequestSchema,
} from "@zitadel/proto/zitadel/settings/v2/settings_service_pb.js";
import {
  UpdateLoginPolicyRequestSchema,
  GetLoginPolicyRequestSchema,
  UpdatePasswordComplexityPolicyRequestSchema,
  GetPasswordComplexityPolicyRequestSchema,
  UpdatePasswordAgePolicyRequestSchema,
  GetPasswordAgePolicyRequestSchema,
  UpdateLockoutPolicyRequestSchema,
  GetLockoutPolicyRequestSchema,
  UpdateDomainPolicyRequestSchema,
  GetDomainPolicyRequestSchema,
  UpdateLabelPolicyRequestSchema,
  GetLabelPolicyRequestSchema,
} from "@zitadel/proto/zitadel/admin_pb.js";
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import type { ToolFactory } from "../tools";

function ctx(orgId: string | undefined) {
  return orgId
    ? { resourceOwner: { case: "orgId" as const, value: orgId } }
    : { resourceOwner: { case: "instance" as const, value: true } };
}

async function readMergeWrite<T>(
  clients: ServiceClients,
  schema: any,
  getMethod: string,
  updateMethod: string,
  args: T,
): Promise<unknown> {
  const getter = (clients.admin as any)[getMethod].bind(clients.admin);
  const updater = (clients.admin as any)[updateMethod].bind(clients.admin);
  const current = await getter(schema.get ? create(schema.get, {}) : {});
  const policy = { ...current.policy };
  for (const [k, v] of Object.entries(args as Record<string, unknown>)) {
    if (v !== undefined) policy[k] = v;
  }
  return await updater(create(schema.update, policy));
}

export const getSettingsTools: ToolFactory = (clients) => [
  {
    name: "settings_general",
    description: DESC.settings_general,
    inputSchema: { type: "object" as const, properties: {} },
    handler: async () => {
      return await clients.settings.getGeneralSettings(create(GetGeneralSettingsRequestSchema, {}));
    },
  },
  {
    name: "settings_login",
    description: DESC.settings_login,
    inputSchema: {
      type: "object" as const,
      properties: {
        orgId: { type: "string", description: "Optional organization ID (defaults to instance)" },
      },
    },
    handler: async (args) => {
      const res = await clients.settings.getLoginSettings(create(GetLoginSettingsRequestSchema, { ctx: ctx(args.orgId as string | undefined) }));
      return res.settings;
    },
  },
  {
    name: "settings_branding",
    description: DESC.settings_branding,
    inputSchema: {
      type: "object" as const,
      properties: {
        orgId: { type: "string", description: "Optional organization ID (defaults to instance)" },
      },
    },
    handler: async (args) => {
      const res = await clients.settings.getBrandingSettings(create(GetBrandingSettingsRequestSchema, { ctx: ctx(args.orgId as string | undefined) }));
      return res.settings;
    },
  },
  {
    name: "settings_password_complexity",
    description: DESC.settings_password_complexity,
    inputSchema: {
      type: "object" as const,
      properties: {
        orgId: { type: "string", description: "Optional organization ID (defaults to instance)" },
      },
    },
    handler: async (args) => {
      const res = await clients.settings.getPasswordComplexitySettings(create(GetPasswordComplexitySettingsRequestSchema, { ctx: ctx(args.orgId as string | undefined) }));
      return res.settings;
    },
  },
  {
    name: "settings_password_expiry",
    description: DESC.settings_password_expiry,
    inputSchema: {
      type: "object" as const,
      properties: {
        orgId: { type: "string", description: "Optional organization ID (defaults to instance)" },
      },
    },
    handler: async (args) => {
      const res = await clients.settings.getPasswordExpirySettings(create(GetPasswordExpirySettingsRequestSchema, { ctx: ctx(args.orgId as string | undefined) }));
      return res.settings;
    },
  },
  {
    name: "settings_lockout",
    description: DESC.settings_lockout,
    inputSchema: {
      type: "object" as const,
      properties: {
        orgId: { type: "string", description: "Optional organization ID (defaults to instance)" },
      },
    },
    handler: async (args) => {
      const res = await clients.settings.getLockoutSettings(create(GetLockoutSettingsRequestSchema, { ctx: ctx(args.orgId as string | undefined) }));
      return res.settings;
    },
  },
  {
    name: "settings_domain",
    description: DESC.settings_domain,
    inputSchema: {
      type: "object" as const,
      properties: {
        orgId: { type: "string", description: "Optional organization ID (defaults to instance)" },
      },
    },
    handler: async (args) => {
      const res = await clients.settings.getDomainSettings(create(GetDomainSettingsRequestSchema, { ctx: ctx(args.orgId as string | undefined) }));
      return res.settings;
    },
  },
  {
    name: "settings_security",
    description: DESC.settings_security,
    inputSchema: { type: "object" as const, properties: {} },
    handler: async () => {
      const res = await clients.settings.getSecuritySettings(create(GetSecuritySettingsRequestSchema, {}));
      return res.settings;
    },
  },
  {
    name: "settings_set_security",
    description: DESC.settings_set_security,
    inputSchema: {
      type: "object" as const,
      properties: {
        enableImpersonation: { type: "boolean", description: "Enable impersonation" },
        embeddedCssUrl: { type: "string", description: "Embedded iframe CSS URL" },
        embeddedJsUrl: { type: "string", description: "Embedded iframe JS URL" },
      },
    },
    handler: async (args) => {
      const req: Record<string, unknown> = { enableImpersonation: args.enableImpersonation ?? false };
      if (args.embeddedCssUrl || args.embeddedJsUrl) {
        req.embeddedIframe = {};
        if (args.embeddedCssUrl) (req.embeddedIframe as Record<string, string>).cssUrl = String(args.embeddedCssUrl);
        if (args.embeddedJsUrl) (req.embeddedIframe as Record<string, string>).jsUrl = String(args.embeddedJsUrl);
      }
      return await clients.settings.setSecuritySettings(create(SetSecuritySettingsRequestSchema, req));
    },
  },
  {
    name: "settings_active_idps",
    description: DESC.settings_active_idps,
    inputSchema: {
      type: "object" as const,
      properties: {
        orgId: { type: "string", description: "Optional organization ID (defaults to instance)" },
      },
    },
    handler: async (args) => {
      const res = await clients.settings.getActiveIdentityProviders(create(GetActiveIdentityProvidersRequestSchema, { ctx: ctx(args.orgId as string | undefined) }));
      return res.identityProviders ?? [];
    },
  },
  {
    name: "settings_hosted_login_get",
    description: DESC.settings_hosted_login_get,
    inputSchema: {
      type: "object" as const,
      properties: {
        locale: { type: "string", description: "Locale (e.g. en, de, fr)" },
      },
      required: ["locale"],
    },
    handler: async (args) => {
      return await clients.settings.getHostedLoginTranslation(create(GetHostedLoginTranslationRequestSchema, {
        level: { case: "instance" as const, value: true },
        locale: String(args.locale),
      }));
    },
  },
  {
    name: "settings_hosted_login_set",
    description: DESC.settings_hosted_login_set,
    inputSchema: {
      type: "object" as const,
      properties: {
        locale: { type: "string", description: "Locale (e.g. en, de, fr)" },
        translations: {
          type: "object",
          description: "JSON object with translation key-value pairs",
        },
      },
      required: ["locale", "translations"],
    },
    handler: async (args) => {
      return await clients.settings.setHostedLoginTranslation(create(SetHostedLoginTranslationRequestSchema, {
        level: { case: "instance" as const, value: true },
        locale: String(args.locale),
        translations: args.translations as Record<string, string>,
      }));
    },
  },
  {
    name: "settings_set_login",
    description: "Update the login policy (read-merge-write, preserves unset fields)",
    inputSchema: {
      type: "object" as const,
      properties: {
        allowDomainDiscovery: { type: "boolean", description: "Match unknown username suffix against org domains" },
        allowUsernamePassword: { type: "boolean", description: "Allow login with username and password" },
        allowRegister: { type: "boolean", description: "Allow self-registration" },
        allowExternalIdp: { type: "boolean", description: "Allow external identity providers" },
        forceMfa: { type: "boolean", description: "Force multi-factor authentication" },
        hidePasswordReset: { type: "boolean", description: "Hide password reset link" },
        ignoreUnknownUsernames: { type: "boolean", description: "Don't reveal unknown usernames" },
      },
    },
    handler: async (args) => {
      const current = await clients.admin.getLoginPolicy(create(GetLoginPolicyRequestSchema, {}));
      const policy = { ...current.policy } as Record<string, unknown>;
      for (const [k, v] of Object.entries(args as Record<string, unknown>)) {
        if (v !== undefined) policy[k] = v;
      }
      return await clients.admin.updateLoginPolicy(create(UpdateLoginPolicyRequestSchema, policy));
    },
  },
  {
    name: "settings_set_password_complexity",
    description: "Update the password complexity policy (read-merge-write, preserves unset fields)",
    inputSchema: {
      type: "object" as const,
      properties: {
        minLength: { type: "number", description: "Minimum password length" },
        hasUppercase: { type: "boolean", description: "Require uppercase letters" },
        hasLowercase: { type: "boolean", description: "Require lowercase letters" },
        hasNumber: { type: "boolean", description: "Require numbers" },
        hasSymbol: { type: "boolean", description: "Require symbols" },
      },
    },
    handler: async (args) => {
      const current = await clients.admin.getPasswordComplexityPolicy(create(GetPasswordComplexityPolicyRequestSchema, {}));
      const policy = { ...current.policy } as Record<string, unknown>;
      for (const [k, v] of Object.entries(args as Record<string, unknown>)) {
        if (v !== undefined) policy[k] = v;
      }
      return await clients.admin.updatePasswordComplexityPolicy(create(UpdatePasswordComplexityPolicyRequestSchema, policy));
    },
  },
  {
    name: "settings_set_password_expiry",
    description: "Update the password expiry (age) policy (read-merge-write, preserves unset fields)",
    inputSchema: {
      type: "object" as const,
      properties: {
        maxAgeDays: { type: "number", description: "Days after which password expires (0 = never)" },
        expireWarnDays: { type: "number", description: "Days before expiry to warn user" },
      },
    },
    handler: async (args) => {
      const current = await clients.admin.getPasswordAgePolicy(create(GetPasswordAgePolicyRequestSchema, {}));
      const policy = { ...current.policy } as Record<string, unknown>;
      for (const [k, v] of Object.entries(args as Record<string, unknown>)) {
        if (v !== undefined) policy[k] = v;
      }
      return await clients.admin.updatePasswordAgePolicy(create(UpdatePasswordAgePolicyRequestSchema, policy));
    },
  },
  {
    name: "settings_set_lockout",
    description: "Update the lockout policy (read-merge-write, preserves unset fields)",
    inputSchema: {
      type: "object" as const,
      properties: {
        maxPasswordAttempts: { type: "number", description: "Max failed password attempts before lockout (0 = unlimited)" },
        maxOtpAttempts: { type: "number", description: "Max failed OTP attempts before lockout (0 = unlimited)" },
      },
    },
    handler: async (args) => {
      const current = await clients.admin.getLockoutPolicy(create(GetLockoutPolicyRequestSchema, {}));
      const policy = { ...current.policy } as Record<string, unknown>;
      for (const [k, v] of Object.entries(args as Record<string, unknown>)) {
        if (v !== undefined) policy[k] = v;
      }
      return await clients.admin.updateLockoutPolicy(create(UpdateLockoutPolicyRequestSchema, policy));
    },
  },
  {
    name: "settings_set_domain",
    description: "Update the domain policy (read-merge-write, preserves unset fields)",
    inputSchema: {
      type: "object" as const,
      properties: {
        userLoginMustBeDomain: { type: "boolean", description: "Username must include domain suffix" },
        validateOrgDomains: { type: "boolean", description: "Validate organization domains" },
        smtpSenderAddressMatchesInstanceDomain: { type: "boolean", description: "SMTP sender must match instance domain" },
      },
    },
    handler: async (args) => {
      const current = await clients.admin.getDomainPolicy(create(GetDomainPolicyRequestSchema, {}));
      const policy = { ...current.policy } as Record<string, unknown>;
      for (const [k, v] of Object.entries(args as Record<string, unknown>)) {
        if (v !== undefined) policy[k] = v;
      }
      return await clients.admin.updateDomainPolicy(create(UpdateDomainPolicyRequestSchema, policy));
    },
  },
  {
    name: "settings_set_branding",
    description: "Update the label/branding policy (read-merge-write, preserves unset fields)",
    inputSchema: {
      type: "object" as const,
      properties: {
        primaryColor: { type: "string", description: "Primary color hex (e.g. #5469d4)" },
        backgroundColor: { type: "string", description: "Background color hex" },
        warnColor: { type: "string", description: "Warning color hex" },
        fontColor: { type: "string", description: "Font color hex" },
        primaryColorDark: { type: "string", description: "Dark mode primary color hex" },
        backgroundColorDark: { type: "string", description: "Dark mode background color hex" },
        warnColorDark: { type: "string", description: "Dark mode warning color hex" },
        fontColorDark: { type: "string", description: "Dark mode font color hex" },
        hideLoginNameSuffix: { type: "boolean", description: "Hide the login name suffix" },
        disableWatermark: { type: "boolean", description: "Disable watermark" },
        themeMode: { type: "number", description: "Theme mode (0=auto, 1=light, 2=dark)" },
      },
    },
    handler: async (args) => {
      const current = await clients.admin.getLabelPolicy(create(GetLabelPolicyRequestSchema, {}));
      const policy = { ...current.policy } as Record<string, unknown>;
      for (const [k, v] of Object.entries(args as Record<string, unknown>)) {
        if (v !== undefined) policy[k] = v;
      }
      return await clients.admin.updateLabelPolicy(create(UpdateLabelPolicyRequestSchema, policy));
    },
  },
];
