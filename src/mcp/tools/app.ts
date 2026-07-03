import { create } from "@bufbuild/protobuf";
import {
  ListApplicationsRequestSchema,
  GetApplicationRequestSchema,
  DeleteApplicationRequestSchema,
  CreateApplicationRequestSchema,
  UpdateApplicationRequestSchema,
  DeactivateApplicationRequestSchema,
  ReactivateApplicationRequestSchema,
  RegenerateClientSecretRequestSchema,
  CreateApplicationKeyRequestSchema,
  DeleteApplicationKeyRequestSchema,
  GetApplicationKeyRequestSchema,
  ListApplicationKeysRequestSchema,
} from "@zitadel/proto/zitadel/app/v2beta/app_service_pb.js";
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import type { ToolFactory } from "../tools";

export const getAppTools: ToolFactory = (clients) => [
  {
    name: "app_list",
    description: DESC.app_list,
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
        limit: { type: "number", description: "Max results (default 50)" },
      },
      required: ["projectId"],
    },
    handler: async (args) => {
      const res = await clients.app.listApplications(create(ListApplicationsRequestSchema, {
        projectId: String(args.projectId),
        pagination: { limit: Number(args.limit ?? 50) },
      }));
      return res.applications ?? [];
    },
  },
  {
    name: "app_get",
    description: DESC.app_get,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Application ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      const res = await clients.app.getApplication(create(GetApplicationRequestSchema, { id: String(args.id) }));
      return res.app;
    },
  },
  {
    name: "app_create",
    description: DESC.app_create,
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
        name: { type: "string", description: "Application name" },
        type: {
          type: "string",
          enum: ["oidc", "saml", "api"],
          description: "Application type (default: oidc)",
        },
      },
      required: ["projectId", "name"],
    },
    handler: async (args) => {
      const appType = String(args.type ?? "oidc");
      const base = { projectId: String(args.projectId), id: "", name: String(args.name) };
      let creationRequestType;
      if (appType === "oidc") {
        creationRequestType = {
          case: "oidcRequest" as const,
          value: { redirectUris: [], responseTypes: [], grantTypes: [], postLogoutRedirectUris: [], authMethodType: 1 },
        };
      } else if (appType === "api") {
        creationRequestType = {
          case: "apiRequest" as const,
          value: { authMethodType: 1 },
        };
      } else {
        creationRequestType = {
          case: "samlRequest" as const,
          value: { metadata: { case: "metadataUrl" as const, value: "" } },
        };
      }
      return await clients.app.createApplication(create(CreateApplicationRequestSchema, { ...base, creationRequestType }));
    },
  },
  {
    name: "app_update",
    description: DESC.app_update,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Application ID" },
        projectId: { type: "string", description: "Project ID" },
        name: { type: "string", description: "New name" },
      },
      required: ["id", "projectId"],
    },
    handler: async (args) => {
      return await clients.app.updateApplication(create(UpdateApplicationRequestSchema, {
        id: String(args.id),
        projectId: String(args.projectId),
        name: args.name ? String(args.name) : undefined,
      }));
    },
  },
  {
    name: "app_delete",
    description: DESC.app_delete,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Application ID" },
        projectId: { type: "string", description: "Project ID" },
        confirm: { type: "boolean", description: "Confirmation flag (required)" },
      },
      required: ["id", "projectId", "confirm"],
    },
    handler: async (args) => {
      if (!args.confirm) throw new Error("Use confirm=true to proceed");
      return await clients.app.deleteApplication(create(DeleteApplicationRequestSchema, {
        id: String(args.id),
        projectId: String(args.projectId),
      }));
    },
  },
  {
    name: "app_deactivate",
    description: DESC.app_deactivate,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Application ID" },
        projectId: { type: "string", description: "Project ID" },
      },
      required: ["id", "projectId"],
    },
    handler: async (args) => {
      return await clients.app.deactivateApplication(create(DeactivateApplicationRequestSchema, {
        id: String(args.id),
        projectId: String(args.projectId),
      }));
    },
  },
  {
    name: "app_reactivate",
    description: DESC.app_reactivate,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Application ID" },
        projectId: { type: "string", description: "Project ID" },
      },
      required: ["id", "projectId"],
    },
    handler: async (args) => {
      return await clients.app.reactivateApplication(create(ReactivateApplicationRequestSchema, {
        id: String(args.id),
        projectId: String(args.projectId),
      }));
    },
  },
  {
    name: "app_secret_generate",
    description: DESC.app_secret_generate,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Application ID" },
        projectId: { type: "string", description: "Project ID" },
      },
      required: ["id", "projectId"],
    },
    handler: async (args) => {
      return await clients.app.regenerateClientSecret(create(RegenerateClientSecretRequestSchema, {
        applicationId: String(args.id),
        projectId: String(args.projectId),
        appType: { case: "isOidc" as const, value: true },
      }));
    },
  },
  {
    name: "app_key_create",
    description: DESC.app_key_create,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Application ID" },
        projectId: { type: "string", description: "Project ID" },
      },
      required: ["id", "projectId"],
    },
    handler: async (args) => {
      return await clients.app.createApplicationKey(create(CreateApplicationKeyRequestSchema, {
        appId: String(args.id),
        projectId: String(args.projectId),
      }));
    },
  },
  {
    name: "app_key_get",
    description: DESC.app_key_get,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Key ID" },
        projectId: { type: "string", description: "Project ID" },
        appId: { type: "string", description: "Application ID" },
      },
      required: ["id", "projectId", "appId"],
    },
    handler: async (args) => {
      return await clients.app.getApplicationKey(create(GetApplicationKeyRequestSchema, {
        id: String(args.id),
        projectId: String(args.projectId),
        applicationId: String(args.appId),
      }));
    },
  },
  {
    name: "app_key_list",
    description: DESC.app_key_list,
    inputSchema: {
      type: "object" as const,
      properties: { projectId: { type: "string", description: "Project ID" } },
      required: ["projectId"],
    },
    handler: async (args) => {
      return await clients.app.listApplicationKeys(create(ListApplicationKeysRequestSchema, {
        sortingColumn: 0,
        resourceId: { case: "projectId" as const, value: String(args.projectId) },
      }));
    },
  },
  {
    name: "app_key_delete",
    description: DESC.app_key_delete,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Key ID" },
        projectId: { type: "string", description: "Project ID" },
        appId: { type: "string", description: "Application ID" },
      },
      required: ["id", "projectId", "appId"],
    },
    handler: async (args) => {
      return await clients.app.deleteApplicationKey(create(DeleteApplicationKeyRequestSchema, {
        id: String(args.id),
        projectId: String(args.projectId),
        applicationId: String(args.appId),
      }));
    },
  },
];
