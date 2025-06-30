const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');

describe('POST /api/users', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/test-db');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should reject request without auth token', async () => {
    const res = await request(app).post('/api/users').send({
      name: 'No Auth',
      email: 'noauth@example.com',
      password: '123456'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('No token provided');
  }, 20000);
});
