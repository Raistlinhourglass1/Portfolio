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
      'Team lead across two semesters (Fall 2025 + Spring 2026) with two different 4-person teams. ' +
      'Built in Unreal Engine with light use of pre-made assets, limited to the building-block ' +
      'pieces used for the ruins, with everything else built custom. Placed 1st both semesters. ' +
      'Features a deep combat system with multiple weapons and enemies, custom fighting animations, ' +
      'an AI decision tree for reactive enemy behavior, NPCs with a dialogue and quest system, an ' +
      'inventory system, crafting and resource gathering (rocks, trees), a custom weather particle ' +
      'system, a magic system, and a large open-world island to explore. The narrative centers on ' +
      'uncovering the fate of a long-dead civilization.',
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
      '/images/esoterra/behind-the-scenes/cultist-1.jpg',
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
      'Led a 4-person team, none of whom had prior game development experience, to build a VR ' +
      'co-op escape room in Unity with no pre-made assets, fully custom code and level design. ' +
      'Features an in-game lobby/multiplayer join flow and shipped as a real release posted to a ' +
      'web store, not just a class demo. Custom puzzles require real physical player movement and ' +
      '2-player cooperation, such as blacklight/flashlight puzzles that need coordinated input from both players.',
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
    summary: 'Comparing LSTM, GRU, and Random Forest models to forecast US oil and gas prices.',
    description:
      'Built for an AI class at the University of Houston, as part of a 4-person team comparing ' +
      'different machine learning approaches to price forecasting. I built one of the project’s ' +
      'LSTM models and contributed to data collection and research. The team trained and compared ' +
      'LSTM, GRU, and Random Forest models using technical indicators (moving averages, RSI, ' +
      'Bollinger Bands, MACD) derived from historical USOIL prices, plus a separate Random Forest ' +
      'model predicting weekly Houston gas price changes from crude and regional market data. GRU ' +
      'outperformed LSTM on this dataset (lower error), though both models struggled to anticipate ' +
      'sudden price spikes driven by real-world events outside the dataset, such as wars and policy ' +
      'shifts, a key finding of the project.',
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
  INSERT INTO projects (slug, title, summary, description, role, tech_stack, images, video_url, bts_images, bts_videos, links, featured, sort_order, updated_at)
  VALUES (@slug, @title, @summary, @description, @role, @tech_stack, @images, @video_url, @bts_images, @bts_videos, @links, @featured, @sort_order, datetime('now'))
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    summary = excluded.summary,
    description = excluded.description,
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
      images: JSON.stringify(p.images),
      bts_images: JSON.stringify(p.bts_images || []),
      bts_videos: JSON.stringify(p.bts_videos || []),
      links: JSON.stringify(p.links),
    });
  }
});

seedAll(projects);
console.log(`Seeded ${projects.length} projects.`);
