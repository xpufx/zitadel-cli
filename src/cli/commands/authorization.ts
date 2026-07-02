import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListAuthorizationsRequestSchema, DeleteAuthorizationRequestSchema, ActivateAuthorizationRequestSchema, DeactivateAuthorizationRequestSchema, CreateAuthorizationRequestSchema, UpdateAuthorizationRequestSchema } from "@zitadel/proto/zitadel/authorization/v2beta/authorization_service_pb.js";
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

  cmd.command("create").requiredOption("--user-id <id>").requiredOption("--project-id <id>").requiredOption("--role-keys <keys>").action(async (opts) => {
    try { printResult(await getClients().authorization.createAuthorization(create(CreateAuthorizationRequestSchema, { userId: opts.userId, projectId: opts.projectId, roleKeys: opts.roleKeys.split(",") }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("update <id>").requiredOption("--role-keys <keys>").action(async (id, opts) => {
    try { printResult(await getClients().authorization.updateAuthorization(create(UpdateAuthorizationRequestSchema, { id, roleKeys: opts.roleKeys.split(",") }))); }
    catch (e) { handleError(e); }
  });
}
