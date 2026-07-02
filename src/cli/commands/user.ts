import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function userCommand(cmd: Command): void {
  cmd
    .command("list")
    .option("--org-id <id>")
    .option("--limit <n>", "", "50")
    .action(async (opts) => {
      try {
        const res = await getClients().user.listUsers({ query: { limit: Number(opts.limit) } });
        printResult(res.result ?? []);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("get <id>")
    .action(async (id) => {
      try {
        const res = await getClients().user.getUserByID({ userId: id });
        printResult(res.user);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("delete <id>")
    .action(async (id) => {
      try {
        const res = await getClients().user.deleteUser({ userId: id });
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("deactivate <id>")
    .action(async (id) => {
      try {
        const res = await getClients().user.deactivateUser({ userId: id });
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("reactivate <id>")
    .action(async (id) => {
      try {
        const res = await getClients().user.reactivateUser({ userId: id });
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("lock <id>")
    .action(async (id) => {
      try {
        const res = await getClients().user.lockUser({ userId: id });
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("unlock <id>")
    .action(async (id) => {
      try {
        const res = await getClients().user.unlockUser({ userId: id });
        printResult(res);
      } catch (e) { handleError(e); }
    });
}
