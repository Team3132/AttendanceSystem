FROM node:22.13.1-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG VERSION
ENV VITE_PUBLIC_APP_VERSION=$VERSION
RUN pnpm run --filter frontend build
RUN pnpm run --filter bot build
RUN pnpm deploy --filter frontend --prod /opt/frontend
RUN pnpm deploy --filter bot --prod /opt/bot

FROM base AS frontend-runner
ARG VERSION
ENV VERSION=$VERSION
ENV NODE_ENV=production
COPY --from=build /opt/frontend /app
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS bot-runner
ARG VERSION
ENV VERSION=$VERSION
ENV NODE_ENV=production
COPY --from=build /opt/bot /app
CMD [ "pnpm", "start" ]