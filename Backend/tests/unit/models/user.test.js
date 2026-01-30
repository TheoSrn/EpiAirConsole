import User from '../../../src/models/User.js';

describe('User model (unit-ish)', () => {
  test('should require username and email', async () => {
    await expect(User.create({})).rejects.toThrow();
  });

  test('should create when required fields provided', async () => {
    const u = await User.create({ username: 'u', email: 'a@b.c', password: 'p' });
    expect(u._id).toBeDefined();
    expect(u.email).toBe('a@b.c');
  });
});
