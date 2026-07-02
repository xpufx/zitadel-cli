import { Command } from "commander";
import { create } from "@bufbuild/protobuf";
import { ListProjectsRequestSchema, GetProjectRequestSchema, DeleteProjectRequestSchema, DeactivateProjectRequestSchema, ActivateProjectRequestSchema, CreateProjectRequestSchema, UpdateProjectRequestSchema, AddProjectRoleRequestSchema, UpdateProjectRoleRequestSchema, RemoveProjectRoleRequestSchema, ListProjectRolesRequestSchema, CreateProjectGrantRequestSchema, UpdateProjectGrantRequestSchema, DeleteProjectGrantRequestSchema, ActivateProjectGrantRequestSchema, DeactivateProjectGrantRequestSchema, ListProjectGrantsRequestSchema } from "@zitadel/proto/zitadel/project/v2beta/project_service_pb.js";
import { printResult, handleError } from "../../core";
import { getClients } from "../../state";

export function projectCommand(cmd: Command): void {
  cmd.command("list").option("--limit <n>", "", "50").action(async (opts) => {
    try { printResult((await getClients().project.listProjects(create(ListProjectsRequestSchema, { pagination: { limit: Number(opts.limit) } }))).projects ?? []); }
    catch (e) { handleError(e); }
  });

  cmd.command("get <id>").action(async (id) => {
    try { printResult((await getClients().project.getProject(create(GetProjectRequestSchema, { id }))).project); }
    catch (e) { handleError(e); }
  });

  cmd.command("create").requiredOption("--org-id <id>").requiredOption("--name <name>").action(async (opts) => {
    try { printResult(await getClients().project.createProject(create(CreateProjectRequestSchema, { organizationId: opts.orgId, name: opts.name }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("update <id>").option("--name <name>").action(async (id, opts) => {
    try { printResult(await getClients().project.updateProject(create(UpdateProjectRequestSchema, { id, name: opts.name }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("delete <id>").option("--confirm").action(async (id, opts) => {
    if (!opts.confirm) { console.error("Use --confirm"); return; }
    try { printResult(await getClients().project.deleteProject(create(DeleteProjectRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("deactivate <id>").action(async (id) => {
    try { printResult(await getClients().project.deactivateProject(create(DeactivateProjectRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });

  cmd.command("activate <id>").action(async (id) => {
    try { printResult(await getClients().project.activateProject(create(ActivateProjectRequestSchema, { id }))); }
    catch (e) { handleError(e); }
  });

  const role = cmd.command("role").description("Manage project roles");
  role.command("add <id>").requiredOption("--key <key>").requiredOption("--display-name <name>").action(async (id, opts) => {
    try { printResult(await getClients().project.addProjectRole(create(AddProjectRoleRequestSchema, { projectId: id, roleKey: opts.key, displayName: opts.name }))); }
    catch (e) { handleError(e); }
  });
  role.command("update <id> <key>").option("--display-name <name>").action(async (id, key, opts) => {
    try { printResult(await getClients().project.updateProjectRole(create(UpdateProjectRoleRequestSchema, { projectId: id, roleKey: key, displayName: opts.name }))); }
    catch (e) { handleError(e); }
  });
  role.command("remove <id> <key>").action(async (id, key) => {
    try { printResult(await getClients().project.removeProjectRole(create(RemoveProjectRoleRequestSchema, { projectId: id, roleKey: key }))); }
    catch (e) { handleError(e); }
  });
  role.command("list <id>").action(async (id) => {
    try { printResult((await getClients().project.listProjectRoles(create(ListProjectRolesRequestSchema, { projectId: id }))).projectRoles ?? []); }
    catch (e) { handleError(e); }
  });

  const grant = cmd.command("grant").description("Manage project grants");
  grant.command("create <id>").requiredOption("--org-id <id>").requiredOption("--role-keys <keys>").action(async (id, opts) => {
    try { printResult(await getClients().project.createProjectGrant(create(CreateProjectGrantRequestSchema, { projectId: id, grantedOrganizationId: opts.orgId, roleKeys: opts.roleKeys.split(",") }))); }
    catch (e) { handleError(e); }
  });
  grant.command("update <id> <grant-org-id>").requiredOption("--role-keys <keys>").action(async (id, grantOrgId, opts) => {
    try { printResult(await getClients().project.updateProjectGrant(create(UpdateProjectGrantRequestSchema, { projectId: id, grantedOrganizationId: grantOrgId, roleKeys: opts.roleKeys.split(",") }))); }
    catch (e) { handleError(e); }
  });
  grant.command("delete <id> <grant-org-id>").option("--confirm").action(async (id, grantOrgId, opts) => {
    if (!opts.confirm) { console.error("Use --confirm"); return; }
    try { printResult(await getClients().project.deleteProjectGrant(create(DeleteProjectGrantRequestSchema, { projectId: id, grantedOrganizationId: grantOrgId }))); }
    catch (e) { handleError(e); }
  });
  grant.command("activate <id> <grant-org-id>").action(async (id, grantOrgId) => {
    try { printResult(await getClients().project.activateProjectGrant(create(ActivateProjectGrantRequestSchema, { projectId: id, grantedOrganizationId: grantOrgId }))); }
    catch (e) { handleError(e); }
  });
  grant.command("deactivate <id> <grant-org-id>").action(async (id, grantOrgId) => {
    try { printResult(await getClients().project.deactivateProjectGrant(create(DeactivateProjectGrantRequestSchema, { projectId: id, grantedOrganizationId: grantOrgId }))); }
    catch (e) { handleError(e); }
  });
  grant.command("list").action(async () => {
    try { printResult((await getClients().project.listProjectGrants(create(ListProjectGrantsRequestSchema, { filters: [] }))).projectGrants ?? []); }
    catch (e) { handleError(e); }
  });
}
