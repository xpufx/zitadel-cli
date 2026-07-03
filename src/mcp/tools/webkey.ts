import { create } from "@bufbuild/protobuf";
import {
  ListWebKeysRequestSchema,
  ActivateWebKeyRequestSchema,
  CreateWebKeyRequestSchema,
  DeleteWebKeyRequestSchema,
} from "@zitadel/proto/zitadel/webkey/v2/webkey_service_pb.js";
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import type { ToolFactory } from "../tools";

export const getWebkeyTools: ToolFactory = (clients) => [
  {
    name: "webkey_list",
    description: DESC.webkey_list,
    inputSchema: { type: "object" as const, properties: {} },
    handler: async () => {
      const res = await clients.webkey.listWebKeys(create(ListWebKeysRequestSchema, {}));
      return res.webKeys ?? [];
    },
  },
  {
    name: "webkey_activate",
    description: DESC.webkey_activate,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Web key ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      return await clients.webkey.activateWebKey(create(ActivateWebKeyRequestSchema, { id: String(args.id) }));
    },
  },
  {
    name: "webkey_create",
    description: DESC.webkey_create,
    inputSchema: {
      type: "object" as const,
      properties: {
        type: {
          type: "string",
          enum: ["rsa", "ecdsa", "ed25519"],
          description: "Key type (default: rsa)",
        },
      },
    },
    handler: async (args) => {
      const keyType = String(args.type ?? "rsa");
      let req;
      if (keyType === "ecdsa") {
        req = create(CreateWebKeyRequestSchema, { key: { case: "ecdsa" as const, value: {} } });
      } else if (keyType === "ed25519") {
        req = create(CreateWebKeyRequestSchema, { key: { case: "ed25519" as const, value: {} } });
      } else {
        req = create(CreateWebKeyRequestSchema, { key: { case: "rsa" as const, value: {} } });
      }
      return await clients.webkey.createWebKey(req);
    },
  },
  {
    name: "webkey_delete",
    description: DESC.webkey_delete,
    inputSchema: {
      type: "object" as const,
      properties: { id: { type: "string", description: "Web key ID" } },
      required: ["id"],
    },
    handler: async (args) => {
      return await clients.webkey.deleteWebKey(create(DeleteWebKeyRequestSchema, { id: String(args.id) }));
    },
  },
];
