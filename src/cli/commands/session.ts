import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function sessionCommand(cmd: Command): void {
  cmd
    .command("list")
    .option("--limit <n>", "", "50")
    .action(async (opts) => {
      try {
        const res = await getClients().session.listSessions({ query: { limit: Number(opts.limit) } });
        printResult(res.sessions ?? []);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("get <id>")
    .action(async (id) => {
      try {
        const res = await getClients().session.getSession({ sessionId: id });
        printResult(res.session);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("delete <id>")
    .action(async (id) => {
      try {
        const res = await getClients().session.deleteSession({ sessionId: id });
        printResult(res);
      } catch (e) { handleError(e); }
    });
}
