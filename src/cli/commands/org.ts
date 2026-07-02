import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { CreateOrganizationRequestSchema, ListOrganizationsRequestSchema, UpdateOrganizationRequestSchema, DeleteOrganizationRequestSchema, ActivateOrganizationRequestSchema, DeactivateOrganizationRequestSchema, AddOrganizationDomainRequestSchema, ListOrganizationDomainsRequestSchema, DeleteOrganizationDomainRequestSchema, GenerateOrganizationDomainValidationRequestSchema, VerifyOrganizationDomainRequestSchema, SetOrganizationMetadataRequestSchema, ListOrganizationMetadataRequestSchema, DeleteOrganizationMetadataRequestSchema } from "@zitadel/proto/zitadel/org/v2beta/org_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function orgCommand(cmd: Command): void {
  cmd.command("create").requiredOption("--name <name>").action(async (opts) => {
    try { printResult(await getClients().org.createOrganization(create(CreateOrganizationRequestSchema, { name: opts.name }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("list").option("--limit <n>", "", "50").action(async (opts) => {
    try { printResult((await getClients().org.listOrganizations(create(ListOrganizationsRequestSchema, { sortingColumn: 0, filter: [] }))).organizations ?? []); }
    catch (e) { handleError(e); }
  });

  cmd.command("update <id>").requiredOption("--name <name>").action(async (id, opts) => {
    try { printResult(await getClients().org.updateOrganization(create(UpdateOrganizationRequestSchema, { id, name: opts.name }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("delete <id>").option("--confirm").action(async (id, opts) => {
    if (!opts.confirm) { console.error("Use --confirm"); return; }
    try { printResult(await getClients().org.deleteOrganization(create(DeleteOrganizationRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("activate <id>").action(async (id) => {
    try { printResult(await getClients().org.activateOrganization(create(ActivateOrganizationRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("deactivate <id>").action(async (id) => {
    try { printResult(await getClients().org.deactivateOrganization(create(DeactivateOrganizationRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });

  const domain = cmd.command("domain").description("Manage organization domains");
  domain.command("add <id>").requiredOption("--domain <domain>").action(async (id, opts) => {
    try { printResult(await getClients().org.addOrganizationDomain(create(AddOrganizationDomainRequestSchema, { organizationId: id, domain: opts.domain }))); }
    catch (e) { handleError(e); }
  });
  domain.command("list <id>").action(async (id) => {
    try { printResult((await getClients().org.listOrganizationDomains(create(ListOrganizationDomainsRequestSchema, { organizationId: id, filters: [] }))).domains ?? []); }
    catch (e) { handleError(e); }
  });
  domain.command("delete <id>").requiredOption("--domain <domain>").action(async (id, opts) => {
    try { printResult(await getClients().org.deleteOrganizationDomain(create(DeleteOrganizationDomainRequestSchema, { organizationId: id, domain: opts.domain }))); }
    catch (e) { handleError(e); }
  });
  domain.command("verify <id>").requiredOption("--domain <domain>").action(async (id, opts) => {
    try { printResult(await getClients().org.verifyOrganizationDomain(create(VerifyOrganizationDomainRequestSchema, { organizationId: id, domain: opts.domain }))); }
    catch (e) { handleError(e); }
  });
  domain.command("generate-validation <id>").requiredOption("--domain <domain>").requiredOption("--type <type>").action(async (id, opts) => {
    try { printResult(await getClients().org.generateOrganizationDomainValidation(create(GenerateOrganizationDomainValidationRequestSchema, { organizationId: id, domain: opts.domain, type: Number(opts.type) }))); }
    catch (e) { handleError(e); }
  });

  const meta = cmd.command("metadata").description("Manage organization metadata");
  meta.command("set <id>").requiredOption("--key <key>").requiredOption("--value <value>").action(async (id, opts) => {
    try { printResult(await getClients().org.setOrganizationMetadata(create(SetOrganizationMetadataRequestSchema, { organizationId: id, metadata: [{ key: opts.key, value: opts.value }] }))); }
    catch (e) { handleError(e); }
  });
  meta.command("list <id>").action(async (id) => {
    try { printResult((await getClients().org.listOrganizationMetadata(create(ListOrganizationMetadataRequestSchema, { organizationId: id, filter: [] }))).metadata ?? []); }
    catch (e) { handleError(e); }
  });
  meta.command("delete <id>").requiredOption("--key <key>").action(async (id, opts) => {
    try { printResult(await getClients().org.deleteOrganizationMetadata(create(DeleteOrganizationMetadataRequestSchema, { organizationId: id, keys: [opts.key] }))); }
    catch (e) { handleError(e); }
  });
}
