const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');

const request = require('supertest');

before(() => {
  process.env.NODE_ENV = 'test';
  process.env.DB_HOST = '127.0.0.1';
  process.env.DB_USER = 'test';
  process.env.DB_PASSWORD = 'test';
  process.env.DB_NAME = 'test';
  process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters';
});

test('GET /api/health returns service status', async () => {
  const { createApp } = require('../src/app');
  const response = await request(createApp()).get('/api/health').expect(200);

  assert.equal(response.body.status, 'ok');
  assert.match(response.body.timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

test('POST /api/products requires a bearer token', async () => {
  const { createApp } = require('../src/app');
  const response = await request(createApp()).post('/api/products').send({}).expect(401);

  assert.equal(response.body.error, 'Bearer token is required');
});

test('unknown routes return a clean JSON error', async () => {
  const { createApp } = require('../src/app');
  const response = await request(createApp()).get('/api/missing').expect(404);

  assert.equal(response.body.error, 'Route not found: GET /api/missing');
});

after(async () => {
  const { closePool } = require('../src/config/db');
  await closePool();
});
