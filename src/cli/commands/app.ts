import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function appCommand(cmd: Command): void {
  cmd
    .command("list")
    .requiredOption("--project-id <id>")
    .option("--limit <n>", "", "50")
    .action(async (opts) => {
      try {
        const res = await getClients().app.listApplications({ projectId: opts.projectId, pagination: { limit: Number(opts.limit) } });
        printResult(res.applications ?? []);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("get <id>")
    .action(async (id) => {
      try {
        const res = await getClients().app.getApplication({ id });
        printResult(res.app);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("delete <id>")
    .requiredOption("--project-id <id>")
    .option("--confirm")
    .action(async (id, opts) => {
      if (!opts.confirm) { console.error("Use --confirm"); return; }
      try {
        const res = await getClients().app.deleteApplication({ id, projectId: opts.projectId });
        printResult(res);
      } catch (e) { handleError(e); }
    });
}
