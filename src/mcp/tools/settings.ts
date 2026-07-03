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
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import type { ToolFactory } from "../tools";

function ctx(orgId: string | undefined) {
  return orgId
    ? { resourceOwner: { case: "orgId" as const, value: orgId } }
    : { resourceOwner: { case: "instance" as const, value: true } };
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
];
