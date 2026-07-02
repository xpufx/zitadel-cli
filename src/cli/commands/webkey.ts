import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function webkeyCommand(cmd: Command): void {
  cmd
    .command("list")
    .action(async () => {
      try {
        const res = await getClients().webkey.listWebKeys({});
        printResult(res.webKeys ?? []);
      } catch (e) { handleError(e); }
    });

  cmd
    .command("activate <id>")
    .action(async (id) => {
      try {
        const res = await getClients().webkey.activateWebKey({ id });
        printResult(res);
      } catch (e) { handleError(e); }
    });
}
