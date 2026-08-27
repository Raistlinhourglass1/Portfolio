const express = require('express');
const router = express.Router();

const { getAllProjects, getProjectBySlug } = require('../db/projects');

router.get('/', (req, res) => {
  const projects = getAllProjects();
  res.render('projects/index', { title: 'Projects', projects });
});

router.get('/:slug', (req, res, next) => {
  const project = getProjectBySlug(req.params.slug);
  if (!project) return next(); // fall through to 404
  res.render('projects/show', { title: project.title, project });
});

module.exports = router;
