const express = require('express');
const router = express.Router();

const resume = require('../data/resume');

router.get('/', (req, res) => {
  res.render('about', { title: 'About / Contact', contact: resume.contact, name: resume.name });
});

module.exports = router;
