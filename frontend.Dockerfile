FROM oven/bun:1.1.25 as builder
WORKDIR /app

COPY ./package.json ./bun.lockb ./
COPY ./packages/frontend/package.json ./packages/frontend/package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./packages/backend/package.json ./packages/backend/package.json
RUN bun install

COPY ./packages/frontend ./packages/frontend
COPY ./packages/backend ./packages/backend
RUN bun --filter frontend build

FROM caddy:2.8
COPY ./deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/packages/frontend/dist /usr/share/caddy


