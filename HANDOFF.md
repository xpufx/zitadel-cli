# ZITADEL CLI / MCP — Handoff

**Date:** 2026-07-31
**Status:** Pausing work. All committed & pushed. Pick up here next time.

---

## Project Overview

TypeScript CLI + MCP server for managing ZITADEL (IAM). Two binaries, one config.

- **CLI:** `zitadel` — commander-based, ~150 commands
- **MCP server:** `zitadel-mcp` — stdio transport, ~140 tools, 1:1 with CLI commands
- **Web UI:** React/Vite frontend (separate, mostly unused)
- **CI:** Forgejo Actions at `forge.mrs.uppidi.com/xpufx-org/zitadel-cli` (workflow_dispatch: builds Docker image + release binaries)

## Repos

| Repo | Path | VCS | Remote |
|---|---|---|---|
| zitadel-cli | `/home/xpufx/code/zitadel-cli` | **jj** (git-backed, colocated) | `forge.mrs.uppidi.com/xpufx-org/zitadel-cli` |
| job-runner | `/home/xpufx/code/job-runner` | git | Forgejo |
| vendor/zitadel | `/home/xpufx/code/zitadel-cli/vendor/zitadel` | git | `github.com/zitadel/zitadel` (proto source) |

**jj is at `/home/xpufx/.cargo/bin/jj`** — not in PATH for the shell I use. Use it explicitly.

## Build Commands

```bash
# dev MCP binary (used by opencode config)
bun build --compile src/mcp/index.ts --outfile bin/zitadel-mcp

# release CLI binary
bun build --compile src/cli/index.ts --outfile dist/zitadel

# release MCP binary
bun build --compile src/mcp/index.ts --outfile dist/zitadel-mcp

# typecheck
pnpm run typecheck
```

## Configuration

Config resolved from: `~/.config/zitadel/config.toml` → `./.zitadel.toml` → env vars.

**Current `~/.config/zitadel/config.toml`** (global, used by opencode MCP):
```toml
api_url = "https://zit.mrs.uppidi.com"
token = "<PAT>"
system_key = "/home/xpufx/code/job-runner/services/zitadel/data/systemuser.pem"
system_user_id = "systemuser"
```

**Dual auth model** (important!):
- **PAT** → regular operations (user/org/project/app/session/etc.) via gRPC `clients.xxx.yyy()`
- **System JWT** → system/instance operations, signed fresh per request in `src/mcp/transport.ts`
  - `transport.ts` reads `system_key` + `system_user_id` from config
  - `sysFetch()` for system REST, `grpcFetch()` for instance gRPC-via-HTTP
  - Instance operations need system JWT — PAT fails with permission_denied

System key lives at `/home/xpufx/code/job-runner/services/zitadel/data/systemuser.pem`. Public key goes in ZITADEL's `ZITADEL_SYSTEMAPIUSERS` env.

**Auth doc:** `/tmp/ZITADEL-SYSTEM-LEVEL-AUTH.md` (may not survive reboot — recreate if needed).

## Architecture

```
src/
├── cli/
│   ├── index.ts            # commander entry, global --output flag
│   └── commands/*.ts       # 12 command files
├── core/
│   ├── index.ts            # barrel exports
│   ├── config.ts           # TOML/env config loading
│   ├── clients.ts          # 16 gRPC service clients
│   ├── auth.ts             # signSystemJwt (RS256, 1h expiry)
│   ├── format.ts           # printResult + stripProto (oneof/BigInt/timestamp cleaning)
│   ├── descriptions.ts     # DESC registry — single source of truth for descriptions
│   ├── oidc.ts             # OIDC enum string→int parsers (grantTypes, responseTypes, authMethod)
│   └── types.ts
├── mcp/
│   ├── index.ts            # MCP server (stdio), ListTools + CallTool handlers
│   ├── transport.ts        # sysFetch/grpcFetch — system JWT auth for system/instance
│   ├── tools.ts            # ToolDef type
│   └── tools/*.ts          # 13 files: per-command-group tool factories + api.ts
├── state.ts                # lazy client init
└── web/                    # React UI (unused)
```

**Descriptions:** All CLI `.description()` and MCP `description:` pull from `src/core/descriptions.ts` (DESC registry). Never hardcode descriptions — add to DESC and reference.

## opencode MCP Config

`~/.config/opencode/opencode.jsonc`:
- `zitadel` → `/home/xpufx/code/zitadel-cli/bin/zitadel-mcp` (our MCP server, enabled)
- `warnyin-zitadel` → `@warnyin/zitadel-mcp` (3rd party, disabled)
- After rebuilding `bin/zitadel-mcp`, restart opencode: `systemctl --user restart opencode` (NOT paseo restart — doesn't work for me)

## Known Bugs / Gotchas

1. **`app_update` field name:** must use `oidcConfigurationRequest` (→ `oidc_configuration_request` in proto), NOT `oidcConfiguration`. Using the wrong name silently no-ops (returns zero changeDate). Fixed in both `src/cli/commands/app.ts` and `src/mcp/tools/app.ts`.

2. **`stripProto` oneof handling:** protobuf oneofs come as `{ case: "...", value: {...} }`. `stripProto` unwraps to `value`. Without this, responses show `"config": "oidcConfig"` instead of the actual data.

3. **BigInt serialization:** `stripProto` converts `bigint` → `Number`. Without it, `JSON.stringify` throws "Cannot serialize BigInt" (hit with `session_list`/`user_list`).

4. **npm package schema gaps:** `@zitadel/proto@1.3.1` is behind vendor protos. Some schemas (e.g. `GenerateRecoveryCodesRequestSchema`, `SetOrganizationSettingsRequestSchema`) exist in vendor protos but NOT in npm package. Check `node -e "import('...').then(m => console.log(Object.keys(m)))"` before assuming a schema exists.

## OIDC Proxy Work (job-runner, separate repo)

We debugged proxy mode for `run-public.uppidi.com`. Key findings:

- `OIDC_MODE=proxy` in `.env` makes the web server reverse-proxy OIDC paths to ZITADEL
- Must set `OIDC_PROXY_TARGET=http://localhost:8080` (local HTTP, avoids HTTP/2 header limit that breaks with HTTPS target)
- Must set `OIDC_PROXY_UI_TARGET=http://localhost:3000` + `OIDC_PROXY_UI_PATHS=/ui/v2/login/,/resources/` so the login UI renders
- `mainProxy.ModifyResponse` in `app/pkg/webserver/server.go` rewrites ZITADEL's redirect Location headers to the original request domain
- **`OIDC_DOMAIN_MAP` is NOT needed** — verifier falls back to default issuer
- Device auth (RFC 8628) needs no redirect URIs; auth code flow always needs them registered
- **Important:** `run.mrs.uppidi.com` works in `direct` mode already. Don't conflate web-server proxy mode with the API-backend IDP proxy — different things.

ZITADEL instance domains (after cleanup): `zit.mrs.uppidi.com` (primary), `run.mrs.uppidi.com`, `zit-public.uppidi.com`, `run-public.uppidi.com` + 2 generated.

## Remaining Work (priorities)

1. **Rebuild `dist/zitadel`** — standalone CLI binary is currently MISSING from dist/ (only JS bundle + MCP binaries there). One command: `bun build --compile src/cli/index.ts --outfile dist/zitadel`.

2. **Proto code generator** — biggest open item. CHECKLIST shows only 170/754 operations (23%) covered. Plan was a ~200-line TS generator reading `vendor/zitadel/proto/zitadel/` that outputs MCP tool defs + CLI command handlers with an auth override table (`InstanceService`/`SystemService` → system JWT, rest → PAT). No existing tool does this for TS. Options considered: `openapi-mcp-generator` (loses proto types), `protoc-gen-go-mcp` (Go, not TS).

3. **Missing tool categories** (from `CHECKLIST.md`):
   - Privacy/notification policy writes (`UpdatePrivacyPolicy`, `UpdateNotificationPolicy`)
   - IDP provider management (30+ ops: Google, GitHub, LDAP, SAML, etc.)
   - SMTP/email/SMS provider config
   - Message templates (init, password reset, etc.)
   - Org-scoped Management API (176 ops)
   - Some blocked by npm schema gaps

4. **`scripts/checklist.mjs`** — regenerate `CHECKLIST.md` after adding tools. Detection scans for `clients.xxx.yyy()` calls + raw HTTP patterns. Deduplicates services.

## Key Files / Scripts

- `scripts/checklist.mjs` — generates `CHECKLIST.md` (coverage audit)
- `scripts/audit-proto.mjs` — lists all RPCs vs what we use
- `CHECKLIST.md` — 170/754 operations, organized by proto file
- `.forgejo/workflows/build.yml` — CI (build + release + docker push)
- `Dockerfile` — multi-stage: oven/bun builder → debian:stable-slim runtime

## Live Environment

- **ZITADEL:** `https://zit.mrs.uppidi.com` (v4.15.3, podman containers `job-runner-zitadel-*`)
- **Instance ID:** `378090086585074738`
- **Job Runner app (OIDC):** `Job Runner Web` client `378126268362654735`
- **CLI Native App (device auth):** client `380611164893088274`
- opencode restarted via `systemctl --user restart opencode`
