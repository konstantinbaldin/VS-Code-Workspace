import { describe, expect, it } from 'vitest';
import { moveId, reorderIds } from '../../src/albums/album-reorder.js';

describe('album reorder helpers', () => {
  it('moves dragged id to target position', () => {
    const ids = [11, 12, 13, 14];
    expect(reorderIds(ids, 14, 12)).toEqual([11, 14, 12, 13]);
  });

  it('moves id up and down for keyboard fallback', () => {
    const ids = [11, 12, 13];
    expect(moveId(ids, 12, 'up')).toEqual([12, 11, 13]);
    expect(moveId(ids, 12, 'down')).toEqual([11, 13, 12]);
  });
});
