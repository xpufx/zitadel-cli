import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { CreateOrganizationRequestSchema, ListOrganizationsRequestSchema, UpdateOrganizationRequestSchema, DeleteOrganizationRequestSchema, ActivateOrganizationRequestSchema, DeactivateOrganizationRequestSchema, AddOrganizationDomainRequestSchema, ListOrganizationDomainsRequestSchema, DeleteOrganizationDomainRequestSchema, GenerateOrganizationDomainValidationRequestSchema, VerifyOrganizationDomainRequestSchema, SetOrganizationMetadataRequestSchema, ListOrganizationMetadataRequestSchema, DeleteOrganizationMetadataRequestSchema } from "@zitadel/proto/zitadel/org/v2beta/org_service_pb.js";
import { printResult, handleError, DESC } from "../../core";
import { getClients } from "../../state";

export function orgCommand(cmd: Command): void {
  cmd.command("create").description(DESC.org_create).requiredOption("--name <name>").action(async (opts) => {
    try { printResult(await getClients().org.createOrganization(create(CreateOrganizationRequestSchema, { name: opts.name }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("list").description(DESC.org_list).option("--limit <n>", "", "50").action(async (opts) => {
    try { printResult((await getClients().org.listOrganizations(create(ListOrganizationsRequestSchema, { sortingColumn: 0, filter: [], pagination: { limit: Number(opts.limit) } }))).organizations ?? []); }
    catch (e) { handleError(e); }
  });

  cmd.command("update <id>").description(DESC.org_update).requiredOption("--name <name>").action(async (id, opts) => {
    try { printResult(await getClients().org.updateOrganization(create(UpdateOrganizationRequestSchema, { id, name: opts.name }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("delete <id>").description(DESC.org_delete).option("--confirm").action(async (id, opts) => {
    if (!opts.confirm) { console.error("Use --confirm"); return; }
    try { printResult(await getClients().org.deleteOrganization(create(DeleteOrganizationRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("activate <id>").description(DESC.org_activate).action(async (id) => {
    try { printResult(await getClients().org.activateOrganization(create(ActivateOrganizationRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("deactivate <id>").description(DESC.org_deactivate).action(async (id) => {
    try { printResult(await getClients().org.deactivateOrganization(create(DeactivateOrganizationRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });

  const domain = cmd.command("domain").description("Manage organization domains");
  domain.command("add <id>").description(DESC.org_domain_add).requiredOption("--domain <domain>").action(async (id, opts) => {
    try { printResult(await getClients().org.addOrganizationDomain(create(AddOrganizationDomainRequestSchema, { organizationId: id, domain: opts.domain }))); }
    catch (e) { handleError(e); }
  });
  domain.command("list <id>").description(DESC.org_domain_list).action(async (id) => {
    try { printResult((await getClients().org.listOrganizationDomains(create(ListOrganizationDomainsRequestSchema, { organizationId: id, filters: [] }))).domains ?? []); }
    catch (e) { handleError(e); }
  });
  domain.command("delete <id>").description(DESC.org_domain_delete).requiredOption("--domain <domain>").action(async (id, opts) => {
    try { printResult(await getClients().org.deleteOrganizationDomain(create(DeleteOrganizationDomainRequestSchema, { organizationId: id, domain: opts.domain }))); }
    catch (e) { handleError(e); }
  });
  domain.command("verify <id>").description(DESC.org_domain_verify).requiredOption("--domain <domain>").action(async (id, opts) => {
    try { printResult(await getClients().org.verifyOrganizationDomain(create(VerifyOrganizationDomainRequestSchema, { organizationId: id, domain: opts.domain }))); }
    catch (e) { handleError(e); }
  });
  domain.command("generate-validation <id>").description(DESC.org_domain_generate_validation).requiredOption("--domain <domain>").requiredOption("--type <type>").action(async (id, opts) => {
    try { printResult(await getClients().org.generateOrganizationDomainValidation(create(GenerateOrganizationDomainValidationRequestSchema, { organizationId: id, domain: opts.domain, type: Number(opts.type) }))); }
    catch (e) { handleError(e); }
  });

  const meta = cmd.command("metadata").description("Manage organization metadata");
  meta.command("set <id>").description(DESC.org_metadata_set).requiredOption("--key <key>").requiredOption("--value <value>").action(async (id, opts) => {
    try { printResult(await getClients().org.setOrganizationMetadata(create(SetOrganizationMetadataRequestSchema, { organizationId: id, metadata: [{ key: opts.key, value: opts.value }] }))); }
    catch (e) { handleError(e); }
  });
  meta.command("list <id>").description(DESC.org_metadata_list).action(async (id) => {
    try { printResult((await getClients().org.listOrganizationMetadata(create(ListOrganizationMetadataRequestSchema, { organizationId: id, filter: [] }))).metadata ?? []); }
    catch (e) { handleError(e); }
  });
  meta.command("delete <id>").description(DESC.org_metadata_delete).requiredOption("--key <key>").action(async (id, opts) => {
    try { printResult(await getClients().org.deleteOrganizationMetadata(create(DeleteOrganizationMetadataRequestSchema, { organizationId: id, keys: [opts.key] }))); }
    catch (e) { handleError(e); }
  });
}
