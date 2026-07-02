import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function featureCommand(cmd: Command): void {
  const sys = cmd.command("system").description("System features");
  sys.command("get").action(async () => {
    try { printResult(await getClients().feature.getSystemFeatures({})); } catch (e) { handleError(e); }
  });
  sys.command("set").requiredOption("--json <json>").action(async (opts) => {
    try { printResult(await getClients().feature.setSystemFeatures(JSON.parse(opts.json))); } catch (e) { handleError(e); }
  });
  sys.command("reset").action(async () => {
    try { printResult(await getClients().feature.resetSystemFeatures({})); } catch (e) { handleError(e); }
  });

  const inst = cmd.command("instance").description("Instance features");
  inst.command("get").action(async () => {
    try { printResult(await getClients().feature.getInstanceFeatures({ inheritance: false })); } catch (e) { handleError(e); }
  });
  inst.command("set").requiredOption("--json <json>").action(async (opts) => {
    try { printResult(await getClients().feature.setInstanceFeatures(JSON.parse(opts.json))); } catch (e) { handleError(e); }
  });
  inst.command("reset").action(async () => {
    try { printResult(await getClients().feature.resetInstanceFeatures({})); } catch (e) { handleError(e); }
  });

  const org = cmd.command("org").description("Organization features");
  org.command("get <id>").action(async (id) => {
    try { printResult(await getClients().feature.getOrganizationFeatures({ organizationId: id, inheritance: false })); } catch (e) { handleError(e); }
  });
  org.command("set <id>").requiredOption("--json <json>").action(async (id, opts) => {
    try { printResult(await getClients().feature.setOrganizationFeatures({ organizationId: id, ...JSON.parse(opts.json) })); } catch (e) { handleError(e); }
  });
  org.command("reset <id>").action(async (id) => {
    try { printResult(await getClients().feature.resetOrganizationFeatures({ organizationId: id })); } catch (e) { handleError(e); }
  });

  const usr = cmd.command("user").description("User features");
  usr.command("get <id>").action(async (id) => {
    try { printResult(await getClients().feature.getUserFeatures({ userId: id, inheritance: false })); } catch (e) { handleError(e); }
  });
  usr.command("set <id>").requiredOption("--json <json>").action(async (id, opts) => {
    try { printResult(await getClients().feature.setUserFeatures({ userId: id, ...JSON.parse(opts.json) })); } catch (e) { handleError(e); }
  });
  usr.command("reset <id>").action(async (id) => {
    try { printResult(await getClients().feature.resetUserFeatures({ userId: id })); } catch (e) { handleError(e); }
  });
}
