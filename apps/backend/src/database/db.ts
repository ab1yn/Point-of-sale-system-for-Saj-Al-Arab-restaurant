import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const appDataPath = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const dbPath = process.env.DATABASE_PATH || path.join(appDataPath, 'saj-pos', 'saj_pos.db');

// Ensure directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db: Database.Database = new Database(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;
