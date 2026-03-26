import path from 'node:path';

export function normalizeImagePath(inputPath) {
  if (!inputPath || typeof inputPath !== 'string') {
    return null;
  }
  const trimmed = inputPath.trim();
  if (!trimmed) {
    return null;
  }
  return path.normalize(trimmed);
}
