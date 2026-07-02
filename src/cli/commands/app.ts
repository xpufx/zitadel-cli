import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListApplicationsRequestSchema, GetApplicationRequestSchema, DeleteApplicationRequestSchema, CreateApplicationRequestSchema, UpdateApplicationRequestSchema, DeactivateApplicationRequestSchema, ReactivateApplicationRequestSchema, RegenerateClientSecretRequestSchema, CreateApplicationKeyRequestSchema, DeleteApplicationKeyRequestSchema, GetApplicationKeyRequestSchema, ListApplicationKeysRequestSchema } from "@zitadel/proto/zitadel/app/v2beta/app_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function appCommand(cmd: Command): void {
  cmd.command("list").requiredOption("--project-id <id>").option("--limit <n>", "", "50").action(async (opts) => {
    try { printResult((await getClients().app.listApplications(create(ListApplicationsRequestSchema, { projectId: opts.projectId, pagination: { limit: Number(opts.limit) } }))).applications ?? []); }
    catch (e) { handleError(e); }
  });

  cmd.command("get <id>").action(async (id) => {
    try { printResult((await getClients().app.getApplication(create(GetApplicationRequestSchema, { id }))).app); }
    catch (e) { handleError(e); }
  });

  cmd.command("create").requiredOption("--project-id <id>").requiredOption("--name <name>").option("--type <type>", "oidc, saml, or api", "oidc").action(async (opts) => {
    try {
      const base = { projectId: opts.projectId, id: "", name: opts.name };
      let creationRequestType;
      if (opts.type === "oidc" || opts.type === "api") {
        creationRequestType = { case: "oidcRequest" as const, value: { redirectUris: [], responseTypes: [], grantTypes: [], postLogoutRedirectUris: [], authMethodType: 1 } };
      } else if (opts.type === "saml") {
        creationRequestType = { case: "samlRequest" as const, value: { metadata: { case: "metadataUrl" as const, value: "" } } };
      } else {
        creationRequestType = { case: "apiRequest" as const, value: { authMethodType: 1 } };
      }
      printResult(await getClients().app.createApplication(create(CreateApplicationRequestSchema, { ...base, creationRequestType })));
    } catch (e) { handleError(e); }
  });

  cmd.command("update <id>").requiredOption("--project-id <id>").option("--name <name>").action(async (id, opts) => {
    try { printResult(await getClients().app.updateApplication(create(UpdateApplicationRequestSchema, { id, projectId: opts.projectId, name: opts.name }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("delete <id>").requiredOption("--project-id <id>").option("--confirm").action(async (id, opts) => {
    if (!opts.confirm) { console.error("Use --confirm"); return; }
    try { printResult(await getClients().app.deleteApplication(create(DeleteApplicationRequestSchema, { id, projectId: opts.projectId }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("deactivate <id>").requiredOption("--project-id <id>").action(async (id, opts) => {
    try { printResult(await getClients().app.deactivateApplication(create(DeactivateApplicationRequestSchema, { id, projectId: opts.projectId }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("reactivate <id>").requiredOption("--project-id <id>").action(async (id, opts) => {
    try { printResult(await getClients().app.reactivateApplication(create(ReactivateApplicationRequestSchema, { id, projectId: opts.projectId }))); }
    catch (e) { handleError(e); }
  });

  const sec = cmd.command("secret").description("Manage app secrets");
  sec.command("generate <id>").requiredOption("--project-id <id>").action(async (id, opts) => {
    try { printResult(await getClients().app.regenerateClientSecret(create(RegenerateClientSecretRequestSchema, { applicationId: id, projectId: opts.projectId, appType: { case: "isOidc", value: true } }))); }
    catch (e) { handleError(e); }
  });

  const key = cmd.command("key").description("Manage app keys");
  key.command("create <id>").requiredOption("--project-id <id>").action(async (id, opts) => {
    try { printResult(await getClients().app.createApplicationKey(create(CreateApplicationKeyRequestSchema, { appId: id, projectId: opts.projectId }))); }
    catch (e) { handleError(e); }
  });
  key.command("get <id>").requiredOption("--project-id <id>").requiredOption("--app-id <appId>").action(async (id, opts) => {
    try { printResult((await getClients().app.getApplicationKey(create(GetApplicationKeyRequestSchema, { id, projectId: opts.projectId, applicationId: opts.appId })))); }
    catch (e) { handleError(e); }
  });
  key.command("list").requiredOption("--project-id <id>").action(async (opts) => {
    try { printResult((await getClients().app.listApplicationKeys(create(ListApplicationKeysRequestSchema, { sortingColumn: 0 })))); }
    catch (e) { handleError(e); }
  });
  key.command("delete <id>").requiredOption("--project-id <id>").requiredOption("--app-id <appId>").action(async (id, opts) => {
    try { printResult(await getClients().app.deleteApplicationKey(create(DeleteApplicationKeyRequestSchema, { id, projectId: opts.projectId, applicationId: opts.appId }))); }
    catch (e) { handleError(e); }
  });
}
