FROM node:22.11.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG VERSION
ENV VITE_PUBLIC_APP_VERSION=$VERSION
RUN pnpm run --filter backend build
RUN pnpm run --filter frontend build
RUN pnpm run --filter bot build
RUN pnpm deploy --filter backend --prod /opt/backend
# COPY /app/packages/frontend/dist /opt/backend/dist/frontend
RUN pnpm deploy --filter bot --prod /opt/bot

FROM base AS backend-runner
ARG VERSION
ENV VERSION=$VERSION
ENV NODE_ENV=production
COPY --from=build /opt/backend /app
COPY --from=build /app/packages/frontend/dist /app/dist/frontend
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS bot-runner
ARG VERSION
ENV VERSION=$VERSION
ENV NODE_ENV=production
COPY --from=build /opt/bot /app
CMD [ "pnpm", "start" ]

FROM caddy:2.9 AS frontend-runner
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/packages/frontend/dist /usr/share/caddy