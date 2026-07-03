# zitadel-cli

A CLI for managing [ZITADEL](https://zitadel.com) — the identity platform. Supports user, org, project, app, session, authorization, feature, and instance management via gRPC and the ZITADEL Management/System APIs.

## Quick Start

```bash
# Install dependencies & build
npm install
npm run cli:build

# Run directly with tsx
npm run cli -- --help

# Build a standalone binary (requires bun)
npm run build:binary
./dist/zitadel --help
```

## Configuration

The CLI resolves its config in this order (later sources override earlier ones):

1. `~/.config/zitadel/config.toml` — user-level config file
2. `./.zitadel.toml` — project-level config file
3. Environment variables

### Config file (`config.toml`)

```toml
api_url = "https://your-instance.zitadel.cloud"
token = "your_pat_token"
default_org_id = "org_id"
token_type = "pat"       # "pat" (default) or "system"
system_key = """-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----"""
system_user_id = "user_id_for_system_key"
```

### Environment variables

| Variable | Description |
|---|---|
| `ZITADEL_API_URL` | ZITADEL instance URL |
| `ZITADEL_TOKEN` | PAT bearer token (required when `token_type = pat`) |
| `ZITADEL_ORG_ID` | Default organization ID |
| `ZITADEL_TOKEN_TYPE` | `pat` (default) or `system` |
| `ZITADEL_SYSTEM_KEY` | RSA private key for system auth |
| `ZITADEL_SYSTEM_USER_ID` | User ID for system auth JWT subject |

### Authentication

- **PAT (`token_type = "pat"`):** set `token` (or `ZITADEL_TOKEN`) — sent as a static Bearer header on every request.
- **System (`token_type = "system"`):** set `system_key` (RSA private key) and `system_user_id`. The CLI signs an RS256 JWT per request (audience = apiUrl, subject = systemUserId) and sends it as the Bearer token. No static `token` is needed in this mode.

## Global Flags

| Flag | Default | Description |
|---|---|---|
| `--output <format>` | `table` | Output format: `table`, `json`, or `yaml` |
| `--version` | | Print version (0.0.1) |

## Commands

### user

Manage users — create, update, delete, manage authentication factors, metadata, passkeys, and more.

| Command | Description |
|---|---|
| `user create` | Create a machine user |
| `user create-human` | Create a human user |
| `user update <id>` | Update a user (username) |
| `user update-human <id>` | Update a human user profile |
| `user list` | List users |
| `user get <id>` | Get a user by ID |
| `user delete <id>` | Permanently delete a user |
| `user deactivate <id>` | Deactivate a user |
| `user reactivate <id>` | Reactivate a deactivated user |
| `user lock <id>` | Lock a user (prevents login) |
| `user unlock <id>` | Unlock a locked user |
| `user email set <id>` | Set a user's email |
| `user email verify <id>` | Verify email with a code |
| `user email resend-code <id>` | Resend email verification code |
| `user email send-code <id>` | Send email verification code |
| `user phone set <id>` | Set a user's phone number |
| `user phone remove <id>` | Remove a user's phone number |
| `user phone verify <id>` | Verify phone with a code |
| `user phone resend-code <id>` | Resend phone verification code |
| `user password set <id>` | Set a user's password |
| `user password reset <id>` | Reset a user's password |
| `user metadata list <id>` | List user metadata |
| `user metadata set <id>` | Set user metadata |
| `user metadata delete <id>` | Delete user metadata |
| `user auth-methods <id>` | List user authentication methods |
| `user auth-factors <id>` | List user authentication factors |
| `user passkeys <id>` | List user passkeys |
| `user remove-passkey <id> <passkey-id>` | Remove a passkey |
| `user keys <id>` | List user keys |
| `user remove-key <id> <key-id>` | Remove a user key |
| `user pats <id>` | List personal access tokens |
| `user remove-pat <id> <token-id>` | Remove a PAT |
| `user idp-links <id>` | List IDP links |
| `user remove-idp-link <id> <idp-id>` | Remove an IDP link |
| `user pat add <id>` | Create a personal access token |
| `user secret add <id>` | Add a secret to a machine user |
| `user secret remove <id>` | Remove secrets from a machine user |
| `user idp-link add <id>` | Add an IDP link to a user |
| `user passkey register <id>` | Register a new passkey |
| `user passkey verify <id>` | Verify passkey registration |
| `user passkey link <id>` | Create a passkey registration link |
| `user u2f register <id>` | Register a U2F security key |
| `user u2f verify <id>` | Verify U2F registration |
| `user u2f remove <id> <u2f-id>` | Remove a U2F security key |
| `user totp register <id>` | Register a TOTP authenticator |
| `user totp verify <id>` | Verify TOTP registration |
| `user totp remove <id>` | Remove TOTP authenticator |
| `user otp-sms add <id>` | Add OTP SMS to a user |
| `user otp-sms remove <id>` | Remove OTP SMS from a user |
| `user otp-email add <id>` | Add OTP email to a user |
| `user otp-email remove <id>` | Remove OTP email from a user |
| `user mfa-skip <id>` | Skip MFA initialization for a user |
| `user invite create <id>` | Create an invite code |
| `user invite resend <id>` | Resend an invite code |
| `user invite verify <id>` | Verify an invite code |

### org

Manage organizations — create, update, delete, activate/deactivate, manage domains and metadata.

| Command | Description |
|---|---|
| `org create` | Create an organization |
| `org list` | List organizations |
| `org update <id>` | Update an organization name |
| `org delete <id>` | Delete an organization |
| `org activate <id>` | Activate an organization |
| `org deactivate <id>` | Deactivate an organization |
| `org domain add <id>` | Add a domain to an organization |
| `org domain list <id>` | List organization domains |
| `org domain delete <id>` | Remove a domain from an organization |
| `org domain verify <id>` | Verify an organization domain |
| `org domain generate-validation <id>` | Generate domain validation token |
| `org metadata set <id>` | Set organization metadata |
| `org metadata list <id>` | List organization metadata |
| `org metadata delete <id>` | Delete organization metadata |

### project

Manage projects — create, update, delete, activate/deactivate, manage roles and grants.

| Command | Description |
|---|---|
| `project list` | List projects |
| `project get <id>` | Get a project by ID |
| `project create` | Create a project |
| `project update <id>` | Update a project |
| `project delete <id>` | Delete a project |
| `project deactivate <id>` | Deactivate a project |
| `project activate <id>` | Activate a project |
| `project role add <id>` | Add a role to a project |
| `project role update <id> <key>` | Update a project role |
| `project role remove <id> <key>` | Remove a project role |
| `project role list <id>` | List project roles |
| `project grant create <id>` | Grant a project to another organization |
| `project grant update <id> <grant-org-id>` | Update a project grant |
| `project grant delete <id> <grant-org-id>` | Delete a project grant |
| `project grant activate <id> <grant-org-id>` | Activate a project grant |
| `project grant deactivate <id> <grant-org-id>` | Deactivate a project grant |
| `project grant list` | List project grants |

### settings

Read or set instance/org-level settings.

| Command | Description |
|---|---|
| `settings general` | Get general settings |
| `settings login` | Get login policy |
| `settings branding` | Get branding settings |
| `settings password-complexity` | Get password complexity policy |
| `settings password-expiry` | Get password expiry policy |
| `settings lockout` | Get lockout policy |
| `settings domain` | Get domain policy |
| `settings security` | Get security settings |
| `settings set-security` | Set security settings (impersonation, CSS, JS) |
| `settings active-idps` | List active identity providers |
| `settings hosted-login get` | Get hosted login translations for a locale |
| `settings hosted-login set` | Set hosted login translations for a locale |

### app

Manage applications within a project (OIDC, SAML, API).

| Command | Description |
|---|---|
| `app list` | List apps in a project |
| `app get <id>` | Get an app by ID |
| `app create` | Create an app (oidc, saml, or api) |
| `app update <id>` | Update an app |
| `app delete <id>` | Delete an app |
| `app deactivate <id>` | Deactivate an app |
| `app reactivate <id>` | Reactivate an app |
| `app secret generate <id>` | Generate a new app secret |
| `app key create <id>` | Create an app signing key |
| `app key get <id>` | Get an app key |
| `app key list` | List app keys |
| `app key delete <id>` | Delete an app key |

### feature

Manage feature flags for system, instance, org, and user levels.

| Command | Description |
|---|---|
| `feature system get` | Get system feature flags |
| `feature system reset` | Reset system feature flags |
| `feature system set` | Set system feature flags (from JSON) |
| `feature instance get` | Get instance feature flags |
| `feature instance reset` | Reset instance feature flags |
| `feature org get <id>` | Get org feature flags |
| `feature org reset <id>` | Reset org feature flags |
| `feature user get <id>` | Get user feature flags |
| `feature user reset <id>` | Reset user feature flags |

### session

Manage sessions — list, get, create, update, delete.

| Command | Description |
|---|---|
| `session list` | List sessions |
| `session get <id>` | Get a session by ID |
| `session delete <id>` | Delete a session |
| `session create` | Create a new session |
| `session set <id>` | Update a session |

### authorization

Manage authorizations (user grants).

| Command | Description |
|---|---|
| `authorization list` | List authorizations |
| `authorization delete <id>` | Delete an authorization |
| `authorization activate <id>` | Activate an authorization |
| `authorization deactivate <id>` | Deactivate an authorization |
| `authorization create` | Create a user grant |
| `authorization update <id>` | Update a user grant's roles |

### webkey

Manage web signing keys.

| Command | Description |
|---|---|
| `webkey list` | List web keys |
| `webkey activate <id>` | Activate a web key |
| `webkey create` | Create a web key (rsa, ecdsa, or ed25519) |
| `webkey delete <id>` | Delete a web key |

### idp

Look up identity providers.

| Command | Description |
|---|---|
| `idp get <id>` | Get an identity provider by ID |

### system

System API for self-hosted ZITADEL instances.

| Command | Description |
|---|---|
| `system healthz` | Check if ZITADEL is running |
| `system instance list` | List instances |
| `system instance get <id>` | Get an instance by ID |
| `system instance create` | Create a new instance |

### instance

Manage instances.

| Command | Description |
|---|---|
| `instance list` | List instances |
| `instance get <id>` | Get an instance by ID |
| `instance update <id>` | Update an instance |
| `instance delete <id>` | Delete an instance |
| `instance domain add <id>` | Add a custom domain to an instance |
| `instance domain remove <id>` | Remove a custom domain |
| `instance domain list <id>` | List custom domains |
| `instance trusted-domain add <id>` | Add a trusted domain |
| `instance trusted-domain remove <id>` | Remove a trusted domain |
| `instance trusted-domain list <id>` | List trusted domains |

## MCP Server

The project includes an [MCP](https://modelcontextprotocol.io) (Model Context Protocol) server that exposes all ZITADEL operations as tools for AI assistants.

It uses **stdio transport** — spawn it as a subprocess from any MCP client (Claude Desktop, opencode, VS Code, Cursor, etc.). No HTTP server needed.

### Configuration

Uses the same config resolution as the CLI — `~/.config/zitadel/config.toml`, `./.zitadel.toml`, or env vars.

### Usage

```bash
# Run with tsx
pnpm mcp

# Example MCP client config (opencode/Claude Desktop):
# {
#   "mcpServers": {
#     "zitadel": {
#       "command": "pnpm",
#       "args": ["--dir", "/path/to/zitadel-cli", "mcp"]
#     }
#   }
# }
```

### Available Tools

The server exposes **~85 tools** covering all command groups:

| Category | Tools | Description |
|---|---|---|
| User | 48 | CRUD, passkeys, TOTP, U2F, OTP, PATs, secrets, metadata, auth factors, IDP links, invites |
| Org | 14 | Create/update/delete, domains, metadata |
| Project | 16 | CRUD, roles, grants (create/update/delete/activate/deactivate) |
| App | 11 | CRUD, secrets, keys |
| Settings | 12 | General, login, branding, password complexity/expiry, lockout, domain, security, hosted login |
| Feature | 9 | Get/set/reset for system, instance, org, user |
| Session | 5 | List, get, create, update, delete |
| Authorization | 6 | List, create, update, delete, activate, deactivate |
| Webkey | 4 | List, create, activate, delete |
| IDP | 1 | Get by ID |
| System | 4 | Healthz, instance list/get/create |
| Instance | 10 | CRUD, custom domains, trusted domains |

Each tool returns JSON output. On error, `isError: true` is set with the error message.

## Development

```bash
# Run the CLI
pnpm cli -- <command>

# Run the MCP server
pnpm mcp

# Type-check
pnpm typecheck

# Run tests
pnpm test

# Build for distribution (JS bundle)
pnpm cli:build

# Build a standalone binary (~99 MB, glibc-linked, no Node.js needed)
pnpm build:binary
```

The CLI uses [commander](https://github.com/tj/commander.js) for argument parsing and [@zitadel/client](https://www.npmjs.com/package/@zitadel/client) for gRPC transport.
