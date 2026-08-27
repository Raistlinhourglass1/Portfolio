-- Projects table.
-- tech_stack, images, and links are stored as JSON text (SQLite has no array/object
-- type) — parse with JSON.parse() in JS, keeps things simple for a solo project db.

CREATE TABLE IF NOT EXISTS projects (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT NOT NULL UNIQUE,       -- URL segment, e.g. "esoterra"
  title        TEXT NOT NULL,
  summary      TEXT,                       -- short blurb for card/grid view
  description  TEXT,                       -- full case-study body (HTML or Markdown)
  role         TEXT,                       -- e.g. "Team Lead", "Full-stack Developer"
  tech_stack   TEXT DEFAULT '[]',          -- JSON array of strings, e.g. ["Unreal Engine", "C++"]
  images       TEXT DEFAULT '[]',          -- JSON array of image paths/URLs
  video_url    TEXT,                       -- optional demo video URL
  bts_images   TEXT DEFAULT '[]',          -- JSON array of "behind the scenes" image paths
                                            -- (dev/debug captures, WIP shots) — shown in a
                                            -- collapsed section, opt-in for the visitor
  bts_videos   TEXT DEFAULT '[]',          -- JSON array of "behind the scenes" video paths
  links        TEXT DEFAULT '{}',          -- JSON object, e.g. {"github": "...", "live": "..."}
  featured     INTEGER NOT NULL DEFAULT 0, -- 0/1 — show in the highlighted/top section
  sort_order   INTEGER NOT NULL DEFAULT 0, -- lower = earlier in listings
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects (sort_order);
