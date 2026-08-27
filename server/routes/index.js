const express = require('express');
const router = express.Router();

const resume = require('../data/resume');

router.get('/', (req, res) => {
  res.render('home', { title: 'Home', name: resume.name });
});

module.exports = router;
