import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListInstancesRequestSchema, GetInstanceRequestSchema, DeleteInstanceRequestSchema, UpdateInstanceRequestSchema, AddCustomDomainRequestSchema, RemoveCustomDomainRequestSchema, ListCustomDomainsRequestSchema, AddTrustedDomainRequestSchema, RemoveTrustedDomainRequestSchema, ListTrustedDomainsRequestSchema } from "@zitadel/proto/zitadel/instance/v2beta/instance_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function instanceCommand(cmd: Command): void {
  cmd.command("list").action(async () => {
    try { printResult((await getClients().instance.listInstances(create(ListInstancesRequestSchema, { queries: [] }))).instances ?? []); }
    catch (e) { handleError(e); }
  });
  cmd.command("get <id>").action(async (id) => {
    try { printResult((await getClients().instance.getInstance(create(GetInstanceRequestSchema, { instanceId: id }))).instance); }
    catch (e) { handleError(e); }
  });
  cmd.command("update <id>").requiredOption("--name <name>").action(async (id, opts) => {
    try { printResult(await getClients().instance.updateInstance(create(UpdateInstanceRequestSchema, { instanceId: id, instanceName: opts.name }))); }
    catch (e) { handleError(e); }
  });
  cmd.command("delete <id>").option("--confirm").action(async (id, opts) => {
    if (!opts.confirm) { console.error("Use --confirm"); return; }
    try { printResult(await getClients().instance.deleteInstance(create(DeleteInstanceRequestSchema, { instanceId: id }))); }
    catch (e) { handleError(e); }
  });

  const domain = cmd.command("domain").description("Manage custom domains");
  domain.command("add <id>").requiredOption("--domain <domain>").action(async (id, opts) => {
    try { printResult(await getClients().instance.addCustomDomain(create(AddCustomDomainRequestSchema, { instanceId: id, domain: opts.domain }))); }
    catch (e) { handleError(e); }
  });
  domain.command("remove <id>").requiredOption("--domain <domain>").action(async (id, opts) => {
    try { printResult(await getClients().instance.removeCustomDomain(create(RemoveCustomDomainRequestSchema, { instanceId: id, domain: opts.domain }))); }
    catch (e) { handleError(e); }
  });
  domain.command("list <id>").action(async (id) => {
    try { printResult((await getClients().instance.listCustomDomains(create(ListCustomDomainsRequestSchema, { instanceId: id }))).domains ?? []); }
    catch (e) { handleError(e); }
  });

  const trusted = cmd.command("trusted-domain").description("Manage trusted domains");
  trusted.command("add <id>").requiredOption("--domain <domain>").action(async (id, opts) => {
    try { printResult(await getClients().instance.addTrustedDomain(create(AddTrustedDomainRequestSchema, { instanceId: id, domain: opts.domain }))); }
    catch (e) { handleError(e); }
  });
  trusted.command("remove <id>").requiredOption("--domain <domain>").action(async (id, opts) => {
    try { printResult(await getClients().instance.removeTrustedDomain(create(RemoveTrustedDomainRequestSchema, { instanceId: id, domain: opts.domain }))); }
    catch (e) { handleError(e); }
  });
  trusted.command("list <id>").action(async (id) => {
    try { printResult((await getClients().instance.listTrustedDomains(create(ListTrustedDomainsRequestSchema, { instanceId: id }))).trustedDomain ?? []); }
    catch (e) { handleError(e); }
  });
}
