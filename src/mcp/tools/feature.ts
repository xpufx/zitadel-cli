import { create } from "@bufbuild/protobuf";
import {
  GetSystemFeaturesRequestSchema,
  ResetSystemFeaturesRequestSchema,
  SetSystemFeaturesRequestSchema,
} from "@zitadel/proto/zitadel/feature/v2/system_pb.js";
import {
  GetInstanceFeaturesRequestSchema,
  ResetInstanceFeaturesRequestSchema,
  SetInstanceFeaturesRequestSchema,
} from "@zitadel/proto/zitadel/feature/v2/instance_pb.js";
import {
  GetOrganizationFeaturesRequestSchema,
  ResetOrganizationFeaturesRequestSchema,
  SetOrganizationFeaturesRequestSchema,
} from "@zitadel/proto/zitadel/feature/v2/organization_pb.js";
import {
  GetUserFeaturesRequestSchema,
  ResetUserFeaturesRequestSchema,
  SetUserFeatureRequestSchema,
} from "@zitadel/proto/zitadel/feature/v2/user_pb.js";
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import type { ToolFactory } from "../tools";

export const getFeatureTools: ToolFactory = (clients) => [
  {
    name: "feature_system_get",
    description: DESC.feature_system_get,
    inputSchema: { type: "object" as const, properties: {} },
    handler: async () => {
      return await clients.feature.getSystemFeatures(create(GetSystemFeaturesRequestSchema, {}));
    },
  },
  {
    name: "feature_system_set",
    description: DESC.feature_system_set,
    inputSchema: {
      type: "object" as const,
      properties: {
        json: {
          type: "object",
          description: "JSON object with feature flag fields (use feature_system_get to see schema)",
        },
      },
      required: ["json"],
    },
    handler: async (args) => {
      return await clients.feature.setSystemFeatures(create(SetSystemFeaturesRequestSchema, args.json as Record<string, unknown>));
    },
  },
  {
    name: "feature_system_reset",
    description: DESC.feature_system_reset,
    inputSchema: { type: "object" as const, properties: {} },
    handler: async () => {
      return await clients.feature.resetSystemFeatures(create(ResetSystemFeaturesRequestSchema, {}));
    },
  },
  {
    name: "feature_instance_get",
    description: DESC.feature_instance_get,
    inputSchema: { type: "object" as const, properties: {} },
    handler: async () => {
      return await clients.feature.getInstanceFeatures(create(GetInstanceFeaturesRequestSchema, { inheritance: false }));
    },
  },
  {
    name: "feature_instance_reset",
    description: DESC.feature_instance_reset,
    inputSchema: { type: "object" as const, properties: {} },
    handler: async () => {
      return await clients.feature.resetInstanceFeatures(create(ResetInstanceFeaturesRequestSchema, {}));
    },
  },
  {
    name: "feature_instance_set",
    description: "Set instance feature flags",
    inputSchema: {
      type: "object" as const,
      properties: {
        json: {
          type: "object",
          description: "JSON object with feature flag fields (use feature_instance_get to see schema)",
        },
      },
      required: ["json"],
    },
    handler: async (args) => {
      return await clients.feature.setInstanceFeatures(create(SetInstanceFeaturesRequestSchema, args.json as Record<string, unknown>));
    },
  },
  {
    name: "feature_org_get",
    description: DESC.feature_org_get,
    inputSchema: {
      type: "object" as const,
      properties: { organizationId: { type: "string", description: "Organization ID" } },
      required: ["organizationId"],
    },
    handler: async (args) => {
      return await clients.feature.getOrganizationFeatures(create(GetOrganizationFeaturesRequestSchema, {
        organizationId: String(args.organizationId),
        inheritance: false,
      }));
    },
  },
  {
    name: "feature_org_reset",
    description: DESC.feature_org_reset,
    inputSchema: {
      type: "object" as const,
      properties: { organizationId: { type: "string", description: "Organization ID" } },
      required: ["organizationId"],
    },
    handler: async (args) => {
      return await clients.feature.resetOrganizationFeatures(create(ResetOrganizationFeaturesRequestSchema, {
        organizationId: String(args.organizationId),
      }));
    },
  },
  {
    name: "feature_org_set",
    description: "Set organization feature flags",
    inputSchema: {
      type: "object" as const,
      properties: {
        organizationId: { type: "string", description: "Organization ID" },
        json: {
          type: "object",
          description: "JSON object with feature flag fields (use feature_org_get to see schema)",
        },
      },
      required: ["organizationId", "json"],
    },
    handler: async (args) => {
      const req: Record<string, unknown> = {
        ...(args.json as Record<string, unknown>),
        organizationId: String(args.organizationId),
      };
      return await clients.feature.setOrganizationFeatures(create(SetOrganizationFeaturesRequestSchema, req));
    },
  },
  {
    name: "feature_user_get",
    description: DESC.feature_user_get,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.feature.getUserFeatures(create(GetUserFeaturesRequestSchema, {
        userId: String(args.userId),
        inheritance: false,
      }));
    },
  },
  {
    name: "feature_user_reset",
    description: DESC.feature_user_reset,
    inputSchema: {
      type: "object" as const,
      properties: { userId: { type: "string", description: "User ID" } },
      required: ["userId"],
    },
    handler: async (args) => {
      return await clients.feature.resetUserFeatures(create(ResetUserFeaturesRequestSchema, {
        userId: String(args.userId),
      }));
    },
  },
  {
    name: "feature_user_set",
    description: "Set user feature flags",
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "User ID" },
        json: {
          type: "object",
          description: "JSON object with feature flag fields (use feature_user_get to see schema)",
        },
      },
      required: ["userId", "json"],
    },
    handler: async (args) => {
      const req: Record<string, unknown> = {
        ...(args.json as Record<string, unknown>),
        userId: String(args.userId),
      };
      return await clients.feature.setUserFeatures(create(SetUserFeatureRequestSchema, req));
    },
  },
];
