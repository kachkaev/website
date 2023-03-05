FROM node:18.14.2-slim AS base

ENV NEXT_TELEMETRY_DISABLED true
ENV PLAYWRIGHT_BROWSERS_PATH=/playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD true

RUN npm install --global pnpm@7.28.0

################################################################################
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

################################################################################
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

################################################################################
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 10001 nodejs
RUN adduser --system --uid 10001 nextjs

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --production \
  && pnpm playwright install-deps firefox \
  && pnpm playwright install firefox

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone  ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static  ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public  ./public

RUN mkdir /data \
  && chown nextjs:nodejs /data
ENV DATA_DIR /data

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
