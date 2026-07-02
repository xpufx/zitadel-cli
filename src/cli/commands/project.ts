import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListProjectsRequestSchema, GetProjectRequestSchema, DeleteProjectRequestSchema, DeactivateProjectRequestSchema, ActivateProjectRequestSchema } from "@zitadel/proto/zitadel/project/v2beta/project_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function projectCommand(cmd: Command): void {
  cmd.command("list").option("--limit <n>", "", "50").action(async (opts) => {
    try {
      const req = create(ListProjectsRequestSchema, { pagination: { limit: Number(opts.limit) } });
      printResult((await getClients().project.listProjects(req)).projects ?? []);
    } catch (e) { handleError(e); }
  });
  cmd.command("get <id>").action(async (id) => {
    try {
      const req = create(GetProjectRequestSchema, { id });
      printResult((await getClients().project.getProject(req)).project);
    } catch (e) { handleError(e); }
  });
  cmd.command("delete <id>").option("--confirm").action(async (id, opts) => {
    if (!opts.confirm) { console.error("Use --confirm"); return; }
    try {
      const req = create(DeleteProjectRequestSchema, { id });
      printResult(await getClients().project.deleteProject(req));
    } catch (e) { handleError(e); }
  });
  cmd.command("deactivate <id>").action(async (id) => {
    try {
      const req = create(DeactivateProjectRequestSchema, { id });
      printResult(await getClients().project.deactivateProject(req));
    } catch (e) { handleError(e); }
  });
  cmd.command("activate <id>").action(async (id) => {
    try {
      const req = create(ActivateProjectRequestSchema, { id });
      printResult(await getClients().project.activateProject(req));
    } catch (e) { handleError(e); }
  });
}
