const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');

// Kept separate from ./index.js (portfolio.sqlite) on purpose: that DB is
// rebuilt from seed.js on every container start, this one must persist. In
// production set ANALYTICS_DB_PATH to a file on a mounted Docker volume.
const DB_PATH =
  process.env.ANALYTICS_DB_PATH || path.join(__dirname, 'analytics.sqlite');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(fs.readFileSync(path.join(__dirname, 'analytics-schema.sql'), 'utf8'));

// --- IP hashing -------------------------------------------------------------
// A static salt over the ~4B IPv4 space would be trivially reversible, so the
// salt has to be secret. Prefer an explicit env var; otherwise generate one
// once and stash it next to the DB (same volume, so it persists with the data
// it protects). Rotating the salt just resets unique-visitor counting.
function resolveSalt() {
  if (process.env.ANALYTICS_HASH_SALT) return process.env.ANALYTICS_HASH_SALT;
  const saltPath = path.join(path.dirname(DB_PATH), 'analytics-salt');
  try {
    return fs.readFileSync(saltPath, 'utf8').trim();
  } catch {
    const s = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(saltPath, s, { mode: 0o600 });
    return s;
  }
}
const SALT = resolveSalt();

function hash(value) {
  return crypto
    .createHash('sha256')
    .update(SALT + '|' + value)
    .digest('hex')
    .slice(0, 32);
}

// --- writes ---------------------------------------------------------------
const insertStmt = db.prepare(`
  INSERT INTO page_visits
    (path, query, status, visitor_hash, ip_hash, country, region, city, lat, lon,
     user_agent, browser, os, device, is_bot, referrer, referrer_host)
  VALUES
    (@path, @query, @status, @visitor_hash, @ip_hash, @country, @region, @city, @lat, @lon,
     @user_agent, @browser, @os, @device, @is_bot, @referrer, @referrer_host)
`);

function recordVisit(visit) {
  insertStmt.run(visit);
}

// --- reads (admin dashboard) --------------------------------------------
function getStats({ includeBots = false, days = 30 } = {}) {
  const bot = includeBots ? '1=1' : 'is_bot = 0';
  const nDays = Number.isFinite(days) ? Math.trunc(days) : 30;
  const since = `datetime('now', '-${nDays} days')`; // nDays is a vetted integer

  const totals = db
    .prepare(
      `SELECT COUNT(*) AS visits, COUNT(DISTINCT visitor_hash) AS visitors
       FROM page_visits WHERE ${bot}`
    )
    .get();

  const recent = db
    .prepare(
      `SELECT COUNT(*) AS visits, COUNT(DISTINCT visitor_hash) AS visitors
       FROM page_visits WHERE ${bot} AND visited_at >= ${since}`
    )
    .get();

  const botCount = db
    .prepare(`SELECT COUNT(*) AS n FROM page_visits WHERE is_bot = 1`)
    .get().n;

  const firstVisit = db
    .prepare(`SELECT MIN(visited_at) AS t FROM page_visits`)
    .get().t;

  const pages = db
    .prepare(
      `SELECT path,
              COUNT(*) AS visits,
              COUNT(DISTINCT visitor_hash) AS visitors,
              MAX(visited_at) AS last_visit
       FROM page_visits WHERE ${bot}
       GROUP BY path
       ORDER BY visits DESC`
    )
    .all();

  const referrers = db
    .prepare(
      `SELECT COALESCE(NULLIF(referrer_host, ''), '(direct / none)') AS host,
              COUNT(*) AS visits
       FROM page_visits WHERE ${bot}
       GROUP BY host ORDER BY visits DESC LIMIT 15`
    )
    .all();

  const countries = db
    .prepare(
      `SELECT COALESCE(NULLIF(country, ''), '—') AS country,
              COUNT(*) AS visits,
              COUNT(DISTINCT visitor_hash) AS visitors
       FROM page_visits WHERE ${bot}
       GROUP BY country ORDER BY visits DESC LIMIT 20`
    )
    .all();

  const browsers = db
    .prepare(
      `SELECT COALESCE(NULLIF(browser, ''), 'Unknown') AS name, COUNT(*) AS visits
       FROM page_visits WHERE ${bot}
       GROUP BY name ORDER BY visits DESC LIMIT 10`
    )
    .all();

  const systems = db
    .prepare(
      `SELECT COALESCE(NULLIF(os, ''), 'Unknown') AS name, COUNT(*) AS visits
       FROM page_visits WHERE ${bot}
       GROUP BY name ORDER BY visits DESC LIMIT 10`
    )
    .all();

  const devices = db
    .prepare(
      `SELECT COALESCE(NULLIF(device, ''), 'desktop') AS name, COUNT(*) AS visits
       FROM page_visits WHERE ${bot}
       GROUP BY name ORDER BY visits DESC`
    )
    .all();

  // Dense day series: one entry per day across the whole window, zero-filled
  // where there were no visits, so the chart always reads as a timeline
  // instead of collapsing to a single block on a quiet day.
  const perDayRows = db
    .prepare(
      `SELECT substr(visited_at, 1, 10) AS day,
              COUNT(*) AS visits,
              COUNT(DISTINCT visitor_hash) AS visitors
       FROM page_visits WHERE ${bot} AND visited_at >= ${since}
       GROUP BY day`
    )
    .all();
  const perDayMap = new Map(perDayRows.map((r) => [r.day, r]));
  const perDay = [];
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  cursor.setUTCDate(cursor.getUTCDate() - (nDays - 1));
  for (let i = 0; i < nDays; i++) {
    const key = cursor.toISOString().slice(0, 10);
    const hit = perDayMap.get(key);
    perDay.push({
      day: key,
      visits: hit ? hit.visits : 0,
      visitors: hit ? hit.visitors : 0,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const recentVisits = db
    .prepare(
      `SELECT visited_at, path, status, country, city, browser, os, device, is_bot,
              COALESCE(NULLIF(referrer_host, ''), '(direct)') AS referrer_host
       FROM page_visits
       ORDER BY id DESC LIMIT 100`
    )
    .all();

  return {
    includeBots,
    days: nDays,
    firstVisit,
    totals,
    recent,
    botCount,
    pages,
    referrers,
    countries,
    browsers,
    systems,
    devices,
    perDay,
    recentVisits,
  };
}

module.exports = { db, hash, recordVisit, getStats };
