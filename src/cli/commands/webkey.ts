import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListWebKeysRequestSchema, ActivateWebKeyRequestSchema } from "@zitadel/proto/zitadel/webkey/v2/webkey_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function webkeyCommand(cmd: Command): void {
  cmd.command("list").action(async () => {
    try { printResult((await getClients().webkey.listWebKeys(create(ListWebKeysRequestSchema, {}))).webKeys ?? []); }
    catch (e) { handleError(e); }
  });
  cmd.command("activate <id>").action(async (id) => {
    try { printResult(await getClients().webkey.activateWebKey(create(ActivateWebKeyRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });
}
