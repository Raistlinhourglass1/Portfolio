# Portfolio Site

Personal portfolio site showcasing college projects (Database systems, game dev, VR dev, AI/ML) and resume, self-hosted on personal server hardware.

## Stack

- **Backend:** Node.js + Express
- **Database:** SQLite (file-based, backed up to attached DAS)
- **Frontend:** Server-rendered views (EJS) + vanilla CSS/JS
- **Hosting:** Self-hosted, reverse-proxied via Caddy (auto HTTPS)

## Project Structure

```
portfolio-site/
├── server/
│   ├── routes/       # Express route handlers
│   ├── db/           # Database schema, migrations, queries
│   ├── views/        # EJS templates
│   └── public/        # Static assets (css, js, images)
├── .gitignore
└── README.md
```

## Projects Featured

- **Library Management System** — Full-stack Node.js/MySQL app, team of 4 (Database class)
- **Esoterra** — 3D survival/adventure game, Unreal Engine, team lead, 1st place x2 (Fall 2025 + Spring 2026)
- **The Odyssey** — VR co-op escape room, Unity, shipped to a web store
- **Gas Price Predictor** — Neural network, 89% accuracy (AI class, UH)

## Setup (local dev)

```bash
npm install
npm run dev
```

## Status

🚧 In active development — Fall 2026
