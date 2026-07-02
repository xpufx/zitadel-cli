import pc from "picocolors";

export type OutputFormat = "table" | "json" | "yaml";

let _format: OutputFormat = "table";

export function setOutputFormat(format: OutputFormat): void {
  _format = format;
}

const jsonReplacer = (_key: string, value: unknown): unknown =>
  typeof value === "bigint" ? Number(value) : value;

export function printResult(data: unknown): void {
  switch (_format) {
    case "json":
      console.log(JSON.stringify(data, jsonReplacer, 2));
      break;
    case "yaml":
      console.log(toYaml(data));
      break;
    case "table":
      printTable(stripProto(data));
      break;
  }
}

function stripProto(val: unknown): unknown {
  if (Array.isArray(val)) return val.map(stripProto);
  if (val && typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if (obj.case) return String(obj.case);
    if (obj.seconds !== undefined && obj.nanos !== undefined) {
      return new Date(Number(obj.seconds) * 1000).toISOString();
    }
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith("$")) continue;
      cleaned[k] = stripProto(v);
    }
    return cleaned;
  }
  return val;
}

function printTable(data: unknown): void {
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object" && data[0] !== null) {
    const items = data as Record<string, unknown>[];
    const keys = [...new Set(items.flatMap(Object.keys))];
    const skip = new Set(["details", "$typeName", "$unknown"]);
    const cols = keys.filter((k) => !skip.has(k) && !k.startsWith("$"));
    if (cols.length === 0) cols.push(...keys.slice(0, 5));

    const strRows = items.map((item) => cols.map((c) => cellStr(item[c])));
    const widths = cols.map((c, i) => Math.max(c.length, ...strRows.map((r) => r[i]!.length)));

    header(cols, widths);
    for (const r of strRows) row(r, widths);
  } else if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith("$")) continue;
      console.log(`${pc.bold(padKey(k))}: ${cellStr(v)}`);
    }
  } else {
    console.log(String(data));
  }
}

function padKey(k: string): string {
  return k.padEnd(20);
}

function header(headers: string[], widths: number[]): void {
  console.log(headers.map((h, i) => pc.bold(h.padEnd(widths[i]!))).join("  "));
  console.log(widths.map((w) => "─".repeat(w)).join("──"));
}

function row(r: string[], widths: number[]): void {
  console.log(r.map((c, i) => c.padEnd(widths[i]!)).join("  "));
}

function cellStr(val: unknown): string {
  if (val === null || val === undefined) return pc.dim("-");
  if (typeof val === "boolean") return val ? pc.green("yes") : pc.red("no");
  if (typeof val === "bigint") return Number(val).toLocaleString();
  if (typeof val === "object") return JSON.stringify(val, jsonReplacer);
  return String(val);
}

function toYaml(data: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (data === null || data === undefined) return `${pad}null`;
  if (typeof data === "string") return `${pad}"${data}"`;
  if (typeof data === "number" || typeof data === "boolean" || typeof data === "bigint") return `${pad}${data}`;
  if (Array.isArray(data)) return data.map((item) => `${pad}- ${toYaml(item, indent + 1).trimStart()}`).join("\n");
  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>).filter(([k]) => !k.startsWith("$"));
    if (entries.length === 0) return `${pad}{}`;
    return entries.map(([k, v]) => `${pad}${k}: ${toYaml(v, indent + 1).trimStart()}`).join("\n");
  }
  return `${pad}${String(data)}`;
}
