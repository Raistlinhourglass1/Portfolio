const db = require('./index');

function parseRow(row) {
  if (!row) return row;
  return {
    ...row,
    tech_stack: JSON.parse(row.tech_stack || '[]'),
    images: JSON.parse(row.images || '[]'),
    links: JSON.parse(row.links || '{}'),
    featured: !!row.featured,
  };
}

function getAllProjects() {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, id ASC').all();
  return rows.map(parseRow);
}

function getProjectBySlug(slug) {
  const row = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug);
  return parseRow(row);
}

module.exports = { getAllProjects, getProjectBySlug };
