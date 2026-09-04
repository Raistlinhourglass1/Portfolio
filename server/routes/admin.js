const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const { getStats } = require('../db/analytics');

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// HTTP Basic Auth — no sessions/cookies to manage. If ADMIN_PASSWORD is unset
// the area is closed rather than open, so a misconfigured deploy can't leak
// the visit log.
router.use((req, res, next) => {
  if (!ADMIN_PASSWORD) {
    return res
      .status(503)
      .send('Admin area is not configured. Set the ADMIN_PASSWORD env var.');
  }

  const [scheme, encoded] = (req.get('authorization') || '').split(' ');
  if (scheme === 'Basic' && encoded) {
    const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');
    if (user === ADMIN_USER && pass && safeEqual(pass, ADMIN_PASSWORD)) {
      return next();
    }
  }

  res.set('WWW-Authenticate', 'Basic realm="Portfolio admin", charset="UTF-8"');
  return res.status(401).send('Authentication required.');
});

router.get('/', (req, res) => res.redirect('/admin/stats'));

router.get('/stats', (req, res) => {
  const includeBots = req.query.bots === '1';
  const days = Math.min(
    Math.max(parseInt(req.query.days, 10) || 30, 1),
    365
  );
  res.render('admin/stats', {
    title: 'Visit stats',
    stats: getStats({ includeBots, days }),
  });
});

module.exports = router;
