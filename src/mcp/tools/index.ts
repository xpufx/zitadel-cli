import type { ServiceClients } from "../../core";
import type { ToolDef } from "../tools";
import { getUserTools } from "./user";
import { getOrgTools } from "./org";
import { getProjectTools } from "./project";
import { getAppTools } from "./app";
import { getSettingsTools } from "./settings";
import { getFeatureTools } from "./feature";
import { getSessionTools } from "./session";
import { getAuthorizationTools } from "./authorization";
import { getWebkeyTools } from "./webkey";
import { getIdpTools } from "./idp";
import { getSystemTools } from "./system";
import { getInstanceTools } from "./instance";
import { getApiTools } from "./api";

export function getToolDefs(clients: ServiceClients): ToolDef[] {
  return [
    ...getUserTools(clients),
    ...getOrgTools(clients),
    ...getProjectTools(clients),
    ...getAppTools(clients),
    ...getSettingsTools(clients),
    ...getFeatureTools(clients),
    ...getSessionTools(clients),
    ...getAuthorizationTools(clients),
    ...getWebkeyTools(clients),
    ...getIdpTools(clients),
    ...getSystemTools(clients),
    ...getInstanceTools(clients),
    ...getApiTools(clients),
  ];
}
