# https://medium.com/@tonistiigi/advanced-multi-stage-build-patterns-6f741b852fae

# -------------------------------
# base default image for shared
# envs
# -------------------------------
FROM node:13.12.0-alpine3.11 AS base

ARG NODE_ENV=${NODE_ENV:-"production"}
ARG NPM_CONFIG_LOGLEVEL=${NPM_CONFIG_LOGLEVEL:-"warn"}
ENV NPM_CONFIG_LOGLEVEL="${NPM_CONFIG_LOGLEVEL}"
ENV NODE_ENV="${NODE_ENV}"
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# -----------------------------------
# build step for npm dependencies
# depending of NODE_ENV npm install
# will install devDependencies or not
# -----------------------------------
FROM base AS builder

# Install build toolchain, install node deps and compile native add-ons
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++

WORKDIR /usr/src/app/

## install dependencies
COPY package*.json ./
RUN npm ci

# -------------------------------
# release image (default build on your ci)
# -------------------------------
FROM base AS release

# Copy built node modules and binaries without including the toolchain
COPY --from=builder /usr/src/app/node_modules/ /usr/src/app/node_modules/
RUN apk --update add postgresql-client

WORKDIR /usr/src/app/
COPY . .

EXPOSE 8080
CMD ["sh", "init-service.sh"]
