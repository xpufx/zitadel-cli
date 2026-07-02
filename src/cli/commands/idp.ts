import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function idpCommand(cmd: Command): void {
  cmd
    .command("get <id>")
    .action(async (id) => {
      try {
        const res = await getClients().idp.getIDPByID({ id });
        printResult(res.idp);
      } catch (e) { handleError(e); }
    });
}
