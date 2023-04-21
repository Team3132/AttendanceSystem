FROM node:20-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY --chown=node:node ./packages/backend .
COPY --chown=node:node yarn.lock .

RUN yarn install --frozen-lockfile
RUN npx prisma generate

RUN yarn build
RUN yarn install --production --frozen-lockfile

# ---

FROM node:20-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/prisma/ /home/node/prisma/
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/security/ ./security/

CMD npx prisma migrate deploy && node dist/main.js --enable-source-maps