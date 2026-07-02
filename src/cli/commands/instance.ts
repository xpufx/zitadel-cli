import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListInstancesRequestSchema, GetInstanceRequestSchema, DeleteInstanceRequestSchema } from "@zitadel/proto/zitadel/instance/v2beta/instance_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function instanceCommand(cmd: Command): void {
  cmd.command("list").action(async () => {
    try { printResult((await getClients().instance.listInstances(create(ListInstancesRequestSchema, { queries: [] }))).instances ?? []); }
    catch (e) { handleError(e); }
  });
  cmd.command("get <id>").action(async (id) => {
    try { printResult((await getClients().instance.getInstance(create(GetInstanceRequestSchema, { instanceId: id }))).instance); }
    catch (e) { handleError(e); }
  });
  cmd.command("delete <id>").option("--confirm").action(async (id, opts) => {
    if (!opts.confirm) { console.error("Use --confirm"); return; }
    try { printResult(await getClients().instance.deleteInstance(create(DeleteInstanceRequestSchema, { instanceId: id }))); }
    catch (e) { handleError(e); }
  });
}
