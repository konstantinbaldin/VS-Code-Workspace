export function sortDateGroups(groups, order = 'desc') {
  const cloned = [...groups];
  cloned.sort((left, right) => {
    if (order === 'asc') {
      return left.groupDate.localeCompare(right.groupDate);
    }
    return right.groupDate.localeCompare(left.groupDate);
  });
  return cloned;
}

export function flattenGroup(group) {
  return group.albums.map((album) => album.id);
}
