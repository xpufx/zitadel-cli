import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function authorizationCommand(cmd: Command): void {
  cmd
    .command("list")
    .option("--limit <n>", "", "50")
    .action(async (opts) => {
      try {
        const res = await getClients().authorization.listAuthorizations({ pagination: { limit: Number(opts.limit) } });
        printResult(res.authorizations ?? []);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("delete <id>")
    .action(async (id) => {
      try {
        const res = await getClients().authorization.deleteAuthorization({ id });
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("activate <id>")
    .action(async (id) => {
      try {
        const res = await getClients().authorization.activateAuthorization({ id });
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("deactivate <id>")
    .action(async (id) => {
      try {
        const res = await getClients().authorization.deactivateAuthorization({ id });
        printResult(res);
      } catch (e) { handleError(e); }
    });
}
