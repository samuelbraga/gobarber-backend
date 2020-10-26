FROM node:12-alpine AS builder

WORKDIR /app
COPY . /app
RUN yarn
RUN yarn eslint --ext .ts ./src
RUN yarn test
RUN yarn build

FROM node:12-alpine AS server

ENV NODE_ENV=production
ENV PORT=80

WORKDIR /app
ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock
ADD ormconfig.json /app/ormconfig.json
RUN yarn
COPY --from=builder /app/dist /app/dist

WORKDIR /app/dist
ENTRYPOINT [ "node", "shared/infra/http/server.js" ]

