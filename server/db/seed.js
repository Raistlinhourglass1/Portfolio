// Seeds the projects table with the four "ready to feature" projects from
// PROJECT_BRIEF.md. Safe to re-run — uses upsert on the unique slug.
//
// Usage: node server/db/seed.js

const db = require('./index');

const projects = [
  {
    slug: 'esoterra',
    title: 'Esoterra',
    summary: 'Flagship project — team-led Unreal Engine RPG, 1st place two semesters running.',
    description:
      'Team lead across two semesters (Fall 2025 + Spring 2026) with two different 4-person teams. ' +
      'Built in Unreal Engine with zero purchased or pre-made assets. Placed 1st both semesters. ' +
      'Features a deep combat system with multiple weapons and enemies, custom fighting animations, ' +
      'an AI decision tree for reactive enemy behavior, an inventory system, crafting and resource ' +
      'gathering (rocks, trees), a custom weather particle system, a magic system, and a large ' +
      'open-world island to explore. The narrative centers on uncovering the fate of a long-dead civilization.',
    role: 'Team Lead',
    tech_stack: ['Unreal Engine', 'C++', 'Blueprints'],
    images: [
      '/images/esoterra/ruin-2.jpg',
      '/images/esoterra/beach-outpost.jpg',
      '/images/esoterra/cultists.jpg',
      '/images/esoterra/boss-aura.jpg',
      '/images/esoterra/inventory-crafting.jpg',
    ],
    video_url: '/videos/esoterra.mp4',
    links: {},
    featured: 1,
    sort_order: 1,
  },
  {
    slug: 'the-odyssey',
    title: 'The Odyssey',
    summary: 'VR co-op escape room built in Unity, shipped to a web store.',
    description:
      'A VR co-op escape room built in Unity with no pre-made assets — fully custom code and level ' +
      'design. Features an in-game lobby/multiplayer join flow and shipped as a real release posted ' +
      'to a web store, not just a class demo. Custom puzzles require real physical player movement and ' +
      '2-player cooperation, such as blacklight/flashlight puzzles that need coordinated input from both players.',
    role: 'Developer',
    tech_stack: ['Unity', 'C#', 'VR'],
    images: [],
    video_url: null,
    links: {},
    featured: 1,
    sort_order: 2,
  },
  {
    slug: 'library-management-system',
    title: 'Library Management System',
    summary: 'Full-stack Node.js + MySQL system with role-based access and barcode scanner input.',
    description:
      'Built with a team of 4 for a Database class. Full-stack Node.js + MySQL application with ' +
      'staff/student role-based access and admin features for managing books and media. Supports ' +
      'physical barcode scanner input for adding books, and a custom login system tied to a ' +
      'self-hosted database (hosting was outsourced to AWS for this class project).',
    role: 'Full-stack Developer',
    tech_stack: ['Node.js', 'MySQL', 'Express'],
    images: [],
    video_url: null,
    links: {},
    featured: 0,
    sort_order: 3,
  },
  {
    slug: 'gas-price-predictor',
    title: 'Gas Price Predictor',
    summary: 'Custom neural network predicting weekly gas prices with 89% accuracy.',
    description:
      'Built for an AI class at the University of Houston. A custom neural network predicts gas ' +
      'prices one week out with 89% accuracy, using real-world events — wars, new legislation, ' +
      'political developments — as predictors of price movement.',
    role: 'Developer',
    tech_stack: ['Python', 'Neural Networks'],
    images: [],
    video_url: null,
    links: {},
    featured: 0,
    sort_order: 4,
  },
];

const upsert = db.prepare(`
  INSERT INTO projects (slug, title, summary, description, role, tech_stack, images, video_url, links, featured, sort_order, updated_at)
  VALUES (@slug, @title, @summary, @description, @role, @tech_stack, @images, @video_url, @links, @featured, @sort_order, datetime('now'))
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    summary = excluded.summary,
    description = excluded.description,
    role = excluded.role,
    tech_stack = excluded.tech_stack,
    images = excluded.images,
    video_url = excluded.video_url,
    links = excluded.links,
    featured = excluded.featured,
    sort_order = excluded.sort_order,
    updated_at = datetime('now')
`);

const seedAll = db.transaction((rows) => {
  for (const p of rows) {
    upsert.run({
      ...p,
      tech_stack: JSON.stringify(p.tech_stack),
      images: JSON.stringify(p.images),
      links: JSON.stringify(p.links),
    });
  }
});

seedAll(projects);
console.log(`Seeded ${projects.length} projects.`);
