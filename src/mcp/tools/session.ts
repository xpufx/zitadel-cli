import { create } from "@bufbuild/protobuf";
import {
  ListSessionsRequestSchema,
  GetSessionRequestSchema,
  DeleteSessionRequestSchema,
  CreateSessionRequestSchema,
  SetSessionRequestSchema,
} from "@zitadel/proto/zitadel/session/v2/session_service_pb.js";
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import type { ToolFactory } from "../tools";

export const getSessionTools: ToolFactory = (clients) => [
  {
    name: "session_list",
    description: DESC.session_list,
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Max results (default 50)" },
      },
    },
    handler: async (args) => {
      const req = create(ListSessionsRequestSchema, { query: { limit: Number(args.limit ?? 50) } });
      return (await clients.session.listSessions(req)).sessions ?? [];
    },
  },
  {
    name: "session_get",
    description: DESC.session_get,
    inputSchema: {
      type: "object" as const,
      properties: { sessionId: { type: "string", description: "Session ID" } },
      required: ["sessionId"],
    },
    handler: async (args) => {
      const req = create(GetSessionRequestSchema, { sessionId: String(args.sessionId) });
      return (await clients.session.getSession(req)).session;
    },
  },
  {
    name: "session_delete",
    description: DESC.session_delete,
    inputSchema: {
      type: "object" as const,
      properties: { sessionId: { type: "string", description: "Session ID" } },
      required: ["sessionId"],
    },
    handler: async (args) => {
      return await clients.session.deleteSession(create(DeleteSessionRequestSchema, { sessionId: String(args.sessionId) }));
    },
  },
  {
    name: "session_create",
    description: DESC.session_create,
    inputSchema: { type: "object" as const, properties: {} },
    handler: async () => {
      return await clients.session.createSession(create(CreateSessionRequestSchema, { metadata: {} }));
    },
  },
  {
    name: "session_set",
    description: DESC.session_set,
    inputSchema: {
      type: "object" as const,
      properties: {
        sessionId: { type: "string", description: "Session ID" },
        token: { type: "string", description: "Session token (required)" },
      },
      required: ["sessionId", "token"],
    },
    handler: async (args) => {
      return await clients.session.setSession(create(SetSessionRequestSchema, {
        sessionId: String(args.sessionId),
        sessionToken: String(args.token),
        metadata: {},
      }));
    },
  },
];
