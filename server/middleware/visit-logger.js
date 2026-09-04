const { UAParser } = require('ua-parser-js');
const { isbot } = require('isbot');
const geoip = require('geoip-lite');

const { recordVisit, hash } = require('../db/analytics');

// express.static runs before this middleware, so normal asset requests never
// reach here. This regex catches the stragglers (404'd assets, odd paths) plus
// anything under /admin (the dashboard shouldn't log itself).
const ASSET_EXT =
  /\.(css|js|mjs|map|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|eot|txt|xml|webmanifest)$/i;

function shouldSkip(req) {
  if (req.method !== 'GET') return true;
  if (req.path === '/favicon.ico') return true;
  if (req.path.startsWith('/admin')) return true;
  if (ASSET_EXT.test(req.path)) return true;
  return false;
}

function clientIp(req) {
  // 'trust proxy' is set in index.js, so req.ip already unwraps
  // X-Forwarded-For from Caddy. Socket address is the local-dev fallback.
  return req.ip || (req.socket && req.socket.remoteAddress) || '';
}

function refererHost(referer) {
  if (!referer) return '';
  try {
    return new URL(referer).hostname;
  } catch {
    return '';
  }
}

module.exports = function visitLogger(req, res, next) {
  if (shouldSkip(req)) return next();

  // Read everything off the request now; the actual DB write happens on
  // 'finish' (after the response is sent) so it adds no latency and can
  // record the final status code.
  const ip = clientIp(req);
  const ua = req.get('user-agent') || '';
  const referer = req.get('referer') || '';
  const geo = ip ? geoip.lookup(ip) : null;
  const parsed = new UAParser(ua).getResult();

  const qIndex = req.originalUrl.indexOf('?');

  const visit = {
    path: req.path,
    query: qIndex === -1 ? '' : req.originalUrl.slice(qIndex + 1),
    visitor_hash: ip ? hash(ip + '|' + ua) : null,
    ip_hash: ip ? hash(ip) : null,
    country: (geo && geo.country) || '',
    region: (geo && geo.region) || '',
    city: (geo && geo.city) || '',
    lat: geo && geo.ll ? geo.ll[0] : null,
    lon: geo && geo.ll ? geo.ll[1] : null,
    user_agent: ua,
    browser: (parsed.browser && parsed.browser.name) || '',
    os: (parsed.os && parsed.os.name) || '',
    device: (parsed.device && parsed.device.type) || 'desktop',
    is_bot: isbot(ua) ? 1 : 0,
    referrer: referer,
    referrer_host: refererHost(referer),
  };

  res.on('finish', () => {
    try {
      recordVisit({ ...visit, status: res.statusCode });
    } catch (err) {
      // Analytics must never take a page down with it.
      console.error('visit-logger: failed to record visit:', err.message);
    }
  });

  next();
};
