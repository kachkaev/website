## pnpm’s official image only contains pnpm’s standalone binary (https://pnpm.io/docker).
## Node.js for the build comes from `devEngines.runtime` in package.json.
FROM ghcr.io/pnpm/pnpm:12.11.2 AS pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

################################################################################
## Production dependencies (i.e. Playwright) are copied to the runner in full, because
## Next.js output file tracing misses files that Playwright loads dynamically (e.g. browsers.json)
FROM pnpm AS prod-deps

RUN --mount=type=cache,id=pnpm,target=/var/cache/pnpm \
  pnpm install --frozen-lockfile --prod --ignore-scripts --store-dir=/var/cache/pnpm

################################################################################
FROM pnpm AS build

ENV NEXT_TELEMETRY_DISABLED=true

RUN --mount=type=cache,id=pnpm,target=/var/cache/pnpm \
  pnpm install --frozen-lockfile --store-dir=/var/cache/pnpm

COPY . .

RUN pnpm run build

################################################################################
FROM node:24.21.0-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=0

RUN addgroup --system --gid 10001 nodejs \
  && adduser --system --uid 10001 nextjs \
  && mkdir /data \
  && chown nextjs:nodejs /data

COPY --from=prod-deps /app/node_modules ./node_modules

## Headless launches use chromium-headless-shell, so full Chromium is not needed
RUN node node_modules/playwright/cli.js install --with-deps --only-shell chromium \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

ENV DATA_DIR=/data

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
