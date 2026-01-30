import request from 'supertest';
import app from '../../src/app.js';

describe('Auth API - integration', () => {
  test('POST /api/auth/register - success', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'test', email: 'a@a.com', password: 'Passw0rd!Passw0rd!' })
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('_id');
    expect(res.body.user).toHaveProperty('email', 'a@a.com');
    expect(res.body.user).not.toHaveProperty('password');
  });

  test('POST /api/auth/register - missing fields', async () => {
    await request(app).post('/api/auth/register').send({ email: 'x@x.com' }).expect(400);
  });

  test('POST /api/auth/login - success', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 't2', email: 'b@b.com', password: 'Passw0rd!Passw0rd!' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'b@b.com', password: 'Passw0rd!Passw0rd!' })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).not.toHaveProperty('password');
  });

  test('POST /api/auth/login - invalid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 't3', email: 'c@c.com', password: 'Passw0rd!Passw0rd!' });

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'c@c.com', password: 'wrong' })
      .expect(400);
  });
});
