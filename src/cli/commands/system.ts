import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function systemCommand(cmd: Command): void {
  cmd
    .command("healthz")
    .description("Check if ZITADEL is running")
    .action(async () => {
      try {
        const res = await getClients().system.healthz({});
        printResult(res);
      } catch (e) { handleError(e); }
    });

  const inst = cmd.command("instance").description("Manage instances (system API)");
  inst
    .command("list")
    .option("--limit <n>", "", "50")
    .option("--offset <n>", "", "0")
    .action(async (opts) => {
      try {
        const res = await getClients().system.listInstances({ query: { limit: Number(opts.limit), offset: BigInt(opts.offset) } });
        printResult(res.result ?? []);
      } catch (e) { handleError(e); }
    });

  inst
    .command("get <id>")
    .action(async (id) => {
      try {
        const res = await getClients().system.getInstance({ instanceId: id });
        printResult(res.instance);
      } catch (e) { handleError(e); }
    });
}
