import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { createClientTransport } from "@zitadel/client/web";
import { createUserServiceClient } from "@zitadel/client/v2";
import { createSettingsServiceClient } from "@zitadel/client/v2";
import { createSessionServiceClient } from "@zitadel/client/v2";
import { createClientFor } from "@zitadel/client";
import { OrganizationService as OrgV2betaService } from "@zitadel/proto/zitadel/org/v2beta/org_service_pb.js";
import { createFeatureServiceClient } from "@zitadel/client/v2";
import { createIdpServiceClient } from "@zitadel/client/v2";
import { WebKeyService } from "@zitadel/proto/zitadel/webkey/v2/webkey_service_pb.js";
import { InstanceService } from "@zitadel/proto/zitadel/instance/v2beta/instance_service_pb.js";
import { ProjectService } from "@zitadel/proto/zitadel/project/v2beta/project_service_pb.js";
import { AppService } from "@zitadel/proto/zitadel/app/v2beta/app_service_pb.js";
import { AuthorizationService } from "@zitadel/proto/zitadel/authorization/v2beta/authorization_service_pb.js";
import type { Transport } from "@connectrpc/connect";

export interface WebServiceClients {
  user: ReturnType<typeof createUserServiceClient>;
  settings: ReturnType<typeof createSettingsServiceClient>;
  session: ReturnType<typeof createSessionServiceClient>;
  org: ReturnType<typeof createOrganizationServiceClient>;
  feature: ReturnType<typeof createFeatureServiceClient>;
  idp: ReturnType<typeof createIdpServiceClient>;
  webkey: ReturnType<typeof createWebKeyServiceClient>;
  instance: ReturnType<typeof createInstanceServiceClient>;
  project: ReturnType<typeof createProjectServiceClient>;
  app: ReturnType<typeof createAppServiceClient>;
  authorization: ReturnType<typeof createAuthorizationServiceClient>;
}

const createOrganizationServiceClient = createClientFor(OrgV2betaService);
const createWebKeyServiceClient = createClientFor(WebKeyService);
const createInstanceServiceClient = createClientFor(InstanceService);
const createProjectServiceClient = createClientFor(ProjectService);
const createAppServiceClient = createClientFor(AppService);
const createAuthorizationServiceClient = createClientFor(AuthorizationService);

function createWebClients(transport: Transport): WebServiceClients {
  return {
    user: createUserServiceClient(transport),
    settings: createSettingsServiceClient(transport),
    session: createSessionServiceClient(transport),
    org: createOrganizationServiceClient(transport),
    feature: createFeatureServiceClient(transport),
    idp: createIdpServiceClient(transport),
    webkey: createWebKeyServiceClient(transport),
    instance: createInstanceServiceClient(transport),
    project: createProjectServiceClient(transport),
    app: createAppServiceClient(transport),
    authorization: createAuthorizationServiceClient(transport),
  };
}

interface AuthState {
  apiUrl: string;
  token: string;
}

interface AuthContextValue {
  auth: AuthState | null;
  clients: WebServiceClients | null;
  login: (apiUrl: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const apiUrl = sessionStorage.getItem("zitadel_apiUrl");
    const token = sessionStorage.getItem("zitadel_token");
    return apiUrl && token ? { apiUrl, token } : null;
  });

  const [clients, setClients] = useState<WebServiceClients | null>(() => {
    const apiUrl = sessionStorage.getItem("zitadel_apiUrl");
    const token = sessionStorage.getItem("zitadel_token");
    if (apiUrl && token) {
      const transport = createClientTransport(token, { baseUrl: apiUrl }) as Transport;
      return createWebClients(transport);
    }
    return null;
  });

  const login = useCallback((apiUrl: string, token: string) => {
    sessionStorage.setItem("zitadel_apiUrl", apiUrl);
    sessionStorage.setItem("zitadel_token", token);
    const transport = createClientTransport(token, { baseUrl: apiUrl }) as Transport;
    setAuth({ apiUrl, token });
    setClients(createWebClients(transport));
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("zitadel_apiUrl");
    sessionStorage.removeItem("zitadel_token");
    setAuth(null);
    setClients(null);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, clients, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useClients(): WebServiceClients {
  const { clients } = useAuth();
  if (!clients) throw new Error("Not authenticated");
  return clients;
}
