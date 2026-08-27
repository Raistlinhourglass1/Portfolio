const fs = require('fs');
const path = require('path');
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

  // Optional per-project logo/title graphic: drop a logo.png in a project's
  // image folder (server/public/images/<slug>/logo.png) and it's picked up
  // automatically — no data entry needed.
  const logoPath = path.join(__dirname, '..', 'public', 'images', project.slug, 'logo.png');
  const logoUrl = fs.existsSync(logoPath) ? `/images/${project.slug}/logo.png` : null;

  res.render('projects/show', { title: project.title, project, logoUrl });
});

module.exports = router;
