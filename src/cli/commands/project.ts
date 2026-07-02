import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function projectCommand(cmd: Command): void {
  cmd
    .command("list")
    .option("--limit <n>", "", "50")
    .action(async (opts) => {
      try {
        const res = await getClients().project.listProjects({ pagination: { limit: Number(opts.limit) } });
        printResult(res.projects ?? []);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("get <id>")
    .action(async (id) => {
      try {
        const res = await getClients().project.getProject({ id });
        printResult(res.project);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("delete <id>")
    .option("--confirm")
    .action(async (id, opts) => {
      if (!opts.confirm) { console.error("Use --confirm"); return; }
      try {
        const res = await getClients().project.deleteProject({ id });
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("deactivate <id>")
    .action(async (id) => {
      try {
        const res = await getClients().project.deactivateProject({ id });
        printResult(res);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("activate <id>")
    .action(async (id) => {
      try {
        const res = await getClients().project.activateProject({ id });
        printResult(res);
      } catch (e) { handleError(e); }
    });
}
