export function renderAlbumGroups(container, groups, activeAlbumId) {
  if (!groups.length) {
    container.innerHTML = '<p class="empty">No albums yet. Create your first album.</p>';
    return;
  }

  container.innerHTML = groups
    .map((group) => {
      const cards = group.albums
        .map((album) => {
          const isActive = album.id === activeAlbumId;
          return `
            <article class="album-card ${isActive ? 'active' : ''}" data-album-id="${album.id}" data-group-date="${group.groupDate}" draggable="true">
              <header>
                <button class="album-open" data-action="open" data-album-id="${album.id}">${album.title}</button>
              </header>
              <div class="album-card-actions">
                <button data-action="rename" data-album-id="${album.id}">Rename</button>
                <button data-action="delete" data-album-id="${album.id}">Delete</button>
                <button data-action="up" data-album-id="${album.id}" aria-label="Move album up">↑</button>
                <button data-action="down" data-album-id="${album.id}" aria-label="Move album down">↓</button>
              </div>
            </article>
          `;
        })
        .join('');

      return `
        <section class="album-group" data-group-date="${group.groupDate}">
          <h3>${group.groupDate}</h3>
          <div class="album-group-list">${cards}</div>
        </section>
      `;
    })
    .join('');
}
