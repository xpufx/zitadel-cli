# Project Rules

## Safety
- Don't write buggy code that wipes data
- Wide-scope destructive ops (org/instance delete, bulk ops) get `--confirm`
- All errors captured and surfaced — no silent catches, no void try/catch

## Type Safety
- No anonymous data structures — every shape has a named type/interface
- No `any` or `as unknown` casts — use proper discriminated unions

## API Design
- No fallbacks — if a v2 endpoint doesn't exist, error out, don't silently call v1
- No backward compatibility — clean break, no deprecated API support unless explicitly listed
- No magic defaults — required flags are required
- Strict mode — fail on unknown flags

## Code Style
- No comments in code
- Mirror ZITADEL v2 naming for RPC mapping
- CLI flags: kebab-case, Typescript: camelCase

## Dependencies
- `@zitadel/client` + `@zitadel/proto` from npm (vendor/ is read-only reference)
- Latest stable versions only
