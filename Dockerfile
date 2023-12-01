FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS front
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter frontend
RUN pnpm front build

FROM base AS prod-deps-back
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --filter backend

FROM base AS build-back
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter backend
RUN pnpm back build

FROM scratch AS back-out
COPY --from=build-back /app/packages/backend/dist /app/packages/backend/dist

FROM base
ARG VERSION
ENV VERSION=$VERSION
COPY --from=prod-deps-back /app/node_modules /app/node_modules
COPY --from=prod-deps-back /app/packages/backend/node_modules /app/packages/backend/node_modules
COPY --from=build-back /app/packages/backend/dist /app/packages/backend/dist
COPY --from=front /app/packages/frontend/dist /app/packages/backend/dist/frontend
EXPOSE 3000
CMD [ "pnpm", "back", "start" ]