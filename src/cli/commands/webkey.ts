import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListWebKeysRequestSchema, ActivateWebKeyRequestSchema, CreateWebKeyRequestSchema, DeleteWebKeyRequestSchema } from "@zitadel/proto/zitadel/webkey/v2/webkey_service_pb.js";
import { printResult, handleError, DESC } from "../../core";
import { getClients } from "../../state";

export function webkeyCommand(cmd: Command): void {
  cmd.command("list").description(DESC.webkey_list).action(async () => {
    try { printResult((await getClients().webkey.listWebKeys(create(ListWebKeysRequestSchema, {}))).webKeys ?? []); }
    catch (e) { handleError(e); }
  });
  cmd.command("activate <id>").description(DESC.webkey_activate).action(async (id) => {
    try { printResult(await getClients().webkey.activateWebKey(create(ActivateWebKeyRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("create").description(DESC.webkey_create).option("--type <type>", "rsa, ecdsa, or ed25519").action(async (opts) => {
    try {
      const req = opts.type === "ecdsa"
        ? create(CreateWebKeyRequestSchema, { key: { case: "ecdsa" as const, value: {} } })
        : opts.type === "ed25519"
        ? create(CreateWebKeyRequestSchema, { key: { case: "ed25519" as const, value: {} } })
        : create(CreateWebKeyRequestSchema, { key: { case: "rsa" as const, value: {} } });
      printResult(await getClients().webkey.createWebKey(req));
    } catch (e) { handleError(e); }
  });

  cmd.command("delete <id>").description(DESC.webkey_delete).action(async (id) => {
    try { printResult(await getClients().webkey.deleteWebKey(create(DeleteWebKeyRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });
}
