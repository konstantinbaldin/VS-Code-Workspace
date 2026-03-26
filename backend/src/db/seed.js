import { initializeDatabase, closeDatabase } from './connection.js';

function nowIso() {
  return new Date().toISOString();
}

function createSvgDataUri(label, color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
      <rect width="100%" height="100%" fill="${color}" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="18">${label}</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getOrCreateAlbum(db, title, groupDate, orderIndex) {
  const existing = db.prepare('SELECT id FROM albums WHERE title = ? AND group_date = ?').get(title, groupDate);
  if (existing?.id) {
    return existing.id;
  }

  const timestamp = nowIso();
  const insert = db.prepare(`
    INSERT INTO albums (title, group_date, order_index, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = insert.run(title, groupDate, orderIndex, timestamp, timestamp);
  return Number(result.lastInsertRowid);
}

function photoExists(db, albumId, filePath) {
  const found = db.prepare('SELECT id FROM photos WHERE album_id = ? AND file_path = ?').get(albumId, filePath);
  return Boolean(found?.id);
}

function addPhoto(db, albumId, filePath, label, color) {
  if (photoExists(db, albumId, filePath)) {
    return;
  }

  const insert = db.prepare(`
    INSERT INTO photos (album_id, file_path, thumbnail_path, capture_date, added_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  insert.run(
    albumId,
    filePath,
    createSvgDataUri(label, color),
    new Date().toISOString().slice(0, 10),
    nowIso()
  );
}

function seed() {
  const db = initializeDatabase();

  const albumA = getOrCreateAlbum(db, 'Family Weekend', '2026-03-15', 0);
  const albumB = getOrCreateAlbum(db, 'City Walk', '2026-03-16', 0);

  addPhoto(db, albumA, 'demo://family-1.jpg', 'Family 1', '#2f6feb');
  addPhoto(db, albumA, 'demo://family-2.jpg', 'Family 2', '#8250df');
  addPhoto(db, albumB, 'demo://city-1.jpg', 'City 1', '#1f883d');
  addPhoto(db, albumB, 'demo://city-2.jpg', 'City 2', '#bf8700');

  const albumCount = db.prepare('SELECT COUNT(*) AS total FROM albums').get().total;
  const photoCount = db.prepare('SELECT COUNT(*) AS total FROM photos').get().total;

  console.log(`Seed complete: ${albumCount} albums, ${photoCount} photos`);
  closeDatabase();
}

seed();
