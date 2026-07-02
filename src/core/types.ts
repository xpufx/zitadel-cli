export interface ZitadelConfig {
  apiUrl: string;
  token: string;
  defaultOrgId?: string;
  tokenType?: "pat" | "system";
  systemKey?: string;
  systemUserId?: string;
}

export interface ZitadelClient {
  config: ZitadelConfig;
}
