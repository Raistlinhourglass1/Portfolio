const express = require('express');
const router = express.Router();

const resume = require('../data/resume');

router.get('/', (req, res) => {
  res.render('resume', { title: 'Resume', resume });
});

// Downloadable PDF version, rendered from the same resume data. TODO: wire
// up actual PDF generation (e.g. Puppeteer rendering this same view, or a
// PDF template lib) — currently a stub.
router.get('/download', (req, res) => {
  res.status(501).send('Resume PDF not generated yet.');
});

module.exports = router;
