import request from 'supertest';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../../src/server.js';
import { closeDatabase } from '../../src/db/connection.js';

const tempDir = path.resolve(process.cwd(), 'backend/data/test-temp');
const dbPath = path.join(tempDir, 'albums-reorder.sqlite');

let app;

before(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });
  app = createApp({ dbPath });
});

after(() => {
  closeDatabase();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('album reorder flow', () => {
  it('creates albums, reorders, and returns grouped output', async () => {
    const createA = await request(app)
      .post('/api/albums')
      .send({ title: 'A', groupDate: '2026-03-17' })
      .expect(201);

    const createB = await request(app)
      .post('/api/albums')
      .send({ title: 'B', groupDate: '2026-03-17' })
      .expect(201);

    const createC = await request(app)
      .post('/api/albums')
      .send({ title: 'C', groupDate: '2026-03-17' })
      .expect(201);

    const reorder = await request(app)
      .post('/api/albums/reorder')
      .send({
        groupDate: '2026-03-17',
        albumIds: [createC.body.album.id, createA.body.album.id, createB.body.album.id]
      })
      .expect(200);

    const firstGroup = reorder.body.groups.find((entry) => entry.groupDate === '2026-03-17');
    assert.deepEqual(firstGroup.albums.map((album) => album.title), ['C', 'A', 'B']);
  });
});
