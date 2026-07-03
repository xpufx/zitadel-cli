import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { GetIDPByIDRequestSchema } from "@zitadel/proto/zitadel/idp/v2/idp_service_pb.js";
import { printResult, handleError, DESC } from "../../core";
import { getClients } from "../../state";

export function idpCommand(cmd: Command): void {
  cmd.command("get <id>").description(DESC.idp_get).action(async (id) => {
    try { printResult((await getClients().idp.getIDPByID(create(GetIDPByIDRequestSchema, { id }))).idp); }
    catch (e) { handleError(e); }
  });
}
