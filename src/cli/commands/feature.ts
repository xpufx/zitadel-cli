import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { GetSystemFeaturesRequestSchema, ResetSystemFeaturesRequestSchema, SetSystemFeaturesRequestSchema } from "@zitadel/proto/zitadel/feature/v2/system_pb.js";
import { GetInstanceFeaturesRequestSchema, ResetInstanceFeaturesRequestSchema, SetInstanceFeaturesRequestSchema } from "@zitadel/proto/zitadel/feature/v2/instance_pb.js";
import { GetOrganizationFeaturesRequestSchema, ResetOrganizationFeaturesRequestSchema, SetOrganizationFeaturesRequestSchema } from "@zitadel/proto/zitadel/feature/v2/organization_pb.js";
import { GetUserFeaturesRequestSchema, ResetUserFeaturesRequestSchema, SetUserFeatureRequestSchema } from "@zitadel/proto/zitadel/feature/v2/user_pb.js";
import { printResult, handleError, DESC } from "../../core";
import { getClients } from "../../state";

export function featureCommand(cmd: Command): void {
  const sys = cmd.command("system").description("System features");
  sys.command("get").description(DESC.feature_system_get).action(async () => {
    try { printResult(await getClients().feature.getSystemFeatures(create(GetSystemFeaturesRequestSchema, {}))); } catch (e) { handleError(e); }
  });
  sys.command("reset").description(DESC.feature_system_reset).action(async () => {
    try { printResult(await getClients().feature.resetSystemFeatures(create(ResetSystemFeaturesRequestSchema, {}))); } catch (e) { handleError(e); }
  });
  sys.command("set")
    .description(DESC.feature_system_set)
    .requiredOption("--json <json>", "JSON object with feature flags")
    .action(async (opts) => {
      try {
        const json = JSON.parse(opts.json);
        printResult(await getClients().feature.setSystemFeatures(create(SetSystemFeaturesRequestSchema, json)));
      } catch (e) { handleError(e); }
    });

  const inst = cmd.command("instance").description("Instance features");
  inst.command("get").description(DESC.feature_instance_get).action(async () => {
    try { printResult(await getClients().feature.getInstanceFeatures(create(GetInstanceFeaturesRequestSchema, { inheritance: false }))); } catch (e) { handleError(e); }
  });
  inst.command("reset").description(DESC.feature_instance_reset).action(async () => {
    try { printResult(await getClients().feature.resetInstanceFeatures(create(ResetInstanceFeaturesRequestSchema, {}))); } catch (e) { handleError(e); }
  });
  inst.command("set")
    .description(DESC.feature_instance_set)
    .requiredOption("--json <json>", "JSON object with feature flags")
    .action(async (opts) => {
      try {
        const json = JSON.parse(opts.json);
        printResult(await getClients().feature.setInstanceFeatures(create(SetInstanceFeaturesRequestSchema, json)));
      } catch (e) { handleError(e); }
    });

  const org = cmd.command("org").description("Organization features");
  org.command("get <id>").description(DESC.feature_org_get).action(async (id) => {
    try { printResult(await getClients().feature.getOrganizationFeatures(create(GetOrganizationFeaturesRequestSchema, { organizationId: id, inheritance: false }))); } catch (e) { handleError(e); }
  });
  org.command("reset <id>").description(DESC.feature_org_reset).action(async (id) => {
    try { printResult(await getClients().feature.resetOrganizationFeatures(create(ResetOrganizationFeaturesRequestSchema, { organizationId: id }))); } catch (e) { handleError(e); }
  });
  org.command("set <id>")
    .description(DESC.feature_org_set)
    .requiredOption("--json <json>", "JSON object with feature flags")
    .action(async (id, opts) => {
      try {
        const json = JSON.parse(opts.json);
        printResult(await getClients().feature.setOrganizationFeatures(create(SetOrganizationFeaturesRequestSchema, { ...json, organizationId: id })));
      } catch (e) { handleError(e); }
    });

  const usr = cmd.command("user").description("User features");
  usr.command("get <id>").description(DESC.feature_user_get).action(async (id) => {
    try { printResult(await getClients().feature.getUserFeatures(create(GetUserFeaturesRequestSchema, { userId: id, inheritance: false }))); } catch (e) { handleError(e); }
  });
  usr.command("reset <id>").description(DESC.feature_user_reset).action(async (id) => {
    try { printResult(await getClients().feature.resetUserFeatures(create(ResetUserFeaturesRequestSchema, { userId: id }))); } catch (e) { handleError(e); }
  });
  usr.command("set <id>")
    .description(DESC.feature_user_set)
    .requiredOption("--json <json>", "JSON object with feature flags")
    .action(async (id, opts) => {
      try {
        const json = JSON.parse(opts.json);
        printResult(await getClients().feature.setUserFeatures(create(SetUserFeatureRequestSchema, { ...json, userId: id })));
      } catch (e) { handleError(e); }
    });
}
