const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// File lives outside git (see .gitignore's *.sqlite rule) — back it up to the
// DAS on a schedule per PROJECT_BRIEF.md.
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'portfolio.sqlite');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

module.exports = db;
