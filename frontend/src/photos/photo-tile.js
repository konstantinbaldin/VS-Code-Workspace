export function renderPhotoTile(photo) {
  const source = photo.thumbnailPath || photo.filePath;
  const escapedSource = String(source ?? '').replaceAll('"', '&quot;');
  const escapedLabel = String(photo.filePath ?? '').replaceAll('"', '&quot;');

  return `
    <article class="photo-tile" data-photo-id="${photo.id}">
      <img src="${escapedSource}" alt="${escapedLabel}" loading="lazy" onerror="this.closest('.photo-tile').classList.add('broken')" />
      <footer>
        <span>${photo.captureDate || 'No capture date'}</span>
        <button data-action="remove-photo" data-photo-id="${photo.id}">Remove</button>
      </footer>
    </article>
  `;
}
