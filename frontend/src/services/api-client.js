async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status})`);
  }

  return payload;
}

export const apiClient = {
  async listAlbums() {
    const data = await request('/api/albums');
    return data.groups ?? [];
  },

  async createAlbum(input) {
    const data = await request('/api/albums', {
      method: 'POST',
      body: JSON.stringify(input)
    });
    return data.album;
  },

  async renameAlbum(id, title) {
    const data = await request(`/api/albums/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title })
    });
    return data.album;
  },

  async deleteAlbum(id) {
    await request(`/api/albums/${id}`, { method: 'DELETE' });
  },

  async reorderAlbums(groupDate, albumIds) {
    const data = await request('/api/albums/reorder', {
      method: 'POST',
      body: JSON.stringify({ groupDate, albumIds })
    });
    return data.groups ?? [];
  },

  async listPhotos(albumId) {
    const data = await request(`/api/albums/${albumId}/photos`);
    return data.photos ?? [];
  },

  async addPhoto(albumId, filePath) {
    const data = await request(`/api/albums/${albumId}/photos`, {
      method: 'POST',
      body: JSON.stringify({ filePath })
    });
    return data.photo;
  },

  async deletePhoto(photoId) {
    await request(`/api/photos/${photoId}`, { method: 'DELETE' });
  }
};
