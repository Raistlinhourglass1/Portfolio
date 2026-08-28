// Regenerates server/data/Justin Hendrix Resume.pdf from the current
// server/data/resume.js content, via the print-only /resume/print route
// (server/views/resume-pdf.ejs) — a dense, single-page serif layout meant
// to match the user's actual resume format, deliberately independent of
// the site's dark theme.
//
// Requires the dev server to be running first (npm run dev), since this
// hits the route over HTTP rather than rendering the template directly.
// puppeteer is a devDependency only — not installed in production
// (Dockerfile uses `npm ci --omit=dev`), so this never runs at runtime.
//
// Usage: node server/scripts/generate-resume-pdf.js [base-url]
//   base-url defaults to http://localhost:3000

const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const baseUrl = process.argv[2] || 'http://localhost:3000';
const OUT_PATH = path.join(__dirname, '..', 'data', 'Justin Hendrix Resume.pdf');

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/resume/print`, { waitUntil: 'networkidle0' });

  const pdfBytes = await page.pdf({
    format: 'Letter',
    printBackground: true,
    margin: { top: '0in', bottom: '0in', left: '0in', right: '0in' },
  });

  fs.writeFileSync(OUT_PATH, Buffer.from(pdfBytes));

  const pageCount = (Buffer.from(pdfBytes).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`Wrote ${OUT_PATH} (${pdfBytes.length} bytes, ~${pageCount} page(s)).`);
  if (pageCount > 1) {
    console.warn(`Warning: resume is ${pageCount} pages — target is 1. Check server/views/resume-pdf.ejs sizing.`);
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
