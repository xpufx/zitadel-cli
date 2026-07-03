import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { GetGeneralSettingsRequestSchema, GetLoginSettingsRequestSchema, GetBrandingSettingsRequestSchema, GetPasswordComplexitySettingsRequestSchema, GetPasswordExpirySettingsRequestSchema, GetLockoutSettingsRequestSchema, GetDomainSettingsRequestSchema, GetSecuritySettingsRequestSchema, SetSecuritySettingsRequestSchema, GetActiveIdentityProvidersRequestSchema, GetHostedLoginTranslationRequestSchema, SetHostedLoginTranslationRequestSchema } from "@zitadel/proto/zitadel/settings/v2/settings_service_pb.js";
import { printResult, handleError, DESC } from "../../core";
import { getClients } from "../../state";

function ctx(orgId: string | undefined) {
  return { resourceOwner: orgId ? { case: "orgId" as const, value: orgId } : { case: "instance" as const, value: true } };
}

export function settingsCommand(cmd: Command): void {
  cmd.command("general").description(DESC.settings_general).action(async () => {
    try { printResult(await getClients().settings.getGeneralSettings(create(GetGeneralSettingsRequestSchema, {}))); } catch (e) { handleError(e); }
  });
  cmd.command("login").description(DESC.settings_login).option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getLoginSettings(create(GetLoginSettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("branding").description(DESC.settings_branding).option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getBrandingSettings(create(GetBrandingSettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("password-complexity").description(DESC.settings_password_complexity).option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getPasswordComplexitySettings(create(GetPasswordComplexitySettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("password-expiry").description(DESC.settings_password_expiry).option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getPasswordExpirySettings(create(GetPasswordExpirySettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("lockout").description(DESC.settings_lockout).option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getLockoutSettings(create(GetLockoutSettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("domain").description(DESC.settings_domain).option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getDomainSettings(create(GetDomainSettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("security").description(DESC.settings_security).action(async () => {
    try { printResult((await getClients().settings.getSecuritySettings(create(GetSecuritySettingsRequestSchema, {}))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("set-security")
    .description(DESC.settings_set_security)
    .option("--enable-impersonation", "Enable impersonation")
    .option("--embedded-css-url <url>", "Embedded iframe CSS URL")
    .option("--embedded-js-url <url>", "Embedded iframe JS URL")
    .action(async (opts) => {
      try {
        const req: any = { enableImpersonation: opts.enableImpersonation ?? false };
        if (opts.embeddedCssUrl || opts.embeddedJsUrl) {
          req.embeddedIframe = {};
          if (opts.embeddedCssUrl) req.embeddedIframe.cssUrl = opts.embeddedCssUrl;
          if (opts.embeddedJsUrl) req.embeddedIframe.jsUrl = opts.embeddedJsUrl;
        }
        printResult(await getClients().settings.setSecuritySettings(create(SetSecuritySettingsRequestSchema, req)));
      } catch (e) { handleError(e); }
    });
  cmd.command("active-idps").description(DESC.settings_active_idps).option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getActiveIdentityProviders(create(GetActiveIdentityProvidersRequestSchema, { ctx: ctx(opts.orgId) }))).identityProviders ?? []); } catch (e) { handleError(e); }
  });

  const hl = cmd.command("hosted-login").description("Hosted login translations");
  hl.command("get").description(DESC.settings_hosted_login_get).requiredOption("--locale <locale>").action(async (opts) => {
    try {
      const level = { case: "instance" as const, value: true };
      printResult(await getClients().settings.getHostedLoginTranslation(create(GetHostedLoginTranslationRequestSchema, { level, locale: opts.locale })));
    } catch (e) { handleError(e); }
  });
  hl.command("set").description(DESC.settings_hosted_login_set).requiredOption("--locale <locale>").requiredOption("--json <json>").action(async (opts) => {
    try {
      const level = { case: "instance" as const, value: true };
      printResult(await getClients().settings.setHostedLoginTranslation(create(SetHostedLoginTranslationRequestSchema, { level, locale: opts.locale, translations: JSON.parse(opts.json) })));
    } catch (e) { handleError(e); }
  });
}
