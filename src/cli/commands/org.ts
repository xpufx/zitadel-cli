import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function orgCommand(cmd: Command): void {
  cmd
    .command("create")
    .requiredOption("--name <name>")
    .action(async (opts) => {
      try {
        const res = await getClients().org.addOrganization({ name: opts.name });
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("list")
    .option("--limit <n>", "", "50")
    .action(async (opts) => {
      try {
        const res = await getClients().org.listOrganizations({ query: { limit: Number(opts.limit) } });
        printResult(res.result ?? []);
      } catch (e) { handleError(e); }
    });
}
