# ---- Stage: build ----
FROM oven/bun:1.3.4 AS build
WORKDIR /app

COPY package.json bun.lock .npmrc ./
RUN bun install --frozen-lockfile

COPY . .

# PUBLIC_API_URL is read at runtime via $env/dynamic/public, not baked here.
# Set it in the container environment (docker-compose `environment:` block).
RUN bun run build

# ---- Stage: prod-deps ----
FROM oven/bun:1.3.4 AS prod-deps
WORKDIR /app

COPY package.json bun.lock .npmrc ./
RUN bun install --frozen-lockfile --production --ignore-scripts

# ---- Stage: runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Use 127.0.0.1 (not localhost) — Node listens on 0.0.0.0 (IPv4 only),
# but `localhost` resolves to ::1 in Alpine and the connect refuses.
# Hit /signin so a backend outage doesn't flap container health.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/signin || exit 1

CMD ["node", "build"]
