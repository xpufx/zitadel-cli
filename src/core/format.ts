import pc from "picocolors";

export type OutputFormat = "table" | "json" | "yaml";

export function setOutputFormat(format: OutputFormat): void {
  _format = format;
}

let _format: OutputFormat = "table";

const jsonReplacer = (_key: string, value: unknown) => typeof value === "bigint" ? Number(value) : value;

export function printResult(data: unknown): void {
  switch (_format) {
    case "json":
      console.log(JSON.stringify(data, jsonReplacer, 2));
      break;
    case "yaml":
      console.log(toYaml(data));
      break;
    case "table":
      printTable(data);
      break;
  }
}

function printTable(data: unknown): void {
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object" && data[0] !== null) {
    const headers = Object.keys(data[0] as Record<string, unknown>);
    const rows = data.map((item) => headers.map((h) => formatCell((item as Record<string, unknown>)[h])));
    const colWidths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i]!.length)));
    header(headers, colWidths);
    for (const row of rows) printRow(row, colWidths);
  } else if (typeof data === "object" && data !== null) {
    for (const [k, v] of Object.entries(data)) {
      if (k.startsWith("$")) continue;
      console.log(`${pc.bold(k)}: ${formatCell(v)}`);
    }
  } else {
    console.log(String(data));
  }
}

function header(headers: string[], widths: number[]): void {
  const line = headers.map((h, i) => pc.bold(h.padEnd(widths[i]!))).join("  ");
  console.log(line);
  console.log(widths.map((w) => "─".repeat(w)).join("──"));
}

function printRow(row: string[], widths: number[]): void {
  console.log(row.map((c, i) => c.padEnd(widths[i]!)).join("  "));
}

function formatCell(val: unknown): string {
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
  if (Array.isArray(data)) {
    if (data.length === 0) return `${pad}[]`;
    return data.map((item) => `${pad}- ${toYaml(item, indent + 1).trimStart()}`).join("\n");
  }
  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return `${pad}{}`;
    return entries.map(([k, v]) => `${pad}${k}: ${toYaml(v, indent + 1).trimStart()}`).join("\n");
  }
  return `${pad}${String(data)}`;
}
