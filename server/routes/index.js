const express = require('express');
const router = express.Router();

const resume = require('../data/resume');
const { getAllProjects } = require('../db/projects');

router.get('/', (req, res) => {
  const projects = getAllProjects();
  res.render('home', {
    title: 'Home',
    name: resume.name,
    contact: resume.contact,
    projects,
  });
});

module.exports = router;
