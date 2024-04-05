FROM node:21.7.2-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable

FROM base as build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG VERSION
ENV VITE_APP_VERSION=$VERSION
RUN pnpm run -r build
RUN pnpm deploy --filter backend --prod /opt/backend
# COPY /app/packages/frontend/dist /opt/backend/dist/frontend
RUN pnpm deploy --filter bot --prod /opt/bot

FROM base as backend-runner
ARG VERSION
ENV VERSION=$VERSION
ENV NODE_ENV=production
COPY --from=build /opt/backend /app
COPY --from=build /app/packages/frontend/dist /app/dist/frontend
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base as bot-runner
ARG VERSION
ENV VERSION=$VERSION
ENV NODE_ENV=production
COPY --from=build /opt/bot /app
CMD [ "pnpm", "start" ]

FROM scratch as backend-out
COPY --from=backend-runner /app/dist /

FROM scratch as bot-out
COPY --from=bot-runner /app/dist /