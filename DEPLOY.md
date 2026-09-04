# Deployment

Handoff doc for deploying this site on the self-hosted Linux server, behind Caddy,
matching how the other two sites there are already set up (Docker containers,
Caddy reverse-proxying to each by container name/port).

**Not yet tested against a real Docker daemon** — written on a Windows dev machine with
no Docker installed. Whoever runs this first (likely Claude Code running directly on the
server, which can see the real Caddy config and other containers) should expect to debug
minor issues, not treat this as a finished, verified setup.

## Why this is Docker-based

The other two sites on this server are already Docker containers behind Caddy, so this
follows the same pattern rather than introducing a different deployment style for one site.

## The video files problem (read this first)

`server/public/videos/` is **gitignored** — see the "Immediate Next Steps" / media handling
notes in `PROJECT_BRIEF.md`. A `git clone`/`git pull` on the server will **not** bring the
actual video files (trailers, Behind the Scenes clips) with it. Two options:

1. **Copy the folder manually once** (and after adding new videos): `rsync` or `scp`
   `server/public/videos/` from wherever the real files live (this dev machine, or the DAS
   once that's set up) to the server, then bind-mount it into the container (see the compose
   snippet below) so a container rebuild doesn't need the files baked into the image.
2. If the DAS is mounted on the server itself, point the bind mount straight at that instead
   of a copy — avoids keeping two copies in sync.

Do **not** try to work around this by removing videos/ from `.gitignore` — that would commit
tens/hundreds of MB of binary video into git history, which is exactly what the original
`.gitignore` design (see `PROJECT_BRIEF.md`) was written to avoid.

## Visit analytics — needs a persistent volume (read this before deploying)

The site logs every page view to a **second** SQLite file (`page_visits` table)
that powers the `/admin/stats` dashboard. Unlike `portfolio.sqlite` (rebuilt from
`seed.js` on every start), this one **accumulates and must survive redeploys** —
give it a named volume, not a bind mount over `server/db/` (that would shadow the
schema files).

Env vars for the container (add to the compose `environment:` block):

| Var | Purpose | Notes |
|-----|---------|-------|
| `ANALYTICS_DB_PATH` | where the visit-log DB lives | point at the mounted volume, e.g. `/data/analytics.sqlite` |
| `ADMIN_PASSWORD` | password for `/admin/stats` (Basic Auth, user `admin`) | **if unset, `/admin` returns 503** and the dashboard is closed |
| `ADMIN_USER` | dashboard username | optional, defaults to `admin` |
| `TRUST_PROXY` | reverse-proxy hop count | defaults to `1` (single Caddy hop) — needed for real client IPs / GeoIP |
| `ANALYTICS_HASH_SALT` | salt for hashing visitor IPs | optional; auto-generated next to the DB as `analytics-salt` on first run |

No raw IP addresses are stored — only salted hashes (for unique-visitor counts)
plus coarse GeoIP (country/region/city) from the bundled `geoip-lite` dataset.
`geoip-lite` adds ~150 MB to the image and ~100 MB RSS to the running container;
refresh its dataset periodically with `npm run --prefix node_modules/geoip-lite updatedb`
(or just rebuild the image).

## Files in this repo for deployment

- `Dockerfile` — `node:20-slim` base (not Alpine — better-sqlite3 is a native module and
  Alpine's musl libc is a common source of prebuilt-binary headaches for it), installs prod
  deps only, runs `server/db/seed.js` then `server/index.js` on container start.
- `.dockerignore` — excludes `node_modules`, `.git`, the gitignored `originals/` folders, and
  `*.sqlite*` (the DB is fully re-derived from `seed.js` on every start, so there's nothing
  worth persisting there yet — no volume needed for it).

## Build & run (adapt paths/names to match the other two sites' convention)

```bash
git clone https://github.com/Raistlinhourglass1/Portfolio.git portfolio-site
cd portfolio-site
# one-time: bring the real video files onto the server (see above)
rsync -av /path/to/real/videos/ ./server/public/videos/
docker build -t portfolio-site .
```

### docker-compose service (merge into the existing compose file for the other sites)

```yaml
services:
  portfolio:
    build: ./portfolio-site
    container_name: portfolio-site
    restart: unless-stopped
    environment:
      - PORT=3000
      - TRUST_PROXY=1
      - ANALYTICS_DB_PATH=/data/analytics.sqlite
      - ADMIN_USER=admin
      - ADMIN_PASSWORD=${PORTFOLIO_ADMIN_PASSWORD:?set this in the host .env}
    volumes:
      # Real video files live on the host (or DAS mount), not in the image —
      # see "The video files problem" above.
      - ./portfolio-site/server/public/videos:/app/server/public/videos:ro
      # Visit-analytics DB — must persist across redeploys (see the analytics
      # section above). Named volume, not a bind mount over server/db/.
      - portfolio-analytics:/data
    expose:
      - "3000"
    networks:
      - <whatever network the other two sites/Caddy already share>

volumes:
  portfolio-analytics:
```

### Caddy block (adapt domain/subdomain)

```
portfolio.yourdomain.com {
    reverse_proxy portfolio-site:3000
}
```

## Redeploying after a change

The content DB (`portfolio.sqlite`) reseeds itself on every container start and has no
volume, so a redeploy won't lose project data. The analytics DB *does* have a volume
(`portfolio-analytics`) and survives redeploys — don't `docker volume rm` it unless you
mean to wipe visit history. A redeploy is just:

```bash
cd portfolio-site
git pull
# if new videos were added, rsync those over too
docker compose up -d --build portfolio
```

Consider wrapping the above in a small `deploy.sh` on the server once this is confirmed
working, per the earlier discussion about keeping this simple rather than setting up a full
CI/webhook pipeline for a low-traffic solo portfolio site.
