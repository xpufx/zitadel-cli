const GRANT_MAP: Record<string, number> = {
  authorization_code: 0,
  implicit: 1,
  refresh_token: 2,
  device_code: 3,
  token_exchange: 4,
};

const RESPONSE_MAP: Record<string, number> = {
  code: 1,
  id_token: 2,
  id_token_token: 3,
};

const AUTH_METHOD_MAP: Record<string, number> = {
  basic: 0,
  post: 1,
  none: 2,
  private_key_jwt: 3,
};

const APP_TYPE_MAP: Record<string, number> = {
  web: 0,
  user_agent: 1,
  native: 2,
};

export function parseGrantTypes(s: string | undefined, defaultVal?: number[]): number[] {
  if (!s) return defaultVal ?? [0];
  return s.split(",").map((x) => GRANT_MAP[x.trim()] ?? 0);
}

export function parseResponseTypes(s: string | undefined, defaultVal?: number[]): number[] {
  if (!s) return defaultVal ?? [1];
  return s.split(",").map((x) => RESPONSE_MAP[x.trim()] ?? 1);
}

export function parseAuthMethodType(s: string | undefined, defaultVal?: number): number {
  if (!s) return defaultVal ?? 1;
  return AUTH_METHOD_MAP[s.trim()] ?? defaultVal ?? 1;
}

export function parseAppType(s: string | undefined, defaultVal?: number): number | undefined {
  if (!s) return defaultVal;
  return APP_TYPE_MAP[s.trim()] ?? defaultVal;
}
