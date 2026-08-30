const fs = require('fs');
const path = require('path');

// SVG icons adapted from Simple Icons (simpleicons.org, CC0-licensed) or, for
// generic (non-brand) glyphs like "mail" and "file-doc", Material Icons
// (Apache 2.0) — self-hosted here rather than pulled from a CDN at request
// time, no external dependency, no third-party request per page load.
const ICONS_DIR = path.join(__dirname, 'tech-icons');

const cache = {};

function getIconBySlug(slug) {
  if (!slug) return null;
  if (slug in cache) return cache[slug];

  const filePath = path.join(ICONS_DIR, `${slug}.svg`);
  const svg = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  cache[slug] = svg;
  return svg;
}

// Only technologies with a real, recognizable logo get an icon; others (e.g.
// "Blueprints", "VR", "C#" — no simple-icons entry for the language itself)
// fall back to plain text.
const SLUG_BY_TECH = {
  'Unreal Engine': 'unrealengine',
  'C++': 'cplusplus',
  Unity: 'unity',
  React: 'react',
  'Node.js': 'nodedotjs',
  MySQL: 'mysql',
  Express: 'express',
  Python: 'python',
  'TensorFlow/Keras': 'tensorflow',
  'scikit-learn': 'scikitlearn',
  pandas: 'pandas',

  // Resume "Technical Skills" section — no real logo for "VS Code",
  // "Visual Studio", "SQL (Postgres)", or "Matplotlib" in simple-icons, so
  // those intentionally fall back to text-only rather than a placeholder.
  Java: 'openjdk',
  'C/C++': 'cplusplus',
  JavaScript: 'javascript',
  'HTML/CSS': 'html5',
  R: 'r',
  Flask: 'flask',
  JUnit: 'junit5',
  WordPress: 'wordpress',
  'Material-UI': 'mui',
  FastAPI: 'fastapi',
  Git: 'git',
  Docker: 'docker',
  Eclipse: 'eclipseide',
  NumPy: 'numpy',
};

function getTechIcon(techName) {
  return getIconBySlug(SLUG_BY_TECH[techName]);
}

module.exports = { getTechIcon, getIconBySlug };
