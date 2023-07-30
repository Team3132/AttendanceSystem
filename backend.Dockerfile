FROM node:20-alpine as basebackend
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
COPY packages/backend/package.json packages/backend/tsconfig.json packages/backend/tsup.config.ts ./packages/backend/

FROM node:20-alpine as basefrontend
WORKDIR /app
COPY packages/frontend/package.json packages/frontend/tsconfig.json packages/frontend/tsconfig.node.json packages/frontend/vite.config.ts packages/frontend/index.html ./packages/frontend/


FROM basefrontend as buildfrontend
WORKDIR /app
RUN yarn front install --frozen-lockfile
COPY packages/frontend/src ./packages/frontend/src
RUN yarn front build

FROM basebackend as buildbackend
WORKDIR /app
RUN yarn back install --frozen-lockfile
COPY packages/backend/src ./packages/backend/src
COPY packages/backend/drizzle ./packages/backend/drizzle
COPY --from=buildfrontend /app/packages/frontend/dist ./packages/backend/public/frontend
RUN yarn back build

FROM basebackend as runner
WORKDIR /app
ENV NODE_ENV production
RUN yarn back install --frozen-lockfile --production
COPY --from=buildbackend /app/packages/backend/dist /app/packages/backend/dist

EXPOSE 3000
CMD yarn back start