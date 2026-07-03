import type { ServiceClients } from "../core";

export interface ToolDef {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties?: Record<string, unknown>;
    required?: string[];
  };
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}

export type ToolFactory = (clients: ServiceClients) => ToolDef[];
