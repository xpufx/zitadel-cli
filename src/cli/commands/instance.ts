import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function instanceCommand(cmd: Command): void {
  cmd
    .command("list")
    .action(async () => {
      try {
        const res = await getClients().instance.listInstances({ queries: [] });
        printResult(res.instances ?? []);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("get <id>")
    .action(async (id) => {
      try {
        const res = await getClients().instance.getInstance({ instanceId: id });
        printResult(res.instance);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("delete <id>")
    .option("--confirm")
    .action(async (id, opts) => {
      if (!opts.confirm) { console.error("Use --confirm"); return; }
      try {
        const res = await getClients().instance.deleteInstance({ instanceId: id });
        printResult(res);
      } catch (e) { handleError(e); }
    });
}
