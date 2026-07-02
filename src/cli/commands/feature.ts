import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { GetSystemFeaturesRequestSchema, ResetSystemFeaturesRequestSchema } from "@zitadel/proto/zitadel/feature/v2/system_pb.js";
import { GetInstanceFeaturesRequestSchema, ResetInstanceFeaturesRequestSchema } from "@zitadel/proto/zitadel/feature/v2/instance_pb.js";
import { GetOrganizationFeaturesRequestSchema, ResetOrganizationFeaturesRequestSchema } from "@zitadel/proto/zitadel/feature/v2/organization_pb.js";
import { GetUserFeaturesRequestSchema, ResetUserFeaturesRequestSchema } from "@zitadel/proto/zitadel/feature/v2/user_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function featureCommand(cmd: Command): void {
  const sys = cmd.command("system").description("System features");
  sys.command("get").action(async () => {
    try { printResult(await getClients().feature.getSystemFeatures(create(GetSystemFeaturesRequestSchema, {}))); } catch (e) { handleError(e); }
  });
  sys.command("reset").action(async () => {
    try { printResult(await getClients().feature.resetSystemFeatures(create(ResetSystemFeaturesRequestSchema, {}))); } catch (e) { handleError(e); }
  });

  const inst = cmd.command("instance").description("Instance features");
  inst.command("get").action(async () => {
    try { printResult(await getClients().feature.getInstanceFeatures(create(GetInstanceFeaturesRequestSchema, { inheritance: false }))); } catch (e) { handleError(e); }
  });
  inst.command("reset").action(async () => {
    try { printResult(await getClients().feature.resetInstanceFeatures(create(ResetInstanceFeaturesRequestSchema, {}))); } catch (e) { handleError(e); }
  });

  const org = cmd.command("org").description("Organization features");
  org.command("get <id>").action(async (id) => {
    try { printResult(await getClients().feature.getOrganizationFeatures(create(GetOrganizationFeaturesRequestSchema, { organizationId: id, inheritance: false }))); } catch (e) { handleError(e); }
  });
  org.command("reset <id>").action(async (id) => {
    try { printResult(await getClients().feature.resetOrganizationFeatures(create(ResetOrganizationFeaturesRequestSchema, { organizationId: id }))); } catch (e) { handleError(e); }
  });

  const usr = cmd.command("user").description("User features");
  usr.command("get <id>").action(async (id) => {
    try { printResult(await getClients().feature.getUserFeatures(create(GetUserFeaturesRequestSchema, { userId: id, inheritance: false }))); } catch (e) { handleError(e); }
  });
  usr.command("reset <id>").action(async (id) => {
    try { printResult(await getClients().feature.resetUserFeatures(create(ResetUserFeaturesRequestSchema, { userId: id }))); } catch (e) { handleError(e); }
  });
}
