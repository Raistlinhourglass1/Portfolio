const path = require('path');
const express = require('express');
const router = express.Router();

const resume = require('../data/resume');

// Pre-designed resume PDF, kept alongside the structured resume data. This
// is the file you actually hand to employers — the /resume HTML page below
// is a separate, hand-styled rendering of the same underlying content, not
// a template this PDF is generated from.
const RESUME_PDF_PATH = path.join(__dirname, '..', 'data', 'Justin Hendrix Resume.pdf');

router.get('/', (req, res) => {
  res.render('resume', { title: 'Resume', resume });
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
