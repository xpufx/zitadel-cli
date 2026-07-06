import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { execSync } from "node:child_process";

const PROTO_DIR = "/home/xpufx/code/zitadel-cli/vendor/zitadel/proto/zitadel";
const CLI_DIR = "/home/xpufx/code/zitadel-cli/src/cli/commands";
const MCP_DIR = "/home/xpufx/code/zitadel-cli/src/mcp/tools";

// Scan source for used RPC methods and client calls
function findUsedToolMethods() {
  const used = new Set();
  
  const scanFile = (filePath) => {
    const content = readFileSync(filePath, "utf-8");
    for (const line of content.split("\n")) {
      // Match client method calls: clients.foo.barMethod(...)
      let m = line.match(/clients\.(\w+)\.(\w+)\(/);
      if (m) used.add(m[1] + "." + camelToCap(m[2]));
      // Match getClients().foo.barMethod()
      m = line.match(/getClients\(\)\.(\w+)\.(\w+)\(/);
      if (m) used.add(m[1] + "." + camelToCap(m[2]));
    }
  };
  
  const dirFiles = readdirSync(CLI_DIR).filter(f => f.endsWith(".ts"));
  for (const f of dirFiles) scanFile(join(CLI_DIR, f));
  
  const mcpFiles = readdirSync(MCP_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts");
  for (const f of mcpFiles) scanFile(join(MCP_DIR, f));
  
  return used;
}

function camelToCap(s) {
  return s[0].toUpperCase() + s.slice(1);
}

// Find all proto files
function findProtoFiles(dir) {
  const files = [];
  const walk = (d) => {
    for (const f of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (f.name.endsWith(".proto")) files.push(p);
    }
  };
  walk(dir);
  return files;
}

function parseProtoMethods(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const methods = [];
  const packageMatch = content.match(/^\s*package\s+([\w.]+)/m);
  const pkg = packageMatch ? packageMatch[1] : "";
  
  // Current service name tracking
  let currentService = "";
  for (const line of content.split("\n")) {
    const svcMatch = line.match(/\b(?:rpc\s+)?service\s+(\w+)/);
    if (svcMatch) {
      currentService = svcMatch[1];
      continue;
    }
    // Don't reset service on closing brace - services define multiple RPCs
    const rpcMatch = line.match(/^\s*rpc\s+(\w+)\s*\(([^)]+)\)\s*returns\s*\(([^)]+)\)/);
    if (rpcMatch && currentService) {
      methods.push({
        service: currentService,
        method: rpcMatch[1],
        input: rpcMatch[2].trim().split(/\s+/).pop() || rpcMatch[2].trim(),
        output: rpcMatch[3].trim().split(/\s+/).pop() || rpcMatch[3].trim(),
        fullMethod: `${pkg}.${currentService}/${rpcMatch[1]}`,
      });
    }
  }
  return methods;
}

console.log("=== ZITADEL Proto RPC Audit ===\n");

const used = findUsedToolMethods();
const protos = findProtoFiles(PROTO_DIR);

let totalMethods = 0;
let coveredCount = 0;
const uncovered = [];

for (const protoPath of protos) {
  const relPath = protoPath.replace(PROTO_DIR + "/", "");
  const methods = parseProtoMethods(protoPath);
  if (methods.length === 0) continue;
  
  for (const m of methods) {
    totalMethods++;
    const clientName = m.service === "AdminService" ? "admin" :
      m.service === "ManagementService" ? "management" :
      m.service === "SystemService" ? "system" :
      m.service === "OIDCService" ? "oidc" :
      m.service === "SAMLService" ? "saml" : "";
    
    const clientMethod = clientName ? `${clientName}.${m.method[0].toLowerCase() + m.method.slice(1)}` : "";
    const inputStop = m.input.includes(".") ? m.input.split(".").pop() : m.input;
    
    const isCovered = 
      used.has(clientMethod) ||
      (!m.method.endsWith("Request") && used.has(inputStop)) ||
      (!m.method.endsWith("Response") && used.has(m.input));
    
    if (isCovered) coveredCount++;
    else uncovered.push({ ...m, relPath });
  }
}

console.log(`Proto files scanned: ${protos.length}`);
console.log(`Total RPCs: ${totalMethods}`);
console.log(`Covered: ${coveredCount}`);
console.log(`Missing: ${uncovered.length}\n`);

// Group by category
const byCat = {};
for (const m of uncovered) {
  const cat = m.relPath.split("/").slice(0, -1).join("/") || m.relPath;
  if (!byCat[cat]) byCat[cat] = [];
  byCat[cat].push(m);
}

console.log("=== MISSING RPCs BY CATEGORY ===\n");
for (const [cat, methods] of Object.entries(byCat).sort()) {
  console.log(`\n${cat} (${methods.length} missing):`);
  for (const m of methods) {
    const label = m.service !== m.relPath.replace(".proto","") ? `${m.service}.` : "";
    console.log(`  ${label}${m.method}(${m.input})`);
  }
}

console.log(`\n\n=== COVERED RPCs BY CATEGORY ===\n`);
const covered = [];
for (const protoPath of protos) {
  const relPath = protoPath.replace(PROTO_DIR + "/", "");
  const methods = parseProtoMethods(protoPath);
  if (methods.length === 0) continue;
  for (const m of methods) {
    const clientName = m.service === "AdminService" ? "admin" :
      m.service === "ManagementService" ? "management" :
      m.service === "SystemService" ? "system" : "";
    const clientMethod = clientName ? `${clientName}.${m.method[0].toLowerCase() + m.method.slice(1)}` : "";
    const isCovered = used.has(clientMethod) || used.has(m.input);
    if (isCovered) covered.push(m);
  }
}
const byCatCovered = {};
for (const m of covered) {
  const cat = "admin";
  if (!byCatCovered[cat]) byCatCovered[cat] = [];
  byCatCovered[cat].push(m);
}
for (const [cat, methods] of Object.entries(byCatCovered).sort()) {
  console.log(`  ${cat}: ${methods.length} covered`);
}
