import { create } from "@bufbuild/protobuf";
import {
  ListInstancesRequestSchema,
  GetInstanceRequestSchema,
  DeleteInstanceRequestSchema,
  UpdateInstanceRequestSchema,
  AddCustomDomainRequestSchema,
  RemoveCustomDomainRequestSchema,
  ListCustomDomainsRequestSchema,
  AddTrustedDomainRequestSchema,
  RemoveTrustedDomainRequestSchema,
  ListTrustedDomainsRequestSchema,
} from "@zitadel/proto/zitadel/instance/v2beta/instance_service_pb.js";
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import { grpcFetch } from "../transport";
import type { ToolFactory } from "../tools";

export const getInstanceTools: ToolFactory = (clients) => [
  {
    name: "instance_list",
    description: DESC.instance_list,
    inputSchema: { type: "object" as const, properties: {} },
    handler: async () => {
      const res = await grpcFetch<{ instances: unknown[] }>(
        clients,
        "zitadel.instance.v2beta.InstanceService/ListInstances",
        create(ListInstancesRequestSchema, { queries: [] }),
      );
      return res.instances ?? [];
    },
  },
  {
    name: "instance_get",
    description: DESC.instance_get,
    inputSchema: {
      type: "object" as const,
      properties: { instanceId: { type: "string", description: "Instance ID" } },
      required: ["instanceId"],
    },
    handler: async (args) => {
      const res = await grpcFetch<{ instance: unknown }>(
        clients,
        "zitadel.instance.v2beta.InstanceService/GetInstance",
        create(GetInstanceRequestSchema, { instanceId: String(args.instanceId) }),
      );
      return res.instance;
    },
  },
  {
    name: "instance_update",
    description: DESC.instance_update,
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceId: { type: "string", description: "Instance ID" },
        name: { type: "string", description: "New instance name" },
      },
      required: ["instanceId", "name"],
    },
    handler: async (args) => {
      return await grpcFetch(
        clients,
        "zitadel.instance.v2beta.InstanceService/UpdateInstance",
        create(UpdateInstanceRequestSchema, {
          instanceId: String(args.instanceId),
          instanceName: String(args.name),
        }),
      );
    },
  },
  {
    name: "instance_delete",
    description: DESC.instance_delete,
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceId: { type: "string", description: "Instance ID" },
        confirm: { type: "boolean", description: "Confirmation flag (required)" },
      },
      required: ["instanceId", "confirm"],
    },
    handler: async (args) => {
      if (!args.confirm) throw new Error("Use confirm=true to proceed");
      return await grpcFetch(
        clients,
        "zitadel.instance.v2beta.InstanceService/DeleteInstance",
        create(DeleteInstanceRequestSchema, { instanceId: String(args.instanceId) }),
      );
    },
  },
  {
    name: "instance_domain_add",
    description: DESC.instance_domain_add,
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceId: { type: "string", description: "Instance ID" },
        domain: { type: "string", description: "Domain name" },
      },
      required: ["instanceId", "domain"],
    },
    handler: async (args) => {
      return await grpcFetch(
        clients,
        "zitadel.instance.v2beta.InstanceService/AddCustomDomain",
        create(AddCustomDomainRequestSchema, {
          instanceId: String(args.instanceId),
          domain: String(args.domain),
        }),
      );
    },
  },
  {
    name: "instance_domain_remove",
    description: DESC.instance_domain_remove,
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceId: { type: "string", description: "Instance ID" },
        domain: { type: "string", description: "Domain name" },
      },
      required: ["instanceId", "domain"],
    },
    handler: async (args) => {
      return await grpcFetch(
        clients,
        "zitadel.instance.v2beta.InstanceService/RemoveCustomDomain",
        create(RemoveCustomDomainRequestSchema, {
          instanceId: String(args.instanceId),
          domain: String(args.domain),
        }),
      );
    },
  },
  {
    name: "instance_domain_list",
    description: DESC.instance_domain_list,
    inputSchema: {
      type: "object" as const,
      properties: { instanceId: { type: "string", description: "Instance ID" } },
      required: ["instanceId"],
    },
    handler: async (args) => {
      const res = await grpcFetch<{ domains: unknown[] }>(
        clients,
        "zitadel.instance.v2beta.InstanceService/ListCustomDomains",
        create(ListCustomDomainsRequestSchema, { instanceId: String(args.instanceId) }),
      );
      return res.domains ?? [];
    },
  },
  {
    name: "instance_trusted_domain_add",
    description: DESC.instance_trusted_domain_add,
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceId: { type: "string", description: "Instance ID" },
        domain: { type: "string", description: "Domain name" },
      },
      required: ["instanceId", "domain"],
    },
    handler: async (args) => {
      return await grpcFetch(
        clients,
        "zitadel.instance.v2beta.InstanceService/AddTrustedDomain",
        create(AddTrustedDomainRequestSchema, {
          instanceId: String(args.instanceId),
          domain: String(args.domain),
        }),
      );
    },
  },
  {
    name: "instance_trusted_domain_remove",
    description: DESC.instance_trusted_domain_remove,
    inputSchema: {
      type: "object" as const,
      properties: {
        instanceId: { type: "string", description: "Instance ID" },
        domain: { type: "string", description: "Domain name" },
      },
      required: ["instanceId", "domain"],
    },
    handler: async (args) => {
      return await grpcFetch(
        clients,
        "zitadel.instance.v2beta.InstanceService/RemoveTrustedDomain",
        create(RemoveTrustedDomainRequestSchema, {
          instanceId: String(args.instanceId),
          domain: String(args.domain),
        }),
      );
    },
  },
  {
    name: "instance_trusted_domain_list",
    description: DESC.instance_trusted_domain_list,
    inputSchema: {
      type: "object" as const,
      properties: { instanceId: { type: "string", description: "Instance ID" } },
      required: ["instanceId"],
    },
    handler: async (args) => {
      const res = await grpcFetch<{ trustedDomain: unknown[] }>(
        clients,
        "zitadel.instance.v2beta.InstanceService/ListTrustedDomains",
        create(ListTrustedDomainsRequestSchema, { instanceId: String(args.instanceId) }),
      );
      return res.trustedDomain ?? [];
    },
  },
];
