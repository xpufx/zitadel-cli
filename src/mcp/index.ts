#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createConfig, createClients, stripProto } from "../core";
import { getToolDefs } from "./tools/index";

const server = new Server(
  { name: "zitadel", version: "0.0.1" },
  { capabilities: { tools: {} } },
);

const config = createConfig();
const clients = createClients(config);
const toolDefs = getToolDefs(clients);
const toolMap = new Map(toolDefs.map((t) => [t.name, t]));

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefs.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = toolMap.get(request.params.name);
  if (!tool) throw new Error(`Unknown tool: ${request.params.name}`);
  try {
    const result = await tool.handler(request.params.arguments ?? {});
    return { content: [{ type: "text", text: JSON.stringify(stripProto(result), null, 2) }] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { content: [{ type: "text", text: msg }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
