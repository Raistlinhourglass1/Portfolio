# node:20-slim (Debian, not Alpine) — better-sqlite3 is a native module and
# Alpine's musl libc is a common source of prebuilt-binary/compile headaches
# for it. Slim keeps the image reasonably small while avoiding that.
FROM node:20-slim

WORKDIR /app

# Install dependencies first so this layer is cached unless package*.json
# changes — much faster rebuilds when only app code changes.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# The SQLite DB is derived entirely from server/db/seed.js — there's no
# runtime-generated data to preserve yet, so re-seeding fresh on every
# container start is simpler than managing a persistent volume for it.
CMD ["sh", "-c", "node server/db/seed.js && node server/index.js"]
