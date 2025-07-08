# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# COPY --from=install /temp/prod/node_modules node_modules
COPY ./drizzle .
COPY ./.output .output
COPY ./package.json .
ARG VITE_VERSION
ENV VITE_VERSION=$VITE_VERSION

# run the app
USER bun
EXPOSE 1420/tcp
ENTRYPOINT [ "bun", "start" ]