function nowIso() {
  return new Date().toISOString();
}

export function createPhotoRepository(db) {
  const listByAlbumStmt = db.prepare(`
    SELECT id, album_id AS albumId, file_path AS filePath, thumbnail_path AS thumbnailPath, capture_date AS captureDate, added_at AS addedAt
    FROM photos
    WHERE album_id = ?
    ORDER BY added_at DESC, id DESC
  `);

  const insertPhotoStmt = db.prepare(`
    INSERT INTO photos (album_id, file_path, thumbnail_path, capture_date, added_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const getPhotoStmt = db.prepare(`
    SELECT id, album_id AS albumId, file_path AS filePath, thumbnail_path AS thumbnailPath, capture_date AS captureDate, added_at AS addedAt
    FROM photos
    WHERE id = ?
  `);

  const deletePhotoStmt = db.prepare('DELETE FROM photos WHERE id = ?');

  return {
    listByAlbum(albumId) {
      return listByAlbumStmt.all(albumId);
    },

    add({ albumId, filePath, thumbnailPath, captureDate }) {
      const result = insertPhotoStmt.run(albumId, filePath, thumbnailPath || null, captureDate || null, nowIso());
      return getPhotoStmt.get(result.lastInsertRowid);
    },

    delete(photoId) {
      const result = deletePhotoStmt.run(photoId);
      return result.changes > 0;
    }
  };
}
