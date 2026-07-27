import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PROTO_DIR = "/home/xpufx/code/zitadel-cli/vendor/zitadel/proto/zitadel";
const CLI_DIR = "/home/xpufx/code/zitadel-cli/src/cli/commands";
const MCP_DIR = "/home/xpufx/code/zitadel-cli/src/mcp/tools";

function collectUsed() {
  const used = new Set();
  // Also track what we call from the transport (raw HTTP)
  const rawOps = new Set();
  
  for (const dir of [CLI_DIR, MCP_DIR]) {
    for (const f of readdirSync(dir).filter(f => f.endsWith(".ts") && !f.includes("index"))) {
      const content = readFileSync(join(dir, f), "utf-8");
      for (const line of content.split("\n")) {
        // gRPC client calls
        let m = line.match(/clients\.(\w+)\.(\w+)\(/);
        if (m) used.add(m[1] + "." + m[2]);
        m = line.match(/getClients\(\)\.(\w+)\.(\w+)\(/);
        if (m) used.add(m[1] + "." + m[2]);
        // Raw HTTP calls: sysFetch(..., "/path") → detects system_* operations
        m = line.match(/sysFetch\([^)]+,\s*"([^)]+?)"/);
        if (m) rawOps.add(m[1]);
        m = line.match(/grpcFetch\([^)]+,\s*"([^)]+?)"/);
        if (m) rawOps.add(m[1]);
        // Direct fetch calls
        if (line.includes("/healthz")) rawOps.add("GET /healthz");
        if (line.includes('"/system/v1/')) rawOps.add("system_api");
      }
    }
  }
  
  // Also scan transport.ts
  const transport = "/home/xpufx/code/zitadel-cli/src/mcp/transport.ts";
  if (readdirSync("/home/xpufx/code/zitadel-cli/src/mcp").includes("transport.ts")) {
    const content = readFileSync(transport, "utf-8");
    for (const line of content.split("\n")) {
      if (line.includes("path") && line.includes("clients")) {
        rawOps.add("transport_sysFetch");
      }
    }
  }
  
  return { used, rawOps };
}

const { used, rawOps } = collectUsed();

const SERVICE_CLIENT_MAP = {
  AdminService: "admin", ManagementService: "management", SystemService: "system",
  UserService: "user", SessionService: "session", OIDCService: "oidc", SAMLService: "saml",
  SettingsService: "settings", OrganizationService: "org", ProjectService: "project",
  AppService: "app", AuthorizationService: "authorization", WebKeyService: "webkey",
  IdentityProviderService: "idp", FeatureService: "feature", InstanceService: "instance",
  ApplicationService: "app",
};

function parseProto(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const methods = [];
  let svc = "";
  for (const line of content.split("\n")) {
    const sm = line.match(/^\s*service\s+(\w+)\s*\{/);
    if (sm) { svc = sm[1]; continue; }
    const rm = line.match(/^\s*rpc\s+(\w+)\s*\(([^)]+)\)\s*returns\s*\(([^)]+)\)/);
    if (!rm || !svc) continue;
    methods.push({ service: svc, method: rm[1], input: rm[2].trim() });
  }
  return methods;
}

function walk(d) {
  let r = [];
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) r = r.concat(walk(p));
    else if (f.name.endsWith(".proto")) r.push(p);
  }
  return r;
}

const groups = {};

for (const protoPath of walk(PROTO_DIR)) {
  const methods = parseProto(protoPath);
  if (methods.length === 0) continue;
  
  for (const m of methods) {
    const cn = SERVICE_CLIENT_MAP[m.service] || "";
    const clientMethod = m.method[0].toLowerCase() + m.method.slice(1);
    
    // Check gRPC coverage
    let covered = used.has(cn + "." + clientMethod);
    
    // Check raw HTTP coverage for known patterns
    if (!covered && m.method === "Healthz") {
      covered = rawOps.has("GET /healthz");
    }
    if (!covered && m.service === "SystemService" && /^(ListInstances|GetInstance|CreateInstance|AddInstance|UpdateInstance|RemoveInstance)$/.test(m.method)) {
      covered = rawOps.has("system_api") || rawOps.has("transport_sysFetch");
    }
    if (!covered && m.service === "InstanceService" && /^(ListInstances|GetInstance|UpdateInstance|DeleteInstance|AddCustomDomain|RemoveCustomDomain|ListCustomDomains|AddTrustedDomain|RemoveTrustedDomain|ListTrustedDomains)$/.test(m.method)) {
      covered = rawOps.has("transport_sysFetch");
    }
    
    const relPath = protoPath.replace(PROTO_DIR + "/", "");
    let key = relPath.split("/")[0];
    if (key === "app") key = "application";
    if (key === "app.proto") key = "application";
    if (!groups[key]) groups[key] = { label: key, methods: [], seen: new Set() };
    const dedupKey = m.service + "." + m.method;
    if (groups[key].seen.has(dedupKey)) continue;
    groups[key].seen.add(dedupKey);
    groups[key].methods.push({ ...m, covered, isWrite: /^(Set|Update|Add|Create|Delete|Remove|Activate|Deactivate|Reset|Bulk|Import|Export|Revoke|Regenerate|Generate)/.test(m.method) });
  }
}

const ORDER = [
  "user", "org", "project", "application", "app", "settings", "feature",
  "session", "authorization", "idp", "oidc", "saml", "system",
  "instance", "webkey", "admin", "management", "auth", "group", "policy",
  "resources", "action", "message",
];

const keys = Object.keys(groups);
const ordered = ORDER.map(c => keys.find(k => k.includes(c))).filter(Boolean);
const remaining = keys.filter(k => !ordered.includes(k));

let total = 0, coveredTotal = 0;
const lines = [];

lines.push("# ZITADEL CLI/MCP Coverage Checklist\n");
lines.push("Generated: " + new Date().toISOString().slice(0, 10) + "\n");
lines.push("Detection: gRPC client calls + raw HTTP patterns (healthz, system, instance).\n");
lines.push("The `api_query` tool provides unrestricted access to any gRPC endpoint not listed here.\n");
lines.push("Legend: **✅** covered | **❌** missing\n");

const seenKeys = new Set();
for (const key of [...ordered, ...remaining].filter(Boolean)) {
  if (seenKeys.has(key)) continue;
  seenKeys.add(key);
  const g = groups[key];
  const methods = g.methods;
  const covered = methods.filter(m => m.covered);
  const missing = methods.filter(m => !m.covered);
  total += methods.length;
  coveredTotal += covered.length;

  lines.push(`\n## ${key} (${covered.length}/${methods.length})\n`);
  lines.push("| Method | Input | Type | Status |");
  lines.push("|---|---|---|---|");

  for (const m of methods) {
    const input = m.input.replace("Request", "").replace("Response", "");
    const type = m.isWrite ? "write" : "read";
    const icon = m.covered ? "✅" : "❌";
    lines.push(`| ${m.method} | ${input} | ${type} | ${icon} |`);
  }
}

lines.push(`\n---\n**Summary:** ${coveredTotal}/${total} operations (${Math.round(coveredTotal/total*100)}%)\n`);
lines.push("Note: `api_query` provides unrestricted access to any gRPC endpoint not explicitly listed.\n");

console.log(lines.join("\n"));
