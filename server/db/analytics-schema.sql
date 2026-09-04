-- Page-visit log for the whole site. Lives in its OWN sqlite file
-- (analytics.sqlite), separate from portfolio.sqlite: the content DB is
-- disposable and reseeded on every deploy, this one accumulates and must
-- survive deploys — point ANALYTICS_DB_PATH at a Docker volume in prod.
--
-- No raw IPs are stored. visitor_hash / ip_hash are salted SHA-256 digests
-- (see analytics.js) — enough to count unique visitors, not enough to
-- recover the address.

CREATE TABLE IF NOT EXISTS page_visits (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  visited_at    TEXT NOT NULL DEFAULT (datetime('now')),  -- UTC, 'YYYY-MM-DD HH:MM:SS'
  path          TEXT NOT NULL,                             -- req.path, no querystring
  query         TEXT DEFAULT '',                           -- raw querystring (no leading '?')
  status        INTEGER,                                   -- final HTTP response status
  visitor_hash  TEXT,                                      -- hash(ip + '|' + user agent) — unique-visitor key
  ip_hash       TEXT,                                      -- hash(ip) — unique-network key
  country       TEXT DEFAULT '',                           -- ISO code from GeoIP ('' if unknown/local)
  region        TEXT DEFAULT '',
  city          TEXT DEFAULT '',
  lat           REAL,
  lon           REAL,
  user_agent    TEXT DEFAULT '',
  browser       TEXT DEFAULT '',                           -- parsed from UA
  os            TEXT DEFAULT '',
  device        TEXT DEFAULT 'desktop',                    -- 'desktop' | 'mobile' | 'tablet' | ...
  is_bot        INTEGER NOT NULL DEFAULT 0,                -- 1 if UA looks like a crawler/bot
  referrer      TEXT DEFAULT '',                           -- raw Referer header
  referrer_host TEXT DEFAULT ''                            -- hostname parsed out of the Referer ('' = direct)
);

CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON page_visits (visited_at);
CREATE INDEX IF NOT EXISTS idx_page_visits_path       ON page_visits (path);
CREATE INDEX IF NOT EXISTS idx_page_visits_is_bot     ON page_visits (is_bot);
