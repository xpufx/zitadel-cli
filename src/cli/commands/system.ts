import { Command } from "commander";
import { printResult, handleError, DESC } from "../../core";
import { getClients } from "../../state";

const SVC = "/system/v1/";

interface InstanceListQuery {
  limit: number;
  offset: number;
}

interface InstanceListRequest {
  query: InstanceListQuery;
}

interface InstanceDetail {
  id: string;
  name: string;
  state: number;
  domains: Array<{ domain: string; primary: boolean }>;
}

interface InstanceListResponse {
  details: { totalResult: number };
  result: InstanceDetail[];
}

interface CreateInstanceRequest {
  name: string;
}

interface CreateInstanceResponse {
  id: string;
  name: string;
}

interface GetInstanceResponse {
  instance: InstanceDetail;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getClients().config.token}`,
    "Content-Type": "application/json",
  };
}

async function sysFetch<T>(path: string, body: object): Promise<T> {
  const baseUrl = getClients().config.apiUrl.replace(/\/+$/, "");
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export function systemCommand(cmd: Command): void {
  cmd
    .command("healthz")
    .description(DESC.system_health)
    .action(async () => {
      try {
        const res = await fetch(`${getClients().config.apiUrl.replace(/\/+$/, "")}/healthz`);
        const data: { status: string } = await res.json();
        printResult(data);
      } catch (e) { handleError(e); }
    });

  const inst = cmd.command("instance").description("Manage instances (system API)");
  inst
    .command("list")
    .description(DESC.system_instance_list)
    .option("--limit <n>", "", "100")
    .option("--offset <n>", "", "0")
    .action(async (opts) => {
      try {
        const body: InstanceListRequest = { query: { limit: Number(opts.limit), offset: Number(opts.offset) } };
        const res = await sysFetch<InstanceListResponse>(`${SVC}instances/_search`, body);
        printResult(res);
      } catch (e) { handleError(e); }
    });

  inst
    .command("get <id>")
    .description(DESC.system_instance_get)
    .action(async (id) => {
      try {
        const res = await sysFetch<GetInstanceResponse>(`${SVC}instances/${id}`, {});
        printResult(res);
      } catch (e) { handleError(e); }
    });

  inst
    .command("create")
    .description(DESC.system_instance_create)
    .requiredOption("--name <name>")
    .action(async (opts) => {
      try {
        const body: CreateInstanceRequest = { name: opts.name };
        const res = await sysFetch<CreateInstanceResponse>(`${SVC}instances/_create`, body);
        printResult(res);
      } catch (e) { handleError(e); }
    });
}
