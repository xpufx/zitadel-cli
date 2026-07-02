import { createClientFor } from "@zitadel/client";
import { createServerTransport } from "@zitadel/client/node";
import type { Transport } from "@connectrpc/connect";

import { createUserServiceClient } from "@zitadel/client/v2";
import { createSettingsServiceClient } from "@zitadel/client/v2";
import { createSessionServiceClient } from "@zitadel/client/v2";
import { createOIDCServiceClient } from "@zitadel/client/v2";
import { createSAMLServiceClient } from "@zitadel/client/v2";
import { createOrganizationServiceClient } from "@zitadel/client/v2";
import { createFeatureServiceClient } from "@zitadel/client/v2";
import { createIdpServiceClient } from "@zitadel/client/v2";

import { WebKeyService } from "@zitadel/proto/zitadel/webkey/v2/webkey_service_pb.js";
import { InstanceService } from "@zitadel/proto/zitadel/instance/v2beta/instance_service_pb.js";
import { ProjectService } from "@zitadel/proto/zitadel/project/v2beta/project_service_pb.js";
import { AppService } from "@zitadel/proto/zitadel/app/v2beta/app_service_pb.js";
import { AuthorizationService } from "@zitadel/proto/zitadel/authorization/v2beta/authorization_service_pb.js";

import { AdminService } from "@zitadel/proto/zitadel/admin_pb.js";
import { ManagementService } from "@zitadel/proto/zitadel/management_pb.js";
import { SystemService } from "@zitadel/proto/zitadel/system_pb.js";

import type { ZitadelConfig } from "./types";

export const createWebKeyServiceClient = createClientFor(WebKeyService);
export const createInstanceServiceClient = createClientFor(InstanceService);
export const createProjectServiceClient = createClientFor(ProjectService);
export const createAppServiceClient = createClientFor(AppService);
export const createAuthorizationServiceClient = createClientFor(AuthorizationService);
export const createAdminServiceClient = createClientFor(AdminService);
export const createManagementServiceClient = createClientFor(ManagementService);
export const createSystemServiceClient = createClientFor(SystemService);

export interface ServiceClients {
  config: ZitadelConfig;
  user: ReturnType<typeof createUserServiceClient>;
  settings: ReturnType<typeof createSettingsServiceClient>;
  session: ReturnType<typeof createSessionServiceClient>;
  oidc: ReturnType<typeof createOIDCServiceClient>;
  saml: ReturnType<typeof createSAMLServiceClient>;
  org: ReturnType<typeof createOrganizationServiceClient>;
  feature: ReturnType<typeof createFeatureServiceClient>;
  idp: ReturnType<typeof createIdpServiceClient>;
  webkey: ReturnType<typeof createWebKeyServiceClient>;
  instance: ReturnType<typeof createInstanceServiceClient>;
  project: ReturnType<typeof createProjectServiceClient>;
  app: ReturnType<typeof createAppServiceClient>;
  authorization: ReturnType<typeof createAuthorizationServiceClient>;
  admin: ReturnType<typeof createAdminServiceClient>;
  management: ReturnType<typeof createManagementServiceClient>;
  system: ReturnType<typeof createSystemServiceClient>;
}

export function createClients(config: ZitadelConfig): ServiceClients {
  const transport = createServerTransport(config.token, {
    baseUrl: config.apiUrl,
  }) as Transport;

  return {
    config,
    user: createUserServiceClient(transport),
    settings: createSettingsServiceClient(transport),
    session: createSessionServiceClient(transport),
    oidc: createOIDCServiceClient(transport),
    saml: createSAMLServiceClient(transport),
    org: createOrganizationServiceClient(transport),
    feature: createFeatureServiceClient(transport),
    idp: createIdpServiceClient(transport),
    webkey: createWebKeyServiceClient(transport),
    instance: createInstanceServiceClient(transport),
    project: createProjectServiceClient(transport),
    app: createAppServiceClient(transport),
    authorization: createAuthorizationServiceClient(transport),
    admin: createAdminServiceClient(transport),
    management: createManagementServiceClient(transport),
    system: createSystemServiceClient(transport),
  };
}
