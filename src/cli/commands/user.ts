import { Command } from "commander";
import { printResult, handleError } from "../../core";
import { getClients } from "../state";

export function userCommand(cmd: Command): void {
  cmd
    .command("list")
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

  const email = cmd.command("email").description("Manage user email");
  email
    .command("set <id>")
    .requiredOption("--email <email>")
    .action(async (id, opts) => {
      try {
        const res = await getClients().user.setEmail({ userId: id, email: opts.email });
        printResult(res);
      } catch (e) { handleError(e); }
    });

  const phone = cmd.command("phone").description("Manage user phone");
  phone
    .command("set <id>")
    .requiredOption("--phone <phone>")
    .action(async (id, opts) => {
      try {
        const res = await getClients().user.setPhone({ userId: id, phone: opts.phone });
        printResult(res);
      } catch (e) { handleError(e); }
    });
  phone
    .command("remove <id>")
    .action(async (id) => {
      try {
        const res = await getClients().user.removePhone({ userId: id });
        printResult(res);
      } catch (e) { handleError(e); }
    });

  const pwd = cmd.command("password").description("Manage user password");
  pwd
    .command("set <id>")
    .requiredOption("--password <password>")
    .action(async (id, opts) => {
      try {
        const res = await getClients().user.setPassword({ userId: id, newPassword: { password: opts.password } });
        printResult(res);
      } catch (e) { handleError(e); }
    });
}
