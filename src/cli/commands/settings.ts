import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { GetGeneralSettingsRequestSchema, GetLoginSettingsRequestSchema, GetBrandingSettingsRequestSchema, GetPasswordComplexitySettingsRequestSchema, GetPasswordExpirySettingsRequestSchema, GetLockoutSettingsRequestSchema, GetDomainSettingsRequestSchema, GetSecuritySettingsRequestSchema, SetSecuritySettingsRequestSchema, GetActiveIdentityProvidersRequestSchema, GetHostedLoginTranslationRequestSchema, SetHostedLoginTranslationRequestSchema, GetLegalAndSupportSettingsRequestSchema } from "@zitadel/proto/zitadel/settings/v2/settings_service_pb.js";
import {
  UpdateLoginPolicyRequestSchema, GetLoginPolicyRequestSchema,
  UpdatePasswordComplexityPolicyRequestSchema, GetPasswordComplexityPolicyRequestSchema,
  UpdatePasswordAgePolicyRequestSchema, GetPasswordAgePolicyRequestSchema,
  UpdateLockoutPolicyRequestSchema, GetLockoutPolicyRequestSchema,
  UpdateDomainPolicyRequestSchema, GetDomainPolicyRequestSchema,
  UpdateLabelPolicyRequestSchema, GetLabelPolicyRequestSchema,
} from "@zitadel/proto/zitadel/admin_pb.js";
import { printResult, handleError, DESC } from "../../core";
import { getClients } from "../../state";

function ctx(orgId: string | undefined) {
  return { resourceOwner: orgId ? { case: "orgId" as const, value: orgId } : { case: "instance" as const, value: true } };
}

async function readMergeWrite(getReq: any, getMethod: string, updateSchema: any, updateMethod: string, args: Record<string, unknown>): Promise<unknown> {
  const clients = getClients();
  const getter = (clients.admin as any)[getMethod].bind(clients.admin);
  const updater = (clients.admin as any)[updateMethod].bind(clients.admin);
  const current = await getter(getReq);
  const policy = { ...current.policy } as Record<string, unknown>;
  for (const [k, v] of Object.entries(args)) {
    if (v !== undefined) policy[k] = v;
  }
  return await updater(create(updateSchema, policy));
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

  cmd.command("legal-support").description(DESC.settings_legal_support).action(async () => {
    try { printResult(await getClients().settings.getLegalAndSupportSettings(create(GetLegalAndSupportSettingsRequestSchema, {}))); } catch (e) { handleError(e); }
  });

  cmd.command("set-login")
    .description("Update login policy (read-merge-write)")
    .option("--allow-domain-discovery", "Allow domain discovery")
    .option("--no-allow-domain-discovery", "Disallow domain discovery")
    .option("--allow-password", "Allow username/password login")
    .option("--no-allow-password", "Disallow username/password login")
    .option("--allow-register", "Allow self-registration")
    .option("--no-allow-register", "Disallow self-registration")
    .option("--allow-external-idp", "Allow external IDPs")
    .option("--no-allow-external-idp", "Disallow external IDPs")
    .option("--force-mfa", "Force MFA")
    .option("--no-force-mfa", "Don't force MFA")
    .option("--hide-password-reset", "Hide password reset link")
    .option("--no-hide-password-reset", "Show password reset link")
    .option("--ignore-unknown-usernames", "Don't reveal unknown usernames")
    .option("--no-ignore-unknown-usernames", "Reveal unknown usernames")
    .action(async (opts) => {
      try {
        const args: Record<string, boolean> = {};
        if (opts.allowDomainDiscovery !== undefined) args.allowDomainDiscovery = opts.allowDomainDiscovery;
        if (opts.allowPassword !== undefined) args.allowUsernamePassword = opts.allowPassword;
        if (opts.allowRegister !== undefined) args.allowRegister = opts.allowRegister;
        if (opts.allowExternalIdp !== undefined) args.allowExternalIdp = opts.allowExternalIdp;
        if (opts.forceMfa !== undefined) args.forceMfa = opts.forceMfa;
        if (opts.hidePasswordReset !== undefined) args.hidePasswordReset = opts.hidePasswordReset;
        if (opts.ignoreUnknownUsernames !== undefined) args.ignoreUnknownUsernames = opts.ignoreUnknownUsernames;
        printResult(await readMergeWrite(create(GetLoginPolicyRequestSchema, {}), "getLoginPolicy", UpdateLoginPolicyRequestSchema, "updateLoginPolicy", args));
      } catch (e) { handleError(e); }
    });

  cmd.command("set-password-complexity")
    .description("Update password complexity policy (read-merge-write)")
    .option("--min-length <n>", "Minimum password length")
    .option("--has-uppercase", "Require uppercase")
    .option("--no-has-uppercase", "Don't require uppercase")
    .option("--has-lowercase", "Require lowercase")
    .option("--no-has-lowercase", "Don't require lowercase")
    .option("--has-number", "Require numbers")
    .option("--no-has-number", "Don't require numbers")
    .option("--has-symbol", "Require symbols")
    .option("--no-has-symbol", "Don't require symbols")
    .action(async (opts) => {
      try {
        const args: Record<string, unknown> = {};
        if (opts.minLength !== undefined) args.minLength = Number(opts.minLength);
        if (opts.hasUppercase !== undefined) args.hasUppercase = opts.hasUppercase;
        if (opts.hasLowercase !== undefined) args.hasLowercase = opts.hasLowercase;
        if (opts.hasNumber !== undefined) args.hasNumber = opts.hasNumber;
        if (opts.hasSymbol !== undefined) args.hasSymbol = opts.hasSymbol;
        printResult(await readMergeWrite(create(GetPasswordComplexityPolicyRequestSchema, {}), "getPasswordComplexityPolicy", UpdatePasswordComplexityPolicyRequestSchema, "updatePasswordComplexityPolicy", args));
      } catch (e) { handleError(e); }
    });

  cmd.command("set-password-expiry")
    .description("Update password expiry policy (read-merge-write)")
    .option("--max-age-days <n>", "Days until password expires (0 = never)")
    .option("--expire-warn-days <n>", "Days before expiry to warn")
    .action(async (opts) => {
      try {
        const args: Record<string, unknown> = {};
        if (opts.maxAgeDays !== undefined) args.maxAgeDays = Number(opts.maxAgeDays);
        if (opts.expireWarnDays !== undefined) args.expireWarnDays = Number(opts.expireWarnDays);
        printResult(await readMergeWrite(create(GetPasswordAgePolicyRequestSchema, {}), "getPasswordAgePolicy", UpdatePasswordAgePolicyRequestSchema, "updatePasswordAgePolicy", args));
      } catch (e) { handleError(e); }
    });

  cmd.command("set-lockout")
    .description("Update lockout policy (read-merge-write)")
    .option("--max-password-attempts <n>", "Max failed password attempts (0 = unlimited)")
    .option("--max-otp-attempts <n>", "Max failed OTP attempts (0 = unlimited)")
    .action(async (opts) => {
      try {
        const args: Record<string, unknown> = {};
        if (opts.maxPasswordAttempts !== undefined) args.maxPasswordAttempts = Number(opts.maxPasswordAttempts);
        if (opts.maxOtpAttempts !== undefined) args.maxOtpAttempts = Number(opts.maxOtpAttempts);
        printResult(await readMergeWrite(create(GetLockoutPolicyRequestSchema, {}), "getLockoutPolicy", UpdateLockoutPolicyRequestSchema, "updateLockoutPolicy", args));
      } catch (e) { handleError(e); }
    });

  cmd.command("set-domain")
    .description("Update domain policy (read-merge-write)")
    .option("--user-login-must-be-domain", "Username must include domain")
    .option("--no-user-login-must-be-domain", "Username doesn't need domain")
    .option("--validate-org-domains", "Validate org domains")
    .option("--no-validate-org-domains", "Don't validate org domains")
    .option("--smtp-sender-matches-domain", "SMTP sender must match instance domain")
    .option("--no-smtp-sender-matches-domain", "SMTP sender can differ")
    .action(async (opts) => {
      try {
        const args: Record<string, unknown> = {};
        if (opts.userLoginMustBeDomain !== undefined) args.userLoginMustBeDomain = opts.userLoginMustBeDomain;
        if (opts.validateOrgDomains !== undefined) args.validateOrgDomains = opts.validateOrgDomains;
        if (opts.smtpSenderMatchesDomain !== undefined) args.smtpSenderAddressMatchesInstanceDomain = opts.smtpSenderMatchesDomain;
        printResult(await readMergeWrite(create(GetDomainPolicyRequestSchema, {}), "getDomainPolicy", UpdateDomainPolicyRequestSchema, "updateDomainPolicy", args));
      } catch (e) { handleError(e); }
    });

  cmd.command("set-branding")
    .description("Update branding/label policy (read-merge-write)")
    .option("--primary-color <color>", "Primary color hex")
    .option("--background-color <color>", "Background color hex")
    .option("--warn-color <color>", "Warning color hex")
    .option("--font-color <color>", "Font color hex")
    .option("--primary-color-dark <color>", "Dark mode primary color hex")
    .option("--background-color-dark <color>", "Dark mode background color hex")
    .option("--warn-color-dark <color>", "Dark mode warning color hex")
    .option("--font-color-dark <color>", "Dark mode font color hex")
    .option("--hide-login-name-suffix", "Hide login name suffix")
    .option("--no-hide-login-name-suffix", "Show login name suffix")
    .option("--disable-watermark", "Disable watermark")
    .option("--no-disable-watermark", "Enable watermark")
    .option("--theme-mode <n>", "Theme mode (0=auto, 1=light, 2=dark)")
    .action(async (opts) => {
      try {
        const args: Record<string, unknown> = {};
        if (opts.primaryColor !== undefined) args.primaryColor = opts.primaryColor;
        if (opts.backgroundColor !== undefined) args.backgroundColor = opts.backgroundColor;
        if (opts.warnColor !== undefined) args.warnColor = opts.warnColor;
        if (opts.fontColor !== undefined) args.fontColor = opts.fontColor;
        if (opts.primaryColorDark !== undefined) args.primaryColorDark = opts.primaryColorDark;
        if (opts.backgroundColorDark !== undefined) args.backgroundColorDark = opts.backgroundColorDark;
        if (opts.warnColorDark !== undefined) args.warnColorDark = opts.warnColorDark;
        if (opts.fontColorDark !== undefined) args.fontColorDark = opts.fontColorDark;
        if (opts.hideLoginNameSuffix !== undefined) args.hideLoginNameSuffix = opts.hideLoginNameSuffix;
        if (opts.disableWatermark !== undefined) args.disableWatermark = opts.disableWatermark;
        if (opts.themeMode !== undefined) args.themeMode = Number(opts.themeMode);
        printResult(await readMergeWrite(create(GetLabelPolicyRequestSchema, {}), "getLabelPolicy", UpdateLabelPolicyRequestSchema, "updateLabelPolicy", args));
      } catch (e) { handleError(e); }
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
