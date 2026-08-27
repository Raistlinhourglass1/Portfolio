const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('resume', { title: 'Resume' });
});

// Downloadable PDF version, served from the same underlying data (TODO).
router.get('/download', (req, res) => {
  res.status(501).send('Resume PDF not generated yet.');
});

module.exports = router;
