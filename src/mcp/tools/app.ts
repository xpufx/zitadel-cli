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
import { DESC, parseGrantTypes, parseResponseTypes, parseAuthMethodType, parseAppType } from "../../core";
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
        grantTypes: {
          type: "string",
          description: "Comma-separated: authorization_code,refresh_token,device_code,... (default: authorization_code)",
        },
        redirectUris: {
          type: "string",
          description: "Comma-separated redirect URIs",
        },
        postLogoutRedirectUris: {
          type: "string",
          description: "Comma-separated post-logout redirect URIs",
        },
        responseTypes: {
          type: "string",
          description: "Comma-separated: code,id_token,id_token_token (default: code)",
        },
        authMethodType: {
          type: "string",
          enum: ["basic", "post", "none", "private_key_jwt"],
          description: "OIDC auth method type (default: post)",
        },
        appType: {
          type: "string",
          enum: ["web", "user_agent", "native"],
          description: "OIDC application type",
        },
        devMode: {
          type: "boolean",
          description: "Enable development mode (allows non-compliant settings)",
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
          value: {
            redirectUris: args.redirectUris ? String(args.redirectUris).split(",").map((s: string) => s.trim()) : [],
            responseTypes: parseResponseTypes(args.responseTypes as string | undefined),
            grantTypes: parseGrantTypes(args.grantTypes as string | undefined),
            postLogoutRedirectUris: args.postLogoutRedirectUris ? String(args.postLogoutRedirectUris).split(",").map((s: string) => s.trim()) : [],
            authMethodType: parseAuthMethodType(args.authMethodType as string | undefined),
            appType: parseAppType(args.appType as string | undefined),
            devMode: args.devMode === true,
          },
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
        grantTypes: {
          type: "string",
          description: "Comma-separated: authorization_code,refresh_token,device_code,...",
        },
        redirectUris: {
          type: "string",
          description: "Comma-separated redirect URIs (replaces existing)",
        },
        postLogoutRedirectUris: {
          type: "string",
          description: "Comma-separated post-logout redirect URIs (replaces existing)",
        },
        responseTypes: {
          type: "string",
          description: "Comma-separated: code,id_token,id_token_token",
        },
        authMethodType: {
          type: "string",
          enum: ["basic", "post", "none", "private_key_jwt"],
          description: "OIDC auth method type",
        },
        appType: {
          type: "string",
          enum: ["web", "user_agent", "native"],
          description: "OIDC application type",
        },
        devMode: {
          type: "boolean",
          description: "Enable development mode (allows non-compliant settings)",
        },
      },
      required: ["id", "projectId"],
    },
    handler: async (args) => {
      const req: Record<string, unknown> = { id: String(args.id), projectId: String(args.projectId) };
      if (args.name) req.name = String(args.name);
      if (args.grantTypes || args.redirectUris || args.postLogoutRedirectUris || args.responseTypes || args.authMethodType || args.appType || args.devMode !== undefined) {
        const oidc: Record<string, unknown> = {
          grantTypes: parseGrantTypes(args.grantTypes as string | undefined, undefined),
          redirectUris: args.redirectUris ? String(args.redirectUris).split(",").map((s: string) => s.trim()) : [],
          postLogoutRedirectUris: args.postLogoutRedirectUris ? String(args.postLogoutRedirectUris).split(",").map((s: string) => s.trim()) : [],
          responseTypes: parseResponseTypes(args.responseTypes as string | undefined, undefined),
          authMethodType: parseAuthMethodType(args.authMethodType as string | undefined, undefined),
        };
        const appType = parseAppType(args.appType as string | undefined);
        if (appType !== undefined) oidc.appType = appType;
        if (args.devMode !== undefined) oidc.devMode = args.devMode === true;
        req.oidcConfigurationRequest = oidc;
      }
      return await clients.app.updateApplication(create(UpdateApplicationRequestSchema, req));
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
