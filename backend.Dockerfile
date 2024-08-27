# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
COPY packages/backend/package.json /temp/dev/packages/backend/package.json
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
COPY packages/backend/package.json /temp/dev/packages/backend/package.json
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY ./tsconfig.json ./tsconfig.json
COPY ./packages/backend ./packages/backend

# [optional] tests & build
ENV NODE_ENV=production
RUN bun run --filter backend build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/packages/backend/dist ./packages/backend/dist

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "--filter backend","start" ]