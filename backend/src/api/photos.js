import { Router } from 'express';
import { normalizeImagePath } from '../storage/image-paths.js';

export function createPhotosRouter(albumRepository, photoRepository) {
  const router = Router();

  router.get('/albums/:albumId/photos', (req, res) => {
    const albumId = Number(req.params.albumId);
    if (!Number.isInteger(albumId) || albumId <= 0) {
      res.status(400).json({ error: 'Invalid album id.' });
      return;
    }

    const album = albumRepository.getById(albumId);
    if (!album) {
      res.status(404).json({ error: 'Album not found.' });
      return;
    }

    const photos = photoRepository.listByAlbum(albumId);
    res.json({ photos });
  });

  router.post('/albums/:albumId/photos', (req, res) => {
    const albumId = Number(req.params.albumId);
    const { filePath, thumbnailPath, captureDate } = req.body ?? {};

    if (!Number.isInteger(albumId) || albumId <= 0) {
      res.status(400).json({ error: 'Invalid album id.' });
      return;
    }

    const album = albumRepository.getById(albumId);
    if (!album) {
      res.status(404).json({ error: 'Album not found.' });
      return;
    }

    const normalizedPath = normalizeImagePath(filePath);
    if (!normalizedPath) {
      res.status(400).json({ error: 'filePath is required.' });
      return;
    }

    const photo = photoRepository.add({
      albumId,
      filePath: normalizedPath,
      thumbnailPath: normalizeImagePath(thumbnailPath),
      captureDate: captureDate || null
    });

    res.status(201).json({ photo });
  });

  router.delete('/photos/:photoId', (req, res) => {
    const photoId = Number(req.params.photoId);
    if (!Number.isInteger(photoId) || photoId <= 0) {
      res.status(400).json({ error: 'Invalid photo id.' });
      return;
    }

    const deleted = photoRepository.delete(photoId);
    if (!deleted) {
      res.status(404).json({ error: 'Photo not found.' });
      return;
    }

    res.status(204).send();
  });

  return router;
}
