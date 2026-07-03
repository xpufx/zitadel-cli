import { readFileSync } from "node:fs";
import type { ServiceClients } from "../core";
import { signSystemJwt } from "../core";

function systemJwt(clients: ServiceClients): string {
  const keyPath = clients.config.systemKey;
  const userId = clients.config.systemUserId;
  if (!keyPath || !userId) throw new Error("system_key and system_user_id required for system API calls");
  return signSystemJwt({ audience: clients.config.apiUrl, subject: userId, key: readFileSync(keyPath, "utf-8") });
}

export async function sysFetch<T>(clients: ServiceClients, path: string, body: object): Promise<T> {
  const baseUrl = clients.config.apiUrl.replace(/\/+$/, "");
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${systemJwt(clients)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function grpcFetch<T>(clients: ServiceClients, method: string, body: object): Promise<T> {
  return await sysFetch<T>(clients, `/${method}`, body);
}
