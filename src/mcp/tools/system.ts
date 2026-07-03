import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import { sysFetch } from "../transport";
import type { ToolFactory } from "../tools";

export const getSystemTools: ToolFactory = (clients) => [
  {
    name: "system_health",
    description: DESC.system_health,
    inputSchema: { type: "object" as const, properties: {} },
    handler: async () => {
      const baseUrl = clients.config.apiUrl.replace(/\/+$/, "");
      const res = await fetch(`${baseUrl}/healthz`);
      return res.json();
    },
  },
  {
    name: "system_instance_list",
    description: DESC.system_instance_list,
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Max results (default 100)" },
        offset: { type: "number", description: "Offset (default 0)" },
      },
    },
    handler: async (args) => {
      return await sysFetch(clients, "/system/v1/instances/_search", {
        query: { limit: Number(args.limit ?? 100), offset: Number(args.offset ?? 0) },
      });
    },
  },
  {
    name: "system_instance_get",
    description: DESC.system_instance_get,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Instance ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      return await sysFetch(clients, `/system/v1/instances/${args.id}`, {});
    },
  },
  {
    name: "system_instance_create",
    description: DESC.system_instance_create,
    inputSchema: {
      type: "object" as const,
      properties: { name: { type: "string", description: "Instance name" } },
      required: ["name"],
    },
    handler: async (args) => {
      return await sysFetch(clients, "/system/v1/instances/_create", { name: String(args.name) });
    },
  },
];
