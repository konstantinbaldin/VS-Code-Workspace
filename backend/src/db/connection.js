import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

let db;

function ensureDirForFile(filePath) {
  const directory = path.dirname(filePath);
  fs.mkdirSync(directory, { recursive: true });
}

function loadSchemaSql() {
  const schemaPath = fileURLToPath(new URL('./schema.sql', import.meta.url));
  return fs.readFileSync(schemaPath, 'utf8');
}

export function initializeDatabase(dbPath) {
  if (db) {
    return db;
  }

  const targetPath = dbPath || process.env.DB_PATH || path.resolve(process.cwd(), 'backend/data/app.sqlite');
  ensureDirForFile(targetPath);

  db = new DatabaseSync(targetPath);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(loadSchemaSql());
  return db;
}

export function getDb() {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = undefined;
  }
}
