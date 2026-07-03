FROM oven/bun:latest AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build:binary && bun run build:mcp:binary

FROM debian:stable-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/dist/zitadel /usr/local/bin/zitadel
COPY --from=builder /app/dist/zitadel-mcp /usr/local/bin/zitadel-mcp
CMD ["zitadel"]
