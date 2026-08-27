const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();

const resume = require('../data/resume');

router.get('/', (req, res) => {
  res.render('resume', { title: 'Resume', resume });
});

// Downloadable PDF, rendered from the exact same /resume page — one
// template, two outputs, so HTML and PDF can never drift out of sync.
// Puppeteer loads the live page and prints it; @media print rules in
// style.css hide the nav/download button in the printed output.
router.get('/download', async (req, res) => {
  let browser;
  try {
    const url = `${req.protocol}://${req.get('host')}/resume`;
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    // Puppeteer's page.pdf() returns a Uint8Array (not a Node Buffer) —
    // wrap it, otherwise Express's res.send() serializes it as JSON
    // instead of sending raw PDF bytes.
    const pdfBuffer = Buffer.from(
      await page.pdf({
        format: 'Letter',
        printBackground: true,
        margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
      })
    );

    const filename = `${resume.name.replace(/\s+/g, '-')}-Resume.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Resume PDF generation failed:', err);
    res.status(500).send('Failed to generate resume PDF.');
  } finally {
    if (browser) await browser.close();
  }
});

module.exports = router;
