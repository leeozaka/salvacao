FROM node:22-slim AS deps

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl curl && \
    rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

FROM node:22-slim AS builder

WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY package.json yarn.lock ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY src ./src

RUN npx prisma generate

RUN yarn build

FROM node:22-slim AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /usr/src/app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /usr/src/app/prisma ./prisma
COPY --chown=appuser:nodejs package.json ./

USER appuser

EXPOSE 3344
EXPOSE 5555

CMD ["yarn", "start"]