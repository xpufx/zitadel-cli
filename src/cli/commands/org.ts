import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { AddOrganizationRequestSchema, ListOrganizationsRequestSchema } from "@zitadel/proto/zitadel/org/v2/org_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function orgCommand(cmd: Command): void {
  cmd.command("create").requiredOption("--name <name>").action(async (opts) => {
    try {
      const req = create(AddOrganizationRequestSchema, { name: opts.name });
      printResult(await getClients().org.addOrganization(req));
    } catch (e) { handleError(e); }
  });
  cmd.command("list").option("--limit <n>", "", "50").action(async (opts) => {
    try {
      const req = create(ListOrganizationsRequestSchema, { query: { limit: Number(opts.limit) } });
      printResult((await getClients().org.listOrganizations(req)).result ?? []);
    } catch (e) { handleError(e); }
  });
}
