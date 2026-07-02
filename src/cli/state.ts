import { createConfig, createClients } from "../core";
import pc from "picocolors";
import type { ServiceClients } from "../core";

let _clients: ServiceClients | null = null;

export function getClients(): ServiceClients {
  if (!_clients) {
    try {
      const config = createConfig();
      _clients = createClients(config);
    } catch (e) {
      console.error(pc.red("Config error:"), e instanceof Error ? e.message : String(e));
      process.exit(1);
    }
  }
  return _clients;
}
