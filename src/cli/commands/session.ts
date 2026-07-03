import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListSessionsRequestSchema, GetSessionRequestSchema, DeleteSessionRequestSchema, CreateSessionRequestSchema, SetSessionRequestSchema } from "@zitadel/proto/zitadel/session/v2/session_service_pb.js";
import { printResult, handleError, DESC } from "../../core";
import { getClients } from "../../state";

export function sessionCommand(cmd: Command): void {
  cmd.command("list").description(DESC.session_list).option("--limit <n>", "", "50").action(async (opts) => {
    try {
      const req = create(ListSessionsRequestSchema, { query: { limit: Number(opts.limit) } });
      printResult((await getClients().session.listSessions(req)).sessions ?? []);
    } catch (e) { handleError(e); }
  });
  cmd.command("get <id>").description(DESC.session_get).action(async (id) => {
    try {
      const req = create(GetSessionRequestSchema, { sessionId: id });
      printResult((await getClients().session.getSession(req)).session);
    } catch (e) { handleError(e); }
  });
  cmd.command("delete <id>").description(DESC.session_delete).action(async (id) => {
    try {
      const req = create(DeleteSessionRequestSchema, { sessionId: id });
      printResult(await getClients().session.deleteSession(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("create").description(DESC.session_create).action(async () => {
    try { printResult(await getClients().session.createSession(create(CreateSessionRequestSchema, { metadata: {} }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("set <id>").description(DESC.session_set).requiredOption("--token <token>").action(async (id, opts) => {
    try { printResult(await getClients().session.setSession(create(SetSessionRequestSchema, { sessionId: id, sessionToken: opts.token, metadata: {} }))); }
    catch (e) { handleError(e); }
  });
}
