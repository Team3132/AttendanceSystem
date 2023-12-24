FROM node:21-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app



FROM base AS prod-deps-backend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --filter backend

FROM base as prod-deps-bot
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --filter bot

FROM base AS build-backend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter backend
RUN pnpm backend build

FROM base as build-bot
COPY --from=build-backend /app/packages/backend/dist /app/packages/backend/dist
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter bot
RUN pnpm bot build

FROM base AS build-frontend
COPY --from=build-backend /app/packages/backend/dist /app/packages/backend/dist
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter frontend
RUN pnpm frontend build

FROM scratch AS backend-out
COPY --from=build-backend /app/packages/backend/dist /app/packages/backend/dist

FROM scratch AS bot-out
COPY --from=build-bot /app/packages/bot/dist /app/packages/bot/dist

FROM base as backend-runner
ARG VERSION
ENV VERSION=$VERSION
ENV NODE_ENV=production
COPY --from=prod-deps-backend /app/node_modules /app/node_modules
COPY --from=prod-deps-backend /app/packages/backend/node_modules /app/packages/backend/node_modules
COPY --from=build-backend /app/packages/backend/dist /app/packages/backend/dist
COPY --from=build-frontend /app/packages/frontend/dist /app/packages/backend/dist/frontend
EXPOSE 3000
CMD [ "pnpm", "backend", "start" ]

FROM base as bot-runner
ARG VERSION
ENV VERSION=$VERSION
ENV NODE_ENV=production
COPY --from=prod-deps-bot /app/node_modules /app/node_modules
COPY --from=prod-deps-bot /app/packages/bot/node_modules /app/packages/bot/node_modules
COPY --from=build-bot /app/packages/bot/dist /app/packages/bot/dist

CMD [ "pnpm", "bot", "start" ]