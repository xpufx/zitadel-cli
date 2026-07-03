import { create } from "@bufbuild/protobuf";
import {
  CreateOrganizationRequestSchema,
  ListOrganizationsRequestSchema,
  UpdateOrganizationRequestSchema,
  DeleteOrganizationRequestSchema,
  ActivateOrganizationRequestSchema,
  DeactivateOrganizationRequestSchema,
  AddOrganizationDomainRequestSchema,
  ListOrganizationDomainsRequestSchema,
  DeleteOrganizationDomainRequestSchema,
  GenerateOrganizationDomainValidationRequestSchema,
  VerifyOrganizationDomainRequestSchema,
  SetOrganizationMetadataRequestSchema,
  ListOrganizationMetadataRequestSchema,
  DeleteOrganizationMetadataRequestSchema,
} from "@zitadel/proto/zitadel/org/v2beta/org_service_pb.js";
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import type { ToolFactory } from "../tools";

export const getOrgTools: ToolFactory = (clients) => [
  {
    name: "org_create",
    description: DESC.org_create,
    inputSchema: {
      type: "object" as const,
      properties: { name: { type: "string", description: "Organization name" } },
      required: ["name"],
    },
    handler: async (args) => {
      return await clients.org.createOrganization(create(CreateOrganizationRequestSchema, { name: String(args.name) }));
    },
  },
  {
    name: "org_list",
    description: DESC.org_list,
    inputSchema: {
      type: "object" as const,
      properties: { limit: { type: "number", description: "Max results (default 50)" } },
    },
    handler: async (args) => {
      const res = await clients.org.listOrganizations(create(ListOrganizationsRequestSchema, {
        sortingColumn: 0,
        filter: [],
        pagination: { limit: Number(args.limit ?? 50) },
      }));
      return res.organizations ?? [];
    },
  },
  {
    name: "org_update",
    description: DESC.org_update,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Organization ID" },
        name: { type: "string", description: "New organization name" },
      },
      required: ["id", "name"],
    },
    handler: async (args) => {
      return await clients.org.updateOrganization(create(UpdateOrganizationRequestSchema, { id: String(args.id), name: String(args.name) }));
    },
  },
  {
    name: "org_delete",
    description: DESC.org_delete,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "Organization ID" },
        confirm: { type: "boolean", description: "Confirmation flag (required)" },
      },
      required: ["id", "confirm"],
    },
    handler: async (args) => {
      if (!args.confirm) throw new Error("Use confirm=true to proceed");
      return await clients.org.deleteOrganization(create(DeleteOrganizationRequestSchema, { id: String(args.id) }));
    },
  },
  {
    name: "org_activate",
    description: DESC.org_activate,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Organization ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      return await clients.org.activateOrganization(create(ActivateOrganizationRequestSchema, { id: String(args.id) }));
    },
  },
  {
    name: "org_deactivate",
    description: DESC.org_deactivate,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Organization ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      return await clients.org.deactivateOrganization(create(DeactivateOrganizationRequestSchema, { id: String(args.id) }));
    },
  },
  {
    name: "org_domain_add",
    description: DESC.org_domain_add,
    inputSchema: {
      type: "object" as const,
      properties: {
        organizationId: { type: "string", description: "Organization ID" },
        domain: { type: "string", description: "Domain name" },
      },
      required: ["organizationId", "domain"],
    },
    handler: async (args) => {
      return await clients.org.addOrganizationDomain(create(AddOrganizationDomainRequestSchema, {
        organizationId: String(args.organizationId),
        domain: String(args.domain),
      }));
    },
  },
  {
    name: "org_domain_list",
    description: DESC.org_domain_list,
    inputSchema: {
      type: "object" as const,
      properties: { organizationId: { type: "string", description: "Organization ID" } },
      required: ["organizationId"],
    },
    handler: async (args) => {
      const res = await clients.org.listOrganizationDomains(create(ListOrganizationDomainsRequestSchema, {
        organizationId: String(args.organizationId),
        filters: [],
      }));
      return res.domains ?? [];
    },
  },
  {
    name: "org_domain_delete",
    description: DESC.org_domain_delete,
    inputSchema: {
      type: "object" as const,
      properties: {
        organizationId: { type: "string", description: "Organization ID" },
        domain: { type: "string", description: "Domain name" },
      },
      required: ["organizationId", "domain"],
    },
    handler: async (args) => {
      return await clients.org.deleteOrganizationDomain(create(DeleteOrganizationDomainRequestSchema, {
        organizationId: String(args.organizationId),
        domain: String(args.domain),
      }));
    },
  },
  {
    name: "org_domain_verify",
    description: DESC.org_domain_verify,
    inputSchema: {
      type: "object" as const,
      properties: {
        organizationId: { type: "string", description: "Organization ID" },
        domain: { type: "string", description: "Domain name" },
      },
      required: ["organizationId", "domain"],
    },
    handler: async (args) => {
      return await clients.org.verifyOrganizationDomain(create(VerifyOrganizationDomainRequestSchema, {
        organizationId: String(args.organizationId),
        domain: String(args.domain),
      }));
    },
  },
  {
    name: "org_domain_generate_validation",
    description: DESC.org_domain_generate_validation,
    inputSchema: {
      type: "object" as const,
      properties: {
        organizationId: { type: "string", description: "Organization ID" },
        domain: { type: "string", description: "Domain name" },
        type: { type: "number", description: "Validation type (0=unspecified, 1=HTTP, 2=DNS)" },
      },
      required: ["organizationId", "domain"],
    },
    handler: async (args) => {
      return await clients.org.generateOrganizationDomainValidation(create(GenerateOrganizationDomainValidationRequestSchema, {
        organizationId: String(args.organizationId),
        domain: String(args.domain),
        type: Number(args.type ?? 1),
      }));
    },
  },
  {
    name: "org_metadata_set",
    description: DESC.org_metadata_set,
    inputSchema: {
      type: "object" as const,
      properties: {
        organizationId: { type: "string", description: "Organization ID" },
        key: { type: "string", description: "Metadata key" },
        value: { type: "string", description: "Metadata value" },
      },
      required: ["organizationId", "key", "value"],
    },
    handler: async (args) => {
      return await clients.org.setOrganizationMetadata(create(SetOrganizationMetadataRequestSchema, {
        organizationId: String(args.organizationId),
        metadata: [{ key: String(args.key), value: new TextEncoder().encode(String(args.value)) }],
      }));
    },
  },
  {
    name: "org_metadata_list",
    description: DESC.org_metadata_list,
    inputSchema: {
      type: "object" as const,
      properties: { organizationId: { type: "string", description: "Organization ID" } },
      required: ["organizationId"],
    },
    handler: async (args) => {
      const res = await clients.org.listOrganizationMetadata(create(ListOrganizationMetadataRequestSchema, {
        organizationId: String(args.organizationId),
        filter: [],
      }));
      return res.metadata ?? [];
    },
  },
  {
    name: "org_metadata_delete",
    description: DESC.org_metadata_delete,
    inputSchema: {
      type: "object" as const,
      properties: {
        organizationId: { type: "string", description: "Organization ID" },
        key: { type: "string", description: "Metadata key" },
      },
      required: ["organizationId", "key"],
    },
    handler: async (args) => {
      return await clients.org.deleteOrganizationMetadata(create(DeleteOrganizationMetadataRequestSchema, {
        organizationId: String(args.organizationId),
        keys: [String(args.key)],
      }));
    },
  },
];
