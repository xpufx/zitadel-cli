import type { ServiceClients } from "../../core";
import type { ToolFactory } from "../tools";

export const getApiTools: ToolFactory = (clients) => [
  {
    name: "api_query",
    description: "Send a raw API request to any ZITADEL endpoint (gRPC or REST). Use this for operations not covered by other tools.",
    inputSchema: {
      type: "object" as const,
      properties: {
        method: {
          type: "string",
          description: "HTTP method (GET, POST, PUT, DELETE). Default: POST.",
          default: "POST",
        },
        path: {
          type: "string",
          description: "URL path. For gRPC use full method name (e.g. zitadel.session.v2.SessionService/ListSessions), for REST use /api/path.",
        },
        body: {
          type: "object",
          description: "JSON request body (for POST/PUT). For GET requests, fields are sent as query parameters.",
        },
      },
      required: ["path"],
    },
    handler: async (args) => {
      const baseUrl = clients.config.apiUrl.replace(/\/+$/, "");
      const httpMethod = String(args.method ?? "POST").toUpperCase();
      const path = String(args.path);
      const body = args.body as Record<string, unknown> | undefined;

      const headers: Record<string, string> = {
        Authorization: `Bearer ${clients.config.token}`,
      };

      let url: string;
      let fetchBody: string | undefined;

      if (httpMethod === "GET" && body) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(body)) {
          params.set(k, String(v));
        }
        url = `${baseUrl}${path}?${params}`;
        headers["Accept"] = "application/json";
      } else if (httpMethod === "GET") {
        url = `${baseUrl}${path}`;
        headers["Accept"] = "application/json";
      } else {
        url = `${baseUrl}${path[0] === "/" ? path : "/" + path}`;
        headers["Content-Type"] = "application/json";
        fetchBody = JSON.stringify(body ?? {});
      }

      const res = await fetch(url, { method: httpMethod, headers, body: fetchBody });
      const text = await res.text();
      if (!res.ok) {
        try { const err = JSON.parse(text); throw new Error(err.message ?? `HTTP ${res.status}`); }
        catch { throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`); }
      }
      try { return JSON.parse(text); }
      catch { return text; }
    },
  },
];
