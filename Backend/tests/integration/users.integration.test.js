import request from 'supertest';
import app from '../../src/app.js';

describe('Users API - integration', () => {
  test('GET /api/users - list users', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'u1', email: 'u1@u.com', password: 'Passw0rd!Passw0rd!' });
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'u2', email: 'u2@u.com', password: 'Passw0rd!Passw0rd!' });

    const res = await request(app).get('/api/users').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('GET /api/users/:id - get user', async () => {
    const r = await request(app)
      .post('/api/auth/register')
      .send({ username: 'u3', email: 'u3@u.com', password: 'Passw0rd!Passw0rd!' });

    const id = r.body.user?._id;
    const res = await request(app).get(`/api/users/${id}`).expect(200);

    expect(res.body).toHaveProperty('_id', id);
    expect(res.body).not.toHaveProperty('password');
  });

  test('PUT /api/users/:id - update user', async () => {
    const r = await request(app)
      .post('/api/auth/register')
      .send({ username: 'u4', email: 'u4@u.com', password: 'Passw0rd!Passw0rd!' });

    const id = r.body.user?._id;
    const res = await request(app)
      .put(`/api/users/${id}`)
      .send({ username: 'u4-upd' })
      .expect(200);

    expect(res.body).toHaveProperty('username', 'u4-upd');
  });

  test('DELETE /api/users/:id - delete user', async () => {
    const r = await request(app)
      .post('/api/auth/register')
      .send({ username: 'u5', email: 'u5@u.com', password: 'Passw0rd!Passw0rd!' });

    const id = r.body.user?._id;
    await request(app).delete(`/api/users/${id}`).expect(200);
    await request(app).get(`/api/users/${id}`).expect(404);
  });

  test('GET /api/users/:id - invalid id', async () => {
    await request(app).get('/api/users/invalid-id').expect(400);
  });
});
