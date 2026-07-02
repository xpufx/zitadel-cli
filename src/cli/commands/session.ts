import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListSessionsRequestSchema, GetSessionRequestSchema, DeleteSessionRequestSchema } from "@zitadel/proto/zitadel/session/v2/session_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function sessionCommand(cmd: Command): void {
  cmd.command("list").option("--limit <n>", "", "50").action(async (opts) => {
    try {
      const req = create(ListSessionsRequestSchema, { query: { limit: Number(opts.limit) } });
      printResult((await getClients().session.listSessions(req)).sessions ?? []);
    } catch (e) { handleError(e); }
  });
  cmd.command("get <id>").action(async (id) => {
    try {
      const req = create(GetSessionRequestSchema, { sessionId: id });
      printResult((await getClients().session.getSession(req)).session);
    } catch (e) { handleError(e); }
  });
  cmd.command("delete <id>").action(async (id) => {
    try {
      const req = create(DeleteSessionRequestSchema, { sessionId: id });
      printResult(await getClients().session.deleteSession(req));
    } catch (e) { handleError(e); }
  });
}
