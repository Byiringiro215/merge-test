# ---- Stage: build ----
FROM oven/bun:1.3.4 AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL

RUN bun run build

# ---- Stage: runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "build"]
