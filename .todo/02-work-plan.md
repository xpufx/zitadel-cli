# Work Plan

## Phase 0 — Scaffold ✅
- [x] Initialize TypeScript project (pnpm workspace)
- [x] Install all dependencies
- [x] Set up tsconfig, vite config, tsup config
- [x] Create directory structure: `src/core/`, `src/cli/`, `src/web/`, `src/transport/`
- [x] Configure vitest
- [x] `.todo/` tracking

## Phase 1 — Foundation ✅
- [x] Config file loader (TOML)
- [x] Config locations: `~/.config/zitadel/config.toml`, `./.zitadel.toml`, env vars
- [x] Auth (PAT, system JWT)
- [x] Transport factories (node + browser)
- [x] Service client registry — wrap all 14 v2 services (the `🔧` ones missing from client)
- [ ] Generic CLI dispatch layer — maps `resource verb` → `client.method(args)`  *(skipped — explicit Commander commands chosen instead)*
- [ ] Generic request builder — CLI flags → proto message  *(skipped — manual `create(Schema)` per command)*
- [x] Output formatting (table, JSON, YAML)
- [x] `--help` at every level
- [x] Commander setup with all command stubs

## Phase 2 — Core CRUD (User + Org + Project + App) ✅
- [x] `user` — create/get/list/update/delete/deactivate/reactivate/lock/unlock
- [x] `user email`, `user phone`, `user password`
- [x] `user passkey`, `user totp`, `user u2f`, `user otp-sms`, `user otp-email`
- [x] `user recovery-codes`, `user secret`, `user key`, `user pat`
- [x] `user idp-link`, `user metadata`, `user auth-methods`, `user invite`
- [x] `org` — create/get/list/update/delete/activate/deactivate
- [x] `org domain`, `org metadata`
- [x] `project` — create/get/list/update/delete/activate/deactivate
- [x] `project role`, `project grant`
- [x] `app` — create/get/list/update/delete/activate/deactivate
- [x] `app secret`, `app key`

## Phase 3 — Settings + Features ✅
- [x] `settings general`, `settings login`, `settings branding`, `settings domain`
- [x] `settings lockout`, `settings password-complexity`, `settings password-expiry`
- [x] `settings security`, `settings active-idps`
- [ ] `settings link`, `settings effective`  *(not implemented)*
- [x] `settings org`, `settings hosted-login`
- [x] `feature` — system/instance/org/user get/reset
- [x] `feature` — system set
- [ ] `feature` — instance/org/user set  *(proto lacks feature flag fields)*

## Phase 4 — Extended Services ✅
- [x] `session` — create/get/list/set/delete
- [ ] `group` — create/get/list/update/delete + users  *(not in npm package yet)*
- [x] `authorization` — create/list/update/delete/activate/deactivate
- [x] `webkey` — create/list/activate/delete
- [x] `idp` — get

## Phase 5 — V1 Fallbacks (Admin + Management + System) 🔶
- [ ] `admin` — settings writes (login/lockout/password/branding/domain/idp/smtp/notification)
- [ ] `admin` — label policy, text customization
- [ ] `admin` — oidc settings, security policy
- [ ] `management` — org-level policy overrides
- [ ] `management` — custom label/text per org
- [x] `system` — `healthz`
- [x] `system` — `instance create` / list / get
- [ ] `system` — quotas, limits, features
- [ ] `system` — views, failed events, domain management

## Phase 6 — Web UI ✅
- [x] React app scaffold (Vite + React Router)
- [x] Auth login page
- [x] User management views (list + detail)
- [x] Organization management views (list + detail)
- [x] Project + App management views (list + detail)
- [x] Settings views
- [x] Navigation + routing (with auth guard)

## Phase 7 — Polish 🔶
- [ ] Comprehensive tests (vitest)
- [ ] CI/CD pipeline
- [ ] README + usage docs
- [x] Error handling polish
- [x] Output format consistency (table/JSON/YAML + `--output` flag)
- [ ] Tab completion for shell
