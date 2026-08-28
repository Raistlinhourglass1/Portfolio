// Seeds the projects table with the four "ready to feature" projects from
// PROJECT_BRIEF.md. Safe to re-run — uses upsert on the unique slug.
//
// Usage: node server/db/seed.js

const db = require('./index');

const projects = [
  {
    slug: 'esoterra',
    title: 'Esoterra',
    summary: 'Flagship project: a team-led Unreal Engine RPG that placed 1st two semesters running.',
    description:
      'Team lead across two semesters (Fall 2025 + Spring 2026), two different 4-person teams, ' +
      'placed 1st both semesters. Built in Unreal Engine with light use of pre-made assets, ' +
      'limited to the ruins’ building-block pieces.',
    highlights: [
      'Deep combat system: multiple weapons, enemies, custom fighting animations',
      'AI decision tree for reactive enemy behavior',
      'NPCs with a dialogue and quest system',
      'Inventory, crafting, and resource gathering (rocks, trees)',
      'Custom weather particle system and a magic system',
      'Large open-world island, narrative around a long-dead civilization',
    ],
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
    bts_images: [
      '/images/esoterra/behind-the-scenes/blueprint-showcase.jpg',
      '/images/esoterra/behind-the-scenes/ai-perception.jpg',
      '/images/esoterra/behind-the-scenes/enemy-ai.jpg',
      '/images/esoterra/behind-the-scenes/highlighted-item-focus.jpg',
      '/images/esoterra/behind-the-scenes/interactable-inventory-system.jpg',
      '/images/esoterra/behind-the-scenes/quest-format.jpg',
      '/images/esoterra/behind-the-scenes/first-settlement-editor-view.jpg',
      '/images/esoterra/behind-the-scenes/cultist-1-pose.jpg',
      '/images/esoterra/behind-the-scenes/cultist-2.jpg',
      '/images/esoterra/behind-the-scenes/cultist-2-back.jpg',
      '/images/esoterra/behind-the-scenes/green-npc.jpg',
      '/images/esoterra/behind-the-scenes/ruin-3.jpg',
    ],
    bts_videos: [
      '/videos/behind-the-scenes/esoterra/ai-pathfinding.mp4',
      '/videos/behind-the-scenes/esoterra/debug-menu-test.mp4',
      '/videos/behind-the-scenes/esoterra/selective-combat-test.mp4',
      '/videos/behind-the-scenes/esoterra/island-pan.mp4',
    ],
    links: {},
    featured: 1,
    sort_order: 1,
  },
  {
    slug: 'the-odyssey',
    title: 'The Odyssey',
    summary: 'Team-led VR co-op escape room built in Unity, shipped to a web store.',
    description:
      'Led a 4-person team, none of whom had prior game development experience, to build and ' +
      'ship a VR co-op escape room in Unity.',
    highlights: [
      'Fully custom code and level design, no pre-made assets',
      'In-game lobby / multiplayer join flow',
      'Shipped as a real release on a web store, not just a class demo',
      'Puzzles require real physical movement and 2-player cooperation (e.g. blacklight/flashlight)',
    ],
    role: 'Team Lead',
    tech_stack: ['Unity', 'C#', 'VR'],
    images: [
      '/images/the-odyssey/level-1.jpg',
      '/images/the-odyssey/doorway.jpg',
      '/images/the-odyssey/custom-texture-door.jpg',
    ],
    video_url: null,
    bts_images: [
      '/images/the-odyssey/behind-the-scenes/flashlight-model.jpg',
      '/images/the-odyssey/behind-the-scenes/hidden-wire-showcase.jpg',
      '/images/the-odyssey/behind-the-scenes/hidden-wire-showcase-upstairs.jpg',
    ],
    bts_videos: ['/videos/behind-the-scenes/the-odyssey/wire-test.mp4'],
    links: { 'SideQuest Store': 'https://sidequestvr.com/app/55452/escape-odyssey' },
    featured: 1,
    sort_order: 2,
  },
  {
    slug: 'library-management-system',
    title: 'Library Management System',
    summary: 'Full-stack React + Node.js + MySQL library system with role-based access and barcode scanner input.',
    description:
      'Built with a team of 4 for a Database class: a full-stack library system ("The Learning ' +
      'Loft"). The original hosted deployment is no longer live; screenshots are from running the ' +
      'app locally against the source in the linked repos.',
    highlights: [
      'Staff/student role-based access and admin tools',
      'Manages books, audiobooks, ebooks, and periodicals',
      'Physical barcode scanner input for adding books',
      'Room and device reservations',
      'Custom JWT-based authentication',
    ],
    role: 'Full-stack Developer',
    tech_stack: ['React', 'Node.js', 'MySQL', 'Express'],
    images: [
      '/images/library-management-system/home.jpg',
      '/images/library-management-system/catalog.jpg',
      '/images/library-management-system/book-entry.jpg',
      '/images/library-management-system/signin.jpg',
    ],
    video_url: null,
    links: {
      'Frontend Repo': 'https://github.com/Raistlinhourglass1/LibraryDBfrontend',
      'Backend Repo': 'https://github.com/Raistlinhourglass1/LibraryDBbackend',
    },
    featured: 0,
    sort_order: 3,
  },
  {
    slug: 'gas-price-predictor',
    title: 'Gas Price Predictor',
    summary: 'Comparing LSTM, GRU, and Random Forest models to forecast US oil and gas prices.',
    description:
      'Built for an AI class at the University of Houston, as part of a 4-person team comparing ' +
      'machine learning approaches to price forecasting. My contribution: one of the project’s ' +
      'LSTM models, plus data collection and research.',
    highlights: [
      'Compared LSTM, GRU, and Random Forest models on historical USOIL prices',
      'Technical indicators as features: moving averages, RSI, Bollinger Bands, MACD',
      'Separate Random Forest model for weekly Houston gas price changes',
      'GRU outperformed LSTM on this dataset (lower error)',
      'Key finding: both models struggled with sudden price spikes driven by real-world events',
    ],
    role: 'Contributor (LSTM Model)',
    tech_stack: ['Python', 'TensorFlow/Keras', 'scikit-learn', 'pandas'],
    images: [
      '/images/gas-price-predictor/usoil-monthly-prices.jpg',
      '/images/gas-price-predictor/price-predictions.jpg',
      '/images/gas-price-predictor/lstm-gru-dashboard.jpg',
      '/images/gas-price-predictor/random-forest-results.jpg',
    ],
    video_url: null,
    links: {},
    featured: 0,
    sort_order: 4,
  },
];

const upsert = db.prepare(`
  INSERT INTO projects (slug, title, summary, description, highlights, role, tech_stack, images, video_url, bts_images, bts_videos, links, featured, sort_order, updated_at)
  VALUES (@slug, @title, @summary, @description, @highlights, @role, @tech_stack, @images, @video_url, @bts_images, @bts_videos, @links, @featured, @sort_order, datetime('now'))
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    summary = excluded.summary,
    description = excluded.description,
    highlights = excluded.highlights,
    role = excluded.role,
    tech_stack = excluded.tech_stack,
    images = excluded.images,
    video_url = excluded.video_url,
    bts_images = excluded.bts_images,
    bts_videos = excluded.bts_videos,
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
      highlights: JSON.stringify(p.highlights || []),
      images: JSON.stringify(p.images),
      bts_images: JSON.stringify(p.bts_images || []),
      bts_videos: JSON.stringify(p.bts_videos || []),
      links: JSON.stringify(p.links),
    });
  }
});

seedAll(projects);
console.log(`Seeded ${projects.length} projects.`);
