import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function settingsCommand(cmd: Command): void {
  cmd
    .command("general")
    .description("Get general instance settings")
    .action(async () => {
      try {
        const res = await getClients().settings.getGeneralSettings({});
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("login")
    .option("--org-id <id>")
    .action(async (opts) => {
      try {
        const ctx = { resourceOwner: opts.orgId ? { case: "orgId" as const, value: opts.orgId } : { case: "instance" as const, value: true } };
        const res = await getClients().settings.getLoginSettings({ ctx });
        printResult(res.settings);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("branding")
    .option("--org-id <id>")
    .action(async (opts) => {
      try {
        const ctx = { resourceOwner: opts.orgId ? { case: "orgId" as const, value: opts.orgId } : { case: "instance" as const, value: true } };
        const res = await getClients().settings.getBrandingSettings({ ctx });
        printResult(res.settings);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("password-complexity")
    .option("--org-id <id>")
    .action(async (opts) => {
      try {
        const ctx = { resourceOwner: opts.orgId ? { case: "orgId" as const, value: opts.orgId } : { case: "instance" as const, value: true } };
        const res = await getClients().settings.getPasswordComplexitySettings({ ctx });
        printResult(res.settings);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("password-expiry")
    .option("--org-id <id>")
    .action(async (opts) => {
      try {
        const ctx = { resourceOwner: opts.orgId ? { case: "orgId" as const, value: opts.orgId } : { case: "instance" as const, value: true } };
        const res = await getClients().settings.getPasswordExpirySettings({ ctx });
        printResult(res.settings);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("lockout")
    .option("--org-id <id>")
    .action(async (opts) => {
      try {
        const ctx = { resourceOwner: opts.orgId ? { case: "orgId" as const, value: opts.orgId } : { case: "instance" as const, value: true } };
        const res = await getClients().settings.getLockoutSettings({ ctx });
        printResult(res.settings);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("domain")
    .option("--org-id <id>")
    .action(async (opts) => {
      try {
        const ctx = { resourceOwner: opts.orgId ? { case: "orgId" as const, value: opts.orgId } : { case: "instance" as const, value: true } };
        const res = await getClients().settings.getDomainSettings({ ctx });
        printResult(res.settings);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("security")
    .action(async () => {
      try {
        const res = await getClients().settings.getSecuritySettings({});
        printResult(res.settings);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("active-idps")
    .option("--org-id <id>")
    .action(async (opts) => {
      try {
        const ctx = { resourceOwner: opts.orgId ? { case: "orgId" as const, value: opts.orgId } : { case: "instance" as const, value: true } };
        const res = await getClients().settings.getActiveIdentityProviders({ ctx });
        printResult(res.identityProviders ?? []);
      } catch (e) { handleError(e); }
    });
}
