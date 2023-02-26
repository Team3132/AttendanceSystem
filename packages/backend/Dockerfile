FROM node:18-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node prisma /home/node/prisma
COPY --chown=node:node security ./home/node/security
RUN yarn install
RUN npx prisma generate

COPY --chown=node:node . .
RUN yarn build
RUN yarn install --production

# ---

FROM node:18-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/prisma/ /home/node/prisma/
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/security/ ./security/

CMD npx prisma migrate deploy && node dist/main.js --enable-source-maps