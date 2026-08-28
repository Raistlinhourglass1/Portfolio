const fs = require('fs');
const path = require('path');

// SVG icons adapted from Simple Icons (simpleicons.org, CC0-licensed) and
// self-hosted here rather than pulled from a CDN at request time — no
// external dependency, no third-party request per page load. Only
// technologies with a real, recognizable logo get an icon; others (e.g.
// "Blueprints", "VR", "C#" — no simple-icons entry for the language itself)
// fall back to plain text.
const ICONS_DIR = path.join(__dirname, 'tech-icons');

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
};

const cache = {};

function getTechIcon(techName) {
  const slug = SLUG_BY_TECH[techName];
  if (!slug) return null;
  if (slug in cache) return cache[slug];

  const filePath = path.join(ICONS_DIR, `${slug}.svg`);
  const svg = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  cache[slug] = svg;
  return svg;
}

module.exports = { getTechIcon };
