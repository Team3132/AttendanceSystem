FROM node:22.14.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable
ENV COREPACK_INTEGRITY_KEYS=0

FROM base AS build-frontend
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG VERSION
ENV VITE_PUBLIC_APP_VERSION=$VERSION
RUN pnpm run --filter frontend build

FROM base AS frontend-runner
ARG VERSION
ENV VERSION=$VERSION
ENV NODE_ENV=production
COPY --from=build-frontend /app/packages/frontend/.output /app/.output
COPY --from=build-frontend /app/packages/frontend/package.json /app/package.json
COPY --from=build-frontend /app/packages/frontend/drizzle /app/drizzle
EXPOSE 3000
CMD [ "pnpm", "start" ]
