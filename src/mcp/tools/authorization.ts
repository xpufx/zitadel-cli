import { create } from "@bufbuild/protobuf";
import {
  ListAuthorizationsRequestSchema,
  DeleteAuthorizationRequestSchema,
  ActivateAuthorizationRequestSchema,
  DeactivateAuthorizationRequestSchema,
  CreateAuthorizationRequestSchema,
  UpdateAuthorizationRequestSchema,
} from "@zitadel/proto/zitadel/authorization/v2beta/authorization_service_pb.js";
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import type { ToolFactory } from "../tools";

export const getAuthorizationTools: ToolFactory = (clients) => [
  {
    name: "authorization_list",
    description: DESC.authorization_list,
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Max results (default 50)" },
      },
    },
    handler: async (args) => {
      const req = create(ListAuthorizationsRequestSchema, { pagination: { limit: Number(args.limit ?? 50) } });
      return (await clients.authorization.listAuthorizations(req)).authorizations ?? [];
    },
  },
  {
    name: "authorization_delete",
    description: DESC.authorization_delete,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Authorization ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      return await clients.authorization.deleteAuthorization(create(DeleteAuthorizationRequestSchema, { id: String(args.id) }));
    },
  },
  {
    name: "authorization_activate",
    description: DESC.authorization_activate,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Authorization ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      return await clients.authorization.activateAuthorization(create(ActivateAuthorizationRequestSchema, { id: String(args.id) }));
    },
  },
  {
    name: "authorization_deactivate",
    description: DESC.authorization_deactivate,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Authorization ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      return await clients.authorization.deactivateAuthorization(create(DeactivateAuthorizationRequestSchema, { id: String(args.id) }));
    },
  },
  {
    name: "authorization_create",
    description: DESC.authorization_create,
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        projectId: { type: "string", description: "Project ID" },
        roleKeys: {
          type: "array",
          items: { type: "string" },
          description: "Comma-separated role keys or array of role keys",
        },
      },
      required: ["userId", "projectId", "roleKeys"],
    },
    handler: async (args) => {
      const keys = Array.isArray(args.roleKeys) ? args.roleKeys : String(args.roleKeys).split(",");
      return await clients.authorization.createAuthorization(create(CreateAuthorizationRequestSchema, {
        userId: String(args.userId),
        projectId: String(args.projectId),
        roleKeys: keys.map(String),
      }));
    },
  },
  {
    name: "authorization_update",
    description: DESC.authorization_update,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Authorization ID" },
        roleKeys: {
          type: "array",
          items: { type: "string" },
          description: "Comma-separated role keys or array of role keys",
        },
      },
      required: ["id", "roleKeys"],
    },
    handler: async (args) => {
      const keys = Array.isArray(args.roleKeys) ? args.roleKeys : String(args.roleKeys).split(",");
      return await clients.authorization.updateAuthorization(create(UpdateAuthorizationRequestSchema, {
        id: String(args.id),
        roleKeys: keys.map(String),
      }));
    },
  },
];
