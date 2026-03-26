import { Router } from 'express';

export function createAlbumsRouter(albumRepository) {
  const router = Router();

  router.get('/', (_req, res) => {
    const groups = albumRepository.listGrouped();
    res.json({ groups });
  });

  router.post('/', (req, res) => {
    const { title, groupDate, parentAlbumId } = req.body ?? {};

    if (parentAlbumId !== undefined && parentAlbumId !== null) {
      res.status(400).json({ error: 'Nested albums are not allowed.' });
      return;
    }

    if (!title || !groupDate) {
      res.status(400).json({ error: 'title and groupDate are required.' });
      return;
    }

    const album = albumRepository.create({ title: String(title).trim(), groupDate: String(groupDate) });
    res.status(201).json({ album });
  });

  router.patch('/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, parentAlbumId } = req.body ?? {};

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid album id.' });
      return;
    }

    if (parentAlbumId !== undefined && parentAlbumId !== null) {
      res.status(400).json({ error: 'Nested albums are not allowed.' });
      return;
    }

    if (!title || !String(title).trim()) {
      res.status(400).json({ error: 'title is required.' });
      return;
    }

    const existing = albumRepository.getById(id);
    if (!existing) {
      res.status(404).json({ error: 'Album not found.' });
      return;
    }

    const album = albumRepository.rename(id, String(title).trim());
    res.json({ album });
  });

  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid album id.' });
      return;
    }

    const deleted = albumRepository.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Album not found.' });
      return;
    }

    res.status(204).send();
  });

  router.post('/reorder', (req, res) => {
    const { groupDate, albumIds } = req.body ?? {};

    if (!groupDate || !Array.isArray(albumIds)) {
      res.status(400).json({ error: 'groupDate and albumIds are required.' });
      return;
    }

    const numericIds = albumIds.map((value) => Number(value)).filter((value) => Number.isInteger(value) && value > 0);
    if (numericIds.length !== albumIds.length) {
      res.status(400).json({ error: 'albumIds must contain valid numeric ids.' });
      return;
    }

    const groups = albumRepository.reorder(String(groupDate), numericIds);
    res.json({ groups });
  });

  return router;
}
