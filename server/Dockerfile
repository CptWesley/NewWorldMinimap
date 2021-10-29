# 1. Build the TypeScript app in one container.

FROM node@sha256:8f1827381eb7fca5a79ad21cb42e935546bedf67d9f668519a7db69d77d812bf as build

# 1.1 Set the directory in which the application will be built.
WORKDIR /server-build

# 1.2 Copy all server source files to the container.
COPY . .

# 1.3 Install dependencies, and build the application.
RUN yarn &&  \
    yarn build

# 2. Use the build artifacts to produce the actual runnable image.

FROM node@sha256:8f1827381eb7fca5a79ad21cb42e935546bedf67d9f668519a7db69d77d812bf as app

# 2.1 Set the directory in which the application will execute.
WORKDIR /home/node/app

# 2.2 Ensure the Node environment is set to `production`.
ENV NODE_ENV=production

# 2.3 Copy the build artifacts to dist/.
COPY --from=build --chown=node:node /server-build/build dist/.
# 2.4 Copy the package and lockfile into the image.
COPY --chown=node:node package.json yarn.lock ./

# 2.5 Install dependencies, change file permissions to be non-editable,
#     clean the dependency cache.
RUN yarn &&  \
    find . -type f -exec chmod 644 {} \; &&  \
    yarn cache clean

# 2.6 Set the user to one with fewer permissions.
USER node

# 2.7 Ensure the server is executed when launching.
CMD ["node", "dist/index.js"]
