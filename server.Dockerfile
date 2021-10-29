# First, build the TypeScript app in one container

FROM node@sha256:8f1827381eb7fca5a79ad21cb42e935546bedf67d9f668519a7db69d77d812bf as build

WORKDIR /server-build

COPY server .

RUN ls -al && yarn &&  \
    yarn build

# Use the build artifacts to produce the actual runnable image

FROM node@sha256:8f1827381eb7fca5a79ad21cb42e935546bedf67d9f668519a7db69d77d812bf as app

WORKDIR /home/node/app

ENV NODE_ENV=production

COPY --from=build --chown=node:node /server-build/build .
COPY --chown=node:node server/package.json server/yarn.lock ./

RUN yarn &&  \
    find . -type f -exec chmod 644 {} \; &&  \
    yarn cache clean &&  \
    apk add --no-cache curl

USER node

CMD ["node", "index.js"]
