import { describe, expect, it } from 'vitest';
import { sortDateGroups } from '../../src/albums/date-groups.js';

describe('sortDateGroups', () => {
  it('sorts descending by default', () => {
    const groups = [
      { groupDate: '2025-01-01' },
      { groupDate: '2026-03-10' },
      { groupDate: '2024-12-31' }
    ];

    const result = sortDateGroups(groups);
    expect(result.map((item) => item.groupDate)).toEqual(['2026-03-10', '2025-01-01', '2024-12-31']);
  });

  it('sorts ascending when requested', () => {
    const groups = [
      { groupDate: '2025-01-01' },
      { groupDate: '2026-03-10' },
      { groupDate: '2024-12-31' }
    ];

    const result = sortDateGroups(groups, 'asc');
    expect(result.map((item) => item.groupDate)).toEqual(['2024-12-31', '2025-01-01', '2026-03-10']);
  });
});
