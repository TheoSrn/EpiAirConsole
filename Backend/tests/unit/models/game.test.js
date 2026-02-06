import Game from '../../../src/models/Game.js';

describe('Game model', () => {
  test('should require name', async () => {
    await expect(Game.create({})).rejects.toThrow();
  });

  test('should create when name provided', async () => {
    const g = await Game.create({ name: 'Test Game' });
    expect(g._id).toBeDefined();
    expect(g.name).toBe('Test Game');
  });
});
