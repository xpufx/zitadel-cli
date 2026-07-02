import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { GetGeneralSettingsRequestSchema, GetLoginSettingsRequestSchema, GetBrandingSettingsRequestSchema, GetPasswordComplexitySettingsRequestSchema, GetPasswordExpirySettingsRequestSchema, GetLockoutSettingsRequestSchema, GetDomainSettingsRequestSchema, GetSecuritySettingsRequestSchema, SetSecuritySettingsRequestSchema, GetActiveIdentityProvidersRequestSchema, GetHostedLoginTranslationRequestSchema, SetHostedLoginTranslationRequestSchema } from "@zitadel/proto/zitadel/settings/v2/settings_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

function ctx(orgId: string | undefined) {
  return { resourceOwner: orgId ? { case: "orgId" as const, value: orgId } : { case: "instance" as const, value: true } };
}

export function settingsCommand(cmd: Command): void {
  cmd.command("general").action(async () => {
    try { printResult(await getClients().settings.getGeneralSettings(create(GetGeneralSettingsRequestSchema, {}))); } catch (e) { handleError(e); }
  });
  cmd.command("login").option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getLoginSettings(create(GetLoginSettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("branding").option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getBrandingSettings(create(GetBrandingSettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("password-complexity").option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getPasswordComplexitySettings(create(GetPasswordComplexitySettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("password-expiry").option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getPasswordExpirySettings(create(GetPasswordExpirySettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("lockout").option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getLockoutSettings(create(GetLockoutSettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("domain").option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getDomainSettings(create(GetDomainSettingsRequestSchema, { ctx: ctx(opts.orgId) }))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("security").action(async () => {
    try { printResult((await getClients().settings.getSecuritySettings(create(GetSecuritySettingsRequestSchema, {}))).settings); } catch (e) { handleError(e); }
  });
  cmd.command("active-idps").option("--org-id <id>").action(async (opts) => {
    try { printResult((await getClients().settings.getActiveIdentityProviders(create(GetActiveIdentityProvidersRequestSchema, { ctx: ctx(opts.orgId) }))).identityProviders ?? []); } catch (e) { handleError(e); }
  });

  const hl = cmd.command("hosted-login").description("Hosted login translations");
  hl.command("get").requiredOption("--locale <locale>").action(async (opts) => {
    try {
      const level = { case: "instance" as const, value: true };
      printResult(await getClients().settings.getHostedLoginTranslation(create(GetHostedLoginTranslationRequestSchema, { level, locale: opts.locale })));
    } catch (e) { handleError(e); }
  });
  hl.command("set").requiredOption("--locale <locale>").requiredOption("--json <json>").action(async (opts) => {
    try {
      const level = { case: "instance" as const, value: true };
      printResult(await getClients().settings.setHostedLoginTranslation(create(SetHostedLoginTranslationRequestSchema, { level, locale: opts.locale, translations: JSON.parse(opts.json) })));
    } catch (e) { handleError(e); }
  });
}
