# Project Brief: Portfolio Site

Handoff context for Claude Code. This summarizes decisions made in planning so far — read this first before making changes.

## Goal

Personal portfolio website to showcase college projects and resume in one place. Target: Fall 2026. Self-hosted on personal server hardware with attached DAS storage.

## Key Decisions Made

- **One site, not two** — projects and resume live together (nav: Home → Projects → Resume → About/Contact), not split across separate sites.
- **Stack chosen for being "comfortable but simple"** (user knows Node/Express/MySQL from coursework, wants to avoid overengineering):
  - Backend: **Node.js + Express**
  - Database: **SQLite** (file-based, no separate DB server process to manage; back up the `.sqlite` file to the DAS on a schedule)
  - Frontend: **Server-rendered views (EJS)** + vanilla CSS/JS — not React, to keep the frontend build simple. Design should lean on a lightweight CSS approach (e.g. Tailwind or Pico.css/Water.css) since the user's UI/design skills are a stated weak point — favor clean defaults, strong layout, and letting project screenshots/video carry visual interest over custom design work.
  - Hosting: Self-hosted, reverse proxy via **Caddy** (auto-HTTPS, simpler config than nginx)
- **Design philosophy**: limited color palette (1 accent + neutrals), borrow layout patterns from known-good portfolio sites, lean on large imagery/video from the projects (especially Esoterra and The Odyssey) rather than heavy custom UI design.
- **Git/GitHub**: repo already created and cloned locally via GitHub Desktop. An initial scaffold (folder structure, `.gitignore`, `README.md`, `package.json`) was handed off as a zip and merged into the repo. Claude Code should now work directly in this cloned repo going forward.

## Planned Folder Structure

```
portfolio-site/
├── server/
│   ├── routes/       # Express route handlers
│   ├── db/           # Schema, migrations, queries (SQLite)
│   ├── views/        # EJS templates
│   └── public/
│       ├── css/
│       ├── js/
│       └── images/
├── .gitignore
├── README.md
└── package.json
```

## Projects to Feature (content for the Projects section)

1. **Library Management System** (Database class)
   - Team of 4. Full-stack Node.js + MySQL. Staff/student role-based access. Admin features for managing books/media. Physical barcode scanner input for adding books. Custom login system tied to a self-hosted database (hosting was outsourced to AWS for this class project, unlike the portfolio site itself).

2. **Esoterra** (flagship project, deserves the most detailed case study page)
   - Role: Team lead. Two semesters (Fall 2025 + Spring 2026), two different 4-person teams. Built in **Unreal Engine**, light use of pre-made assets (limited to the building-block pieces used for the ruins, everything else custom). **1st place in both semesters.**
   - Features: deep combat system with multiple weapons, enemies, custom fighting animations, AI decision tree for reactive enemy behavior; NPCs with a dialogue and quest system; inventory system; crafting and resource gathering (rocks, trees); custom weather particle system; magic system; large open-world island for exploration; narrative around uncovering the fate of a long-dead civilization.

3. **The Odyssey**
   - Role: Team lead. VR co-op escape room built in **Unity**. Team of 4, none of whom had prior game development experience. No pre-made assets, fully custom code and level design. Features an in-game lobby/multiplayer join flow. Shipped and posted to a web store (real distribution, not just a class demo). Custom puzzles requiring real physical player movement and 2-player cooperation (e.g., blacklight/flashlight puzzles requiring coordinated input from both players).

4. **Gas Price Predictor** (AI class, University of Houston, "USOIL Price Prediction," Group 12)
   - 4-person team project comparing LSTM, GRU, and Random Forest models to forecast US oil (USOIL) prices, plus a separate Random Forest model predicting weekly Houston gas price changes. Role: LSTM model, data collection, research (teammates to be credited later). No headline accuracy percentage exists in the actual project materials (the earlier "89% accuracy" claim wasn't backed by the slides and was dropped); real results are GRU outperforming LSTM on MAE/RMSE, and both models struggling with sudden price spikes driven by real-world events outside the dataset.

**Not yet ready to feature** (in progress as of Aug 2026, exclude from portfolio for now):
- Data Science class project (data manipulation, to be shown as its own site/output)
- Software Design class project (details TBD)

## Immediate Next Steps

1. Scaffold the actual Express server (`server/index.js`), basic routing, and EJS view engine setup
2. Define SQLite schema for projects table (title, description, tech stack, role, images/video paths, links, order/featured flag)
3. Build out page templates: Home, Projects (grid/list), individual Project detail pages, Resume, About/Contact
4. Resume should be servable both as downloadable PDF and as an HTML-rendered version from the same underlying data
5. Visual design pass — pick accent color + neutral palette, pick a CSS approach (Tailwind vs. a classless framework), design the project card/grid layout first since it's the highest-impact page

## Site Structure (updated after the single-page redesign)

Home (`/`) is now a single scrollable page with anchor-nav sections: Hero (name only,
no "Hi, I'm" framing) → Projects (card grid) → About (bio + contact links). Reference:
https://melisaunlu.github.io/index.html — adapted the *structural* pattern (fixed ambient
gradient glow behind content, sticky anchor nav, scroll-reveal fade-ins, entries linking out
to dedicated detail pages) in our own dark/forest-green palette and Space Grotesk heading
font, not a literal reskin of that site's gothic/manuscript aesthetic.

Resume stays its own page (`/resume`, linked in nav) rather than a home-page section — too
much dense structured content plus a PDF download to compress well into one section.
`/projects` and `/about` still work standalone as fallback routes (not primary nav targets).

## Deferred to Final Polish Pass

Items intentionally saved for a dedicated polish pass at the end, after content/media for
all projects and deployment are done — cosmetic and independent of content, so doing them
now risks rework as more pages get built out.

- Custom cursor hover reactivity (beyond the existing card lift/glow, button hover, nav
  underline states already in place from the visual design pass)

## Notes on Working Style

- User is comfortable with backend/infra work but explicitly wants to keep it simple rather than over-engineered.
- User's weakest area is visual/UI design — extra care and concrete design decisions (not just options) are appreciated here.
- Commit messages should be meaningful/incremental (this is a solo project, so the commit history itself doubles as a visible record of process and skill for anyone reviewing the repo).
