import { Command } from "commander";
import pc from "picocolors";
import type { ServiceClients } from "./clients";

export interface ResourceDef {
  name: string;
  description: string;
  sub: (cmd: Command, clients: ServiceClients) => void;
}

export function handleError(err: unknown): never {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(pc.red("Error:"), msg);
  process.exit(1);
}
