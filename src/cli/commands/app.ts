import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListApplicationsRequestSchema, GetApplicationRequestSchema, DeleteApplicationRequestSchema } from "@zitadel/proto/zitadel/app/v2beta/app_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function appCommand(cmd: Command): void {
  cmd.command("list").requiredOption("--project-id <id>").option("--limit <n>", "", "50").action(async (opts) => {
    try {
      const req = create(ListApplicationsRequestSchema, { projectId: opts.projectId, pagination: { limit: Number(opts.limit) } });
      printResult((await getClients().app.listApplications(req)).applications ?? []);
    } catch (e) { handleError(e); }
  });
  cmd.command("get <id>").action(async (id) => {
    try {
      const req = create(GetApplicationRequestSchema, { id });
      printResult((await getClients().app.getApplication(req)).app);
    } catch (e) { handleError(e); }
  });
  cmd.command("delete <id>").requiredOption("--project-id <id>").option("--confirm").action(async (id, opts) => {
    if (!opts.confirm) { console.error("Use --confirm"); return; }
    try {
      const req = create(DeleteApplicationRequestSchema, { id, projectId: opts.projectId });
      printResult(await getClients().app.deleteApplication(req));
    } catch (e) { handleError(e); }
  });
}
