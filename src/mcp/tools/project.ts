import { create } from "@bufbuild/protobuf";
import {
  ListProjectsRequestSchema,
  GetProjectRequestSchema,
  DeleteProjectRequestSchema,
  DeactivateProjectRequestSchema,
  ActivateProjectRequestSchema,
  CreateProjectRequestSchema,
  UpdateProjectRequestSchema,
  AddProjectRoleRequestSchema,
  UpdateProjectRoleRequestSchema,
  RemoveProjectRoleRequestSchema,
  ListProjectRolesRequestSchema,
  CreateProjectGrantRequestSchema,
  UpdateProjectGrantRequestSchema,
  DeleteProjectGrantRequestSchema,
  ActivateProjectGrantRequestSchema,
  DeactivateProjectGrantRequestSchema,
  ListProjectGrantsRequestSchema,
} from "@zitadel/proto/zitadel/project/v2beta/project_service_pb.js";
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import type { ToolFactory } from "../tools";

export const getProjectTools: ToolFactory = (clients) => [
  {
    name: "project_list",
    description: DESC.project_list,
    inputSchema: {
      type: "object" as const,
      properties: { limit: { type: "number", description: "Max results (default 50)" } },
    },
    handler: async (args) => {
      const res = await clients.project.listProjects(create(ListProjectsRequestSchema, { pagination: { limit: Number(args.limit ?? 50) } }));
      return res.projects ?? [];
    },
  },
  {
    name: "project_get",
    description: DESC.project_get,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Project ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      const res = await clients.project.getProject(create(GetProjectRequestSchema, { id: String(args.id) }));
      return res.project;
    },
  },
  {
    name: "project_create",
    description: DESC.project_create,
    inputSchema: {
      type: "object" as const,
      properties: {
        organizationId: { type: "string", description: "Organization ID" },
        name: { type: "string", description: "Project name" },
      },
      required: ["organizationId", "name"],
    },
    handler: async (args) => {
      return await clients.project.createProject(create(CreateProjectRequestSchema, {
        organizationId: String(args.organizationId),
        name: String(args.name),
      }));
    },
  },
  {
    name: "project_update",
    description: DESC.project_update,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Project ID" },
        name: { type: "string", description: "New project name" },
      },
      required: ["id"],
    },
    handler: async (args) => {
      return await clients.project.updateProject(create(UpdateProjectRequestSchema, {
        id: String(args.id),
        name: args.name ? String(args.name) : undefined,
      }));
    },
  },
  {
    name: "project_delete",
    description: DESC.project_delete,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Project ID" },
        confirm: { type: "boolean", description: "Confirmation flag (required)" },
      },
      required: ["id", "confirm"],
    },
    handler: async (args) => {
      if (!args.confirm) throw new Error("Use confirm=true to proceed");
      return await clients.project.deleteProject(create(DeleteProjectRequestSchema, { id: String(args.id) }));
    },
  },
  {
    name: "project_deactivate",
    description: DESC.project_deactivate,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Project ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      return await clients.project.deactivateProject(create(DeactivateProjectRequestSchema, { id: String(args.id) }));
    },
  },
  {
    name: "project_activate",
    description: DESC.project_activate,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Project ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      return await clients.project.activateProject(create(ActivateProjectRequestSchema, { id: String(args.id) }));
    },
  },
  {
    name: "project_role_add",
    description: DESC.project_role_add,
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
        roleKey: { type: "string", description: "Role key" },
        displayName: { type: "string", description: "Role display name" },
      },
      required: ["projectId", "roleKey", "displayName"],
    },
    handler: async (args) => {
      return await clients.project.addProjectRole(create(AddProjectRoleRequestSchema, {
        projectId: String(args.projectId),
        roleKey: String(args.roleKey),
        displayName: String(args.displayName),
      }));
    },
  },
  {
    name: "project_role_update",
    description: DESC.project_role_update,
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
        roleKey: { type: "string", description: "Role key" },
        displayName: { type: "string", description: "New display name" },
      },
      required: ["projectId", "roleKey"],
    },
    handler: async (args) => {
      return await clients.project.updateProjectRole(create(UpdateProjectRoleRequestSchema, {
        projectId: String(args.projectId),
        roleKey: String(args.roleKey),
        displayName: args.displayName ? String(args.displayName) : undefined,
      }));
    },
  },
  {
    name: "project_role_remove",
    description: DESC.project_role_remove,
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
        roleKey: { type: "string", description: "Role key to remove" },
      },
      required: ["projectId", "roleKey"],
    },
    handler: async (args) => {
      return await clients.project.removeProjectRole(create(RemoveProjectRoleRequestSchema, {
        projectId: String(args.projectId),
        roleKey: String(args.roleKey),
      }));
    },
  },
  {
    name: "project_role_list",
    description: DESC.project_role_list,
    inputSchema: {
      type: "object" as const,
      properties: { projectId: { type: "string", description: "Project ID" } },
      required: ["projectId"],
    },
    handler: async (args) => {
      const res = await clients.project.listProjectRoles(create(ListProjectRolesRequestSchema, { projectId: String(args.projectId) }));
      return res.projectRoles ?? [];
    },
  },
  {
    name: "project_grant_create",
    description: DESC.project_grant_create,
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
        grantedOrganizationId: { type: "string", description: "Organization ID to grant to" },
        roleKeys: {
          type: "array",
          items: { type: "string" },
          description: "Comma-separated role keys or array of role keys",
        },
      },
      required: ["projectId", "grantedOrganizationId", "roleKeys"],
    },
    handler: async (args) => {
      const keys = Array.isArray(args.roleKeys) ? args.roleKeys : String(args.roleKeys).split(",");
      return await clients.project.createProjectGrant(create(CreateProjectGrantRequestSchema, {
        projectId: String(args.projectId),
        grantedOrganizationId: String(args.grantedOrganizationId),
        roleKeys: keys.map(String),
      }));
    },
  },
  {
    name: "project_grant_update",
    description: DESC.project_grant_update,
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
        grantedOrganizationId: { type: "string", description: "Granted organization ID" },
        roleKeys: {
          type: "array",
          items: { type: "string" },
          description: "Comma-separated role keys or array of role keys",
        },
      },
      required: ["projectId", "grantedOrganizationId", "roleKeys"],
    },
    handler: async (args) => {
      const keys = Array.isArray(args.roleKeys) ? args.roleKeys : String(args.roleKeys).split(",");
      return await clients.project.updateProjectGrant(create(UpdateProjectGrantRequestSchema, {
        projectId: String(args.projectId),
        grantedOrganizationId: String(args.grantedOrganizationId),
        roleKeys: keys.map(String),
      }));
    },
  },
  {
    name: "project_grant_delete",
    description: DESC.project_grant_delete,
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
        grantedOrganizationId: { type: "string", description: "Granted organization ID" },
        confirm: { type: "boolean", description: "Confirmation flag (required)" },
      },
      required: ["projectId", "grantedOrganizationId", "confirm"],
    },
    handler: async (args) => {
      if (!args.confirm) throw new Error("Use confirm=true to proceed");
      return await clients.project.deleteProjectGrant(create(DeleteProjectGrantRequestSchema, {
        projectId: String(args.projectId),
        grantedOrganizationId: String(args.grantedOrganizationId),
      }));
    },
  },
  {
    name: "project_grant_activate",
    description: DESC.project_grant_activate,
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
        grantedOrganizationId: { type: "string", description: "Granted organization ID" },
      },
      required: ["projectId", "grantedOrganizationId"],
    },
    handler: async (args) => {
      return await clients.project.activateProjectGrant(create(ActivateProjectGrantRequestSchema, {
        projectId: String(args.projectId),
        grantedOrganizationId: String(args.grantedOrganizationId),
      }));
    },
  },
  {
    name: "project_grant_deactivate",
    description: DESC.project_grant_deactivate,
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
        grantedOrganizationId: { type: "string", description: "Granted organization ID" },
      },
      required: ["projectId", "grantedOrganizationId"],
    },
    handler: async (args) => {
      return await clients.project.deactivateProjectGrant(create(DeactivateProjectGrantRequestSchema, {
        projectId: String(args.projectId),
        grantedOrganizationId: String(args.grantedOrganizationId),
      }));
    },
  },
  {
    name: "project_grant_list",
    description: DESC.project_grant_list,
    inputSchema: { type: "object" as const, properties: {} },
    handler: async () => {
      const res = await clients.project.listProjectGrants(create(ListProjectGrantsRequestSchema, { filters: [] }));
      return res.projectGrants ?? [];
    },
  },
];
