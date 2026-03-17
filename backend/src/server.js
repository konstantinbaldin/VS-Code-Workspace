import cors from 'cors';
import express from 'express';
import { initializeDatabase } from './db/connection.js';
import { createAlbumRepository } from './db/repositories/album-repository.js';
import { createPhotoRepository } from './db/repositories/photo-repository.js';
import { createAlbumsRouter } from './api/albums.js';
import { createPhotosRouter } from './api/photos.js';

export function createApp(options = {}) {
  const db = initializeDatabase(options.dbPath);
  const albumRepository = createAlbumRepository(db);
  const photoRepository = createPhotoRepository(db);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/albums', createAlbumsRouter(albumRepository));
  app.use('/api', createPhotosRouter(albumRepository, photoRepository));

  app.use((error, _req, res, _next) => {
    res.status(500).json({ error: error?.message || 'Internal Server Error' });
  });

  return app;
}

export function startServer() {
  const app = createApp();
  const port = Number(process.env.PORT || 3001);
  return app.listen(port, () => {
    console.log(`Backend server listening on http://localhost:${port}`);
  });
}

if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer();
}
