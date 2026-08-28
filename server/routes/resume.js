const path = require('path');
const express = require('express');
const router = express.Router();

const resume = require('../data/resume');

// The actual PDF handed to employers, kept alongside the structured resume
// data. It's generated offline (not per-request) from views/resume-pdf.ejs
// via the /print route below + Puppeteer — see server/scripts/
// generate-resume-pdf.js. The /resume HTML page is a separate, hand-styled
// rendering of the same underlying data for browsing on the site; neither
// page generates the PDF live.
const RESUME_PDF_PATH = path.join(__dirname, '..', 'data', 'Justin Hendrix Resume.pdf');

router.get('/', (req, res) => {
  res.render('resume', { title: 'Resume', resume });
});

// Print-only template for regenerating the PDF (see above) — not linked in
// nav, not meant for normal browsing.
router.get('/print', (req, res) => {
  res.render('resume-pdf', { resume });
});

router.get('/download', (req, res) => {
  const filename = `${resume.name.replace(/\s+/g, '-')}-Resume.pdf`;
  res.download(RESUME_PDF_PATH, filename, (err) => {
    if (err && !res.headersSent) {
      console.error('Resume PDF download failed:', err);
      res.status(500).send('Failed to download resume PDF.');
    }
  });
});

module.exports = router;
