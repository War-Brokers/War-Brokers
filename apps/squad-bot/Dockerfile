# Check https://turbo.build/repo/docs/handbook/deploying-with-docker for more info


FROM node:18-alpine AS base


#
#
#


FROM base AS builder
WORKDIR /app

# install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# required for pnpm global install
# https://github.com/pnpm/pnpm/issues/784#issuecomment-1518582235
ENV PNPM_HOME=/usr/local/bin
ENV PATH="${PATH}:${PNPM_HOME}"

# prepare files
COPY . .
RUN echo "{}" > apps/squad-bot/src/serviceAccountKey.json

# generate /app/out
RUN pnpm install -g turbo
RUN turbo prune --scope=@warbrokers/squad-bot

# make /app/out/apps/squad-bot distributable
WORKDIR /app/out
RUN pnpm install
RUN pnpm turbo run build --filter=@warbrokers/squad-bot --include-dependencies --no-deps --no-cache
RUN pnpm dlx firebase-pnpm-workspaces --filter=@warbrokers/squad-bot

# remove node_modules
WORKDIR /app/out/apps/squad-bot
RUN rm -rf node_modules


#
#
#


FROM base AS runner

# prevent production from running as root
USER node
WORKDIR /home/node

# copy necessary files
COPY --from=builder --chown=node:node /app/out/apps/squad-bot .

# install production deps only
RUN npm install --omit=dev

CMD ["node", "."]
