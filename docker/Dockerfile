ARG WEB_RUNTIME_CACHED_VERSION

FROM node:14.17-alpine as builder

RUN rm -rf /app \
    && mkdir /app

# node_modules 清理工具
RUN wget https://gobinaries.com/tj/node-prune -O ./node-prune.sh \
    && sh ./node-prune.sh \
    && rm -f ./node-prune.sh

WORKDIR /app
ADD ./ /app
RUN cd /app \
    && yarn \
    && yarn build

### build node server
RUN yarn tsc ./server/index.ts

### 重新安装node server需要运行的依赖.
RUN yarn install --prod

### 清理多余的node modules
RUN node-prune

FROM node:14.17-alpine

RUN apk add bash --no-cache

ENV PORT=3000

ADD ./docker/entrypoint.sh /bin/entrypoint.sh

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/server/index.js /app/server/index.js
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/.yarnrc /app/.yarnrc
COPY --from=builder /app/.npmrc /app/.npmrc

EXPOSE 3000

ENTRYPOINT ["bash", "/bin/entrypoint.sh"]