# Work Plan

## Phase 0 — Scaffold
- [ ] Initialize TypeScript project (pnpm workspace)
- [ ] Install all dependencies
- [ ] Set up tsconfig, vite config, tsup config
- [ ] Create directory structure: `src/core/`, `src/cli/`, `src/web/`, `src/transport/`
- [ ] Configure vitest
- [ ] `.todo/` tracking

## Phase 1 — Foundation
- [ ] Config file loader (TOML)
- [ ] Config locations: `~/.config/zitadel/config.toml`, `./.zitadel.toml`, env vars
- [ ] Auth (PAT, system JWT)
- [ ] Transport factories (node + browser)
- [ ] Service client registry — wrap all 14 v2 services (the `🔧` ones missing from client)
- [ ] Generic CLI dispatch layer — maps `resource verb` → `client.method(args)`
- [ ] Generic request builder — CLI flags → proto message
- [ ] Output formatting (table, JSON, YAML)
- [ ] `--help` at every level
- [ ] Commander setup with all command stubs

## Phase 2 — Core CRUD (User + Org + Project + App)
- [ ] `user` — create/get/list/update/delete/deactivate/reactivate/lock/unlock
- [ ] `user email`, `user phone`, `user password`
- [ ] `user passkey`, `user totp`, `user u2f`, `user otp-sms`, `user otp-email`
- [ ] `user recovery-codes`, `user secret`, `user key`, `user pat`
- [ ] `user idp-link`, `user metadata`, `user auth-methods`, `user invite`
- [ ] `org` — create/get/list/update/delete/activate/deactivate
- [ ] `org domain`, `org metadata`
- [ ] `project` — create/get/list/update/delete/activate/deactivate
- [ ] `project role`, `project grant`
- [ ] `app` — create/get/list/update/delete/activate/deactivate
- [ ] `app secret`, `app key`

## Phase 3 — Settings + Features (mostly reads)
- [ ] `settings general`, `settings login`, `settings branding`, `settings domain`
- [ ] `settings lockout`, `settings password-complexity`, `settings password-expiry`
- [ ] `settings security`, `settings active-idps`, `settings link`, `settings effective`
- [ ] `settings org`, `settings hosted-login`
- [ ] `feature` — system/instance/org/user get/set/reset

## Phase 4 — Extended Services
- [ ] `session` — create/get/list/set/delete
- [ ] `group` — create/get/list/update/delete + users
- [ ] `authorization` — create/list/update/delete/activate/deactivate
- [ ] `webkey` — create/list/activate/delete
- [ ] `idp` — get

## Phase 5 — V1 Fallbacks (Admin + Management + System)
- [ ] `admin` — settings writes (login/lockout/password/branding/domain/idp/smtp/notification)
- [ ] `admin` — label policy, text customization
- [ ] `admin` — oidc settings, security policy
- [ ] `management` — org-level policy overrides
- [ ] `management` — custom label/text per org
- [ ] `system` — `healthz`
- [ ] `system` — `instance create` (CreateInstance)
- [ ] `system` — quotas, limits, features
- [ ] `system` — views, failed events, domain management

## Phase 6 — Web UI
- [ ] React app scaffold (Vite)
- [ ] Auth login page
- [ ] User management views
- [ ] Organization management views
- [ ] Project + App management views
- [ ] Settings views
- [ ] Navigation + routing

## Phase 7 — Polish
- [ ] Comprehensive tests (vitest)
- [ ] CI/CD pipeline
- [ ] README + usage docs
- [ ] Error handling polish
- [ ] Output format consistency
- [ ] Tab completion for shell
