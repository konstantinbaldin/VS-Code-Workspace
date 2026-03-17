import { renderPhotoTile } from './photo-tile.js';

export function renderPhotoGrid(container, photos) {
  if (!photos.length) {
    container.innerHTML = '<p class="empty">No photos in this album yet.</p>';
    return;
  }

  container.innerHTML = photos.map((photo) => renderPhotoTile(photo)).join('');
}
