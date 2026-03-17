function nowIso() {
  return new Date().toISOString();
}

export function createAlbumRepository(db) {
  const insertAlbum = db.prepare(`
    INSERT INTO albums (title, group_date, order_index, created_at, updated_at)
    VALUES (@title, @groupDate, @orderIndex, @createdAt, @updatedAt)
  `);

  const getAlbum = db.prepare(`
    SELECT id, title, group_date AS groupDate, order_index AS orderIndex, created_at AS createdAt, updated_at AS updatedAt
    FROM albums
    WHERE id = ?
  `);

  const getMaxOrderInGroup = db.prepare(`
    SELECT COALESCE(MAX(order_index), -1) AS maxOrder
    FROM albums
    WHERE group_date = ?
  `);

  const listAlbumsOrdered = db.prepare(`
    SELECT id, title, group_date AS groupDate, order_index AS orderIndex, created_at AS createdAt, updated_at AS updatedAt
    FROM albums
    ORDER BY group_date DESC, order_index ASC, created_at ASC
  `);

  const renameAlbumStmt = db.prepare(`
    UPDATE albums
    SET title = ?, updated_at = ?
    WHERE id = ?
  `);

  const deleteAlbumStmt = db.prepare('DELETE FROM albums WHERE id = ?');

  const reorderAlbumStmt = db.prepare(`
    UPDATE albums
    SET order_index = ?, updated_at = ?
    WHERE id = ? AND group_date = ?
  `);

  return {
    create({ title, groupDate }) {
      const timestamp = nowIso();
      const { maxOrder } = getMaxOrderInGroup.get(groupDate);
      const orderIndex = maxOrder + 1;
      const result = insertAlbum.run({
        title,
        groupDate,
        orderIndex,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      return getAlbum.get(result.lastInsertRowid);
    },

    listGrouped() {
      const rows = listAlbumsOrdered.all();
      const groups = [];
      const byDate = new Map();

      for (const row of rows) {
        if (!byDate.has(row.groupDate)) {
          const group = { groupDate: row.groupDate, albums: [] };
          byDate.set(row.groupDate, group);
          groups.push(group);
        }
        byDate.get(row.groupDate).albums.push(row);
      }

      return groups;
    },

    getById(id) {
      return getAlbum.get(id);
    },

    rename(id, title) {
      renameAlbumStmt.run(title, nowIso(), id);
      return getAlbum.get(id);
    },

    delete(id) {
      const result = deleteAlbumStmt.run(id);
      return result.changes > 0;
    },

    reorder(groupDate, albumIds) {
      const timestamp = nowIso();
      db.exec('BEGIN');
      try {
        albumIds.forEach((albumId, index) => {
          reorderAlbumStmt.run(index, timestamp, albumId, groupDate);
        });
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
      return this.listGrouped();
    }
  };
}
