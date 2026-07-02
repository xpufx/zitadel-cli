import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { parse } from "smol-toml";
import type { ZitadelConfig } from "./types";

const ENV_MAP: Record<string, keyof ZitadelConfig> = {
  ZITADEL_API_URL: "apiUrl",
  ZITADEL_TOKEN: "token",
  ZITADEL_ORG_ID: "defaultOrgId",
  ZITADEL_TOKEN_TYPE: "tokenType",
  ZITADEL_SYSTEM_KEY: "systemKey",
  ZITADEL_SYSTEM_USER_ID: "systemUserId",
};

const TOML_MAP: Record<string, keyof ZitadelConfig> = {
  api_url: "apiUrl",
  token: "token",
  default_org_id: "defaultOrgId",
  token_type: "tokenType",
  system_key: "systemKey",
  system_user_id: "systemUserId",
};

function loadConfigFile(path: string): Partial<ZitadelConfig> | null {
  try {
    if (!existsSync(path)) return null;
    const raw = readFileSync(path, "utf-8");
    const parsed = parse(raw) as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const mapped = TOML_MAP[key] ?? key;
      result[mapped] = value;
    }
    return result as Partial<ZitadelConfig>;
  } catch {
    return null;
  }
}

function loadEnv(): Partial<ZitadelConfig> {
  const result: Record<string, string> = {};
  for (const [env, key] of Object.entries(ENV_MAP)) {
    const val = process.env[env];
    if (val) result[key] = val;
  }
  return result as Partial<ZitadelConfig>;
}

export function createConfig(): ZitadelConfig {
  const local = loadConfigFile(join(process.cwd(), ".zitadel.toml"));
  const global = loadConfigFile(join(homedir(), ".config", "zitadel", "config.toml"));
  const env = loadEnv();

  const merged: ZitadelConfig = {
    apiUrl: env.apiUrl ?? local?.apiUrl ?? global?.apiUrl ?? "",
    token: env.token ?? local?.token ?? global?.token ?? "",
    defaultOrgId: env.defaultOrgId ?? local?.defaultOrgId ?? global?.defaultOrgId,
    tokenType: env.tokenType ?? local?.tokenType ?? global?.tokenType ?? "pat",
    systemKey: env.systemKey ?? local?.systemKey ?? global?.systemKey,
    systemUserId: env.systemUserId ?? local?.systemUserId ?? global?.systemUserId,
  };

  if (!merged.apiUrl) throw new Error("ZITADEL_API_URL is required");
  if (!merged.token) throw new Error("ZITADEL_TOKEN is required");

  return merged;
}
