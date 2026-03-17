export function reorderIds(ids, movedId, targetId) {
  const sourceIndex = ids.indexOf(movedId);
  const targetIndex = ids.indexOf(targetId);
  if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
    return ids;
  }

  const next = [...ids];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}

export function moveId(ids, movedId, direction) {
  const index = ids.indexOf(movedId);
  if (index < 0) {
    return ids;
  }

  const nextIndex = direction === 'up' ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= ids.length) {
    return ids;
  }

  const next = [...ids];
  const [moved] = next.splice(index, 1);
  next.splice(nextIndex, 0, moved);
  return next;
}

export function wireDragDrop(container, onDropComplete) {
  let draggedAlbumId = null;
  let draggedGroupDate = null;

  container.querySelectorAll('[data-album-id]').forEach((element) => {
    element.addEventListener('dragstart', () => {
      draggedAlbumId = Number(element.dataset.albumId);
      draggedGroupDate = element.dataset.groupDate;
    });

    element.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    element.addEventListener('drop', (event) => {
      event.preventDefault();
      const targetAlbumId = Number(element.dataset.albumId);
      const targetGroupDate = element.dataset.groupDate;

      if (!draggedAlbumId || !targetAlbumId || draggedGroupDate !== targetGroupDate) {
        return;
      }

      onDropComplete({
        groupDate: targetGroupDate,
        draggedAlbumId,
        targetAlbumId
      });
    });
  });
}
