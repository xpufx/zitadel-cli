import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListApplicationsRequestSchema, GetApplicationRequestSchema, DeleteApplicationRequestSchema, CreateApplicationRequestSchema, UpdateApplicationRequestSchema, DeactivateApplicationRequestSchema, ReactivateApplicationRequestSchema, RegenerateClientSecretRequestSchema, CreateApplicationKeyRequestSchema, DeleteApplicationKeyRequestSchema, GetApplicationKeyRequestSchema, ListApplicationKeysRequestSchema } from "@zitadel/proto/zitadel/app/v2beta/app_service_pb.js";
import { printResult, handleError, DESC, parseGrantTypes, parseResponseTypes, parseAuthMethodType, parseAppType } from "../../core";
import { getClients } from "../../state";

export function appCommand(cmd: Command): void {
  cmd.command("list").description(DESC.app_list).requiredOption("--project-id <id>").option("--limit <n>", "", "50").action(async (opts) => {
    try { printResult((await getClients().app.listApplications(create(ListApplicationsRequestSchema, { projectId: opts.projectId, pagination: { limit: Number(opts.limit) } }))).applications ?? []); }
    catch (e) { handleError(e); }
  });

  cmd.command("get <id>").description(DESC.app_get).action(async (id) => {
    try { printResult((await getClients().app.getApplication(create(GetApplicationRequestSchema, { id }))).app); }
    catch (e) { handleError(e); }
  });

  cmd.command("create").description(DESC.app_create)
    .requiredOption("--project-id <id>")
    .requiredOption("--name <name>")
    .option("--type <type>", "oidc, saml, or api", "oidc")
    .option("--grant-types <types>", "Comma-separated: authorization_code,refresh_token,device_code,...")
    .option("--redirect-uris <uris>", "Comma-separated redirect URIs")
    .option("--post-logout-redirect-uris <uris>", "Comma-separated post-logout URIs")
    .option("--response-types <types>", "Comma-separated: code,id_token,id_token_token")
    .option("--auth-method-type <type>", "basic, post, none, or private_key_jwt")
    .option("--app-type <type>", "web, user_agent, or native")
    .option("--dev-mode", "Enable development mode (allows non-compliant settings)")
    .action(async (opts) => {
      try {
        const base = { projectId: opts.projectId, id: "", name: opts.name };
        let creationRequestType;
        if (opts.type === "oidc") {
          creationRequestType = {
            case: "oidcRequest" as const,
            value: {
              redirectUris: opts.redirectUris ? opts.redirectUris.split(",").map((s: string) => s.trim()) : [],
              responseTypes: parseResponseTypes(opts.responseTypes),
              grantTypes: parseGrantTypes(opts.grantTypes),
              postLogoutRedirectUris: opts.postLogoutRedirectUris ? opts.postLogoutRedirectUris.split(",").map((s: string) => s.trim()) : [],
              authMethodType: parseAuthMethodType(opts.authMethodType),
              appType: parseAppType(opts.appType),
              devMode: opts.devMode ?? false,
            },
          };
        } else if (opts.type === "saml") {
          creationRequestType = { case: "samlRequest" as const, value: { metadata: { case: "metadataUrl" as const, value: "" } } };
        } else {
          creationRequestType = { case: "apiRequest" as const, value: { authMethodType: 1 } };
        }
        printResult(await getClients().app.createApplication(create(CreateApplicationRequestSchema, { ...base, creationRequestType })));
      } catch (e) { handleError(e); }
    });

  cmd.command("update <id>").description(DESC.app_update)
    .requiredOption("--project-id <id>")
    .option("--name <name>")
    .option("--grant-types <types>", "Comma-separated: authorization_code,refresh_token,device_code,...")
    .option("--redirect-uris <uris>", "Comma-separated redirect URIs")
    .option("--post-logout-redirect-uris <uris>", "Comma-separated post-logout URIs")
    .option("--response-types <types>", "Comma-separated: code,id_token,id_token_token")
    .option("--auth-method-type <type>", "basic, post, none, or private_key_jwt")
    .option("--app-type <type>", "web, user_agent, or native")
    .option("--dev-mode", "Enable development mode (allows non-compliant settings)")
    .action(async (id, opts) => {
      try {
        const req: Record<string, unknown> = { id, projectId: opts.projectId };
        if (opts.name) req.name = opts.name;
        if (opts.grantTypes || opts.redirectUris || opts.postLogoutRedirectUris || opts.responseTypes || opts.authMethodType || opts.appType || opts.devMode !== undefined) {
          const oidc: Record<string, unknown> = {
            grantTypes: parseGrantTypes(opts.grantTypes),
            redirectUris: opts.redirectUris ? opts.redirectUris.split(",").map((s: string) => s.trim()) : [],
            postLogoutRedirectUris: opts.postLogoutRedirectUris ? opts.postLogoutRedirectUris.split(",").map((s: string) => s.trim()) : [],
            responseTypes: parseResponseTypes(opts.responseTypes),
            authMethodType: parseAuthMethodType(opts.authMethodType),
          };
          const appType = parseAppType(opts.appType);
          if (appType !== undefined) oidc.appType = appType;
          if (opts.devMode !== undefined) oidc.devMode = opts.devMode;
          req.oidcConfigurationRequest = oidc;
        }
        printResult(await getClients().app.updateApplication(create(UpdateApplicationRequestSchema, req)));
      } catch (e) { handleError(e); }
    });

  cmd.command("delete <id>").description(DESC.app_delete).requiredOption("--project-id <id>").option("--confirm").action(async (id, opts) => {
    if (!opts.confirm) { console.error("Use --confirm"); return; }
    try { printResult(await getClients().app.deleteApplication(create(DeleteApplicationRequestSchema, { id, projectId: opts.projectId }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("deactivate <id>").description(DESC.app_deactivate).requiredOption("--project-id <id>").action(async (id, opts) => {
    try { printResult(await getClients().app.deactivateApplication(create(DeactivateApplicationRequestSchema, { id, projectId: opts.projectId }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("reactivate <id>").description(DESC.app_reactivate).requiredOption("--project-id <id>").action(async (id, opts) => {
    try { printResult(await getClients().app.reactivateApplication(create(ReactivateApplicationRequestSchema, { id, projectId: opts.projectId }))); }
    catch (e) { handleError(e); }
  });

  const sec = cmd.command("secret").description("Manage app secrets");
  sec.command("generate <id>").description(DESC.app_secret_generate).requiredOption("--project-id <id>").action(async (id, opts) => {
    try { printResult(await getClients().app.regenerateClientSecret(create(RegenerateClientSecretRequestSchema, { applicationId: id, projectId: opts.projectId, appType: { case: "isOidc", value: true } }))); }
    catch (e) { handleError(e); }
  });

  const key = cmd.command("key").description("Manage app keys");
  key.command("create <id>").description(DESC.app_key_create).requiredOption("--project-id <id>").action(async (id, opts) => {
    try { printResult(await getClients().app.createApplicationKey(create(CreateApplicationKeyRequestSchema, { appId: id, projectId: opts.projectId }))); }
    catch (e) { handleError(e); }
  });
  key.command("get <id>").description(DESC.app_key_get).requiredOption("--project-id <id>").requiredOption("--app-id <appId>").action(async (id, opts) => {
    try { printResult((await getClients().app.getApplicationKey(create(GetApplicationKeyRequestSchema, { id, projectId: opts.projectId, applicationId: opts.appId })))); }
    catch (e) { handleError(e); }
  });
  key.command("list").description(DESC.app_key_list).requiredOption("--project-id <id>").action(async (opts) => {
    try { printResult((await getClients().app.listApplicationKeys(create(ListApplicationKeysRequestSchema, { sortingColumn: 0, resourceId: { case: "projectId", value: opts.projectId } })))); }
    catch (e) { handleError(e); }
  });
  key.command("delete <id>").description(DESC.app_key_delete).requiredOption("--project-id <id>").requiredOption("--app-id <appId>").action(async (id, opts) => {
    try { printResult(await getClients().app.deleteApplicationKey(create(DeleteApplicationKeyRequestSchema, { id, projectId: opts.projectId, applicationId: opts.appId }))); }
    catch (e) { handleError(e); }
  });
}
