import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListAuthorizationsRequestSchema, DeleteAuthorizationRequestSchema, ActivateAuthorizationRequestSchema, DeactivateAuthorizationRequestSchema } from "@zitadel/proto/zitadel/authorization/v2beta/authorization_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function authorizationCommand(cmd: Command): void {
  cmd.command("list").option("--limit <n>", "", "50").action(async (opts) => {
    try {
      const req = create(ListAuthorizationsRequestSchema, { pagination: { limit: Number(opts.limit) } });
      printResult((await getClients().authorization.listAuthorizations(req)).authorizations ?? []);
    } catch (e) { handleError(e); }
  });
  cmd.command("delete <id>").action(async (id) => {
    try { printResult(await getClients().authorization.deleteAuthorization(create(DeleteAuthorizationRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });
  cmd.command("activate <id>").action(async (id) => {
    try { printResult(await getClients().authorization.activateAuthorization(create(ActivateAuthorizationRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });
  cmd.command("deactivate <id>").action(async (id) => {
    try { printResult(await getClients().authorization.deactivateAuthorization(create(DeactivateAuthorizationRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });
}
