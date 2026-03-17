import { apiClient } from './services/api-client.js';
import { renderAlbumGroups } from './albums/album-list.js';
import { flattenGroup, sortDateGroups } from './albums/date-groups.js';
import { moveId, reorderIds, wireDragDrop } from './albums/album-reorder.js';
import { renderPhotoGrid } from './photos/photo-grid.js';

const state = {
  groups: [],
  activeAlbumId: null,
  photos: []
};

const elements = {
  albumForm: document.querySelector('#album-form'),
  albumTitle: document.querySelector('#album-title'),
  albumDate: document.querySelector('#album-date'),
  albumStatus: document.querySelector('#album-status'),
  albumGroups: document.querySelector('#album-groups'),
  detailsTitle: document.querySelector('#album-details-title'),
  photoForm: document.querySelector('#photo-form'),
  photoPathInput: document.querySelector('#photo-file-path'),
  photoStatus: document.querySelector('#photo-status'),
  photoGrid: document.querySelector('#photo-grid')
};

function setStatus(target, message, isError = false) {
  target.textContent = message;
  target.style.color = isError ? '#b42318' : '#444';
}

function findAlbumById(id) {
  for (const group of state.groups) {
    const album = group.albums.find((item) => item.id === id);
    if (album) {
      return album;
    }
  }
  return null;
}

function renderAlbums() {
  const sorted = sortDateGroups(state.groups);
  renderAlbumGroups(elements.albumGroups, sorted, state.activeAlbumId);

  wireDragDrop(elements.albumGroups, async ({ groupDate, draggedAlbumId, targetAlbumId }) => {
    const group = state.groups.find((entry) => entry.groupDate === groupDate);
    if (!group) {
      return;
    }

    const nextOrder = reorderIds(flattenGroup(group), draggedAlbumId, targetAlbumId);
    try {
      state.groups = await apiClient.reorderAlbums(groupDate, nextOrder);
      renderAlbums();
      setStatus(elements.albumStatus, 'Album order updated.');
    } catch (error) {
      setStatus(elements.albumStatus, error.message, true);
    }
  });
}

function renderPhotos() {
  renderPhotoGrid(elements.photoGrid, state.photos);
}

async function loadAlbums() {
  state.groups = await apiClient.listAlbums();
  renderAlbums();
}

async function loadPhotos(albumId) {
  state.photos = await apiClient.listPhotos(albumId);
  renderPhotos();
}

function wireAlbumActions() {
  elements.albumGroups.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) {
      return;
    }

    const action = button.dataset.action;
    const albumId = Number(button.dataset.albumId);
    if (!albumId) {
      return;
    }

    try {
      if (action === 'open') {
        state.activeAlbumId = albumId;
        const album = findAlbumById(albumId);
        elements.detailsTitle.textContent = album ? `Album Photos — ${album.title}` : 'Album Photos';
        await loadPhotos(albumId);
        renderAlbums();
      }

      if (action === 'rename') {
        const nextTitle = window.prompt('New album title');
        if (!nextTitle) {
          return;
        }
        await apiClient.renameAlbum(albumId, nextTitle);
        await loadAlbums();
        setStatus(elements.albumStatus, 'Album renamed.');
      }

      if (action === 'delete') {
        const confirmed = window.confirm('Delete this album?');
        if (!confirmed) {
          return;
        }
        await apiClient.deleteAlbum(albumId);
        if (state.activeAlbumId === albumId) {
          state.activeAlbumId = null;
          state.photos = [];
          renderPhotos();
          elements.detailsTitle.textContent = 'Album Photos';
        }
        await loadAlbums();
        setStatus(elements.albumStatus, 'Album deleted.');
      }

      if (action === 'up' || action === 'down') {
        const parentGroupDate = button.closest('[data-group-date]')?.dataset.groupDate;
        const group = state.groups.find((entry) => entry.groupDate === parentGroupDate);
        if (!group) {
          return;
        }

        const direction = action === 'up' ? 'up' : 'down';
        const reorderedIds = moveId(flattenGroup(group), albumId, direction);
        state.groups = await apiClient.reorderAlbums(parentGroupDate, reorderedIds);
        renderAlbums();
      }
    } catch (error) {
      setStatus(elements.albumStatus, error.message, true);
    }
  });
}

function wireAlbumForm() {
  elements.albumForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = elements.albumTitle.value.trim();
    const groupDate = elements.albumDate.value;
    if (!title || !groupDate) {
      setStatus(elements.albumStatus, 'Album title and date are required.', true);
      return;
    }

    try {
      await apiClient.createAlbum({ title, groupDate });
      elements.albumForm.reset();
      await loadAlbums();
      setStatus(elements.albumStatus, 'Album created.');
    } catch (error) {
      setStatus(elements.albumStatus, error.message, true);
    }
  });
}

function wirePhotoForm() {
  elements.photoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!state.activeAlbumId) {
      setStatus(elements.photoStatus, 'Open an album first.', true);
      return;
    }

    const filePath = elements.photoPathInput.value.trim();
    if (!filePath) {
      setStatus(elements.photoStatus, 'Photo path is required.', true);
      return;
    }

    try {
      await apiClient.addPhoto(state.activeAlbumId, filePath);
      elements.photoForm.reset();
      await loadPhotos(state.activeAlbumId);
      setStatus(elements.photoStatus, 'Photo metadata added.');
    } catch (error) {
      setStatus(elements.photoStatus, error.message, true);
    }
  });

  elements.photoGrid.addEventListener('click', async (event) => {
    const removeButton = event.target.closest('button[data-action="remove-photo"]');
    if (!removeButton || !state.activeAlbumId) {
      return;
    }

    const photoId = Number(removeButton.dataset.photoId);
    if (!photoId) {
      return;
    }

    try {
      await apiClient.deletePhoto(photoId);
      await loadPhotos(state.activeAlbumId);
      setStatus(elements.photoStatus, 'Photo removed.');
    } catch (error) {
      setStatus(elements.photoStatus, error.message, true);
    }
  });
}

async function bootstrap() {
  wireAlbumActions();
  wireAlbumForm();
  wirePhotoForm();

  try {
    await loadAlbums();
    renderPhotos();
  } catch (error) {
    setStatus(elements.albumStatus, error.message, true);
  }
}

bootstrap();
