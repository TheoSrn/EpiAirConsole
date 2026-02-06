import * as gameCtrl from '../../../src/controllers/gameController.js';
import Game from '../../../src/models/Game.js';

jest.mock('../../../src/models/Game.js');

describe('gameController (unit)', () => {
  afterEach(() => jest.clearAllMocks());

  test('createGame returns 400 when name missing', async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await gameCtrl.createGame(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('createGame uses req.file to build imageUrl', async () => {
    const file = { filename: 'img.jpg' };
    const req = { body: { name: 'G' }, file, protocol: 'http', get: () => 'localhost:5000' };
    const created = { _id: '1', name: 'G', imageUrl: 'http://localhost:5000/uploads/games/img.jpg' };
    Game.create.mockResolvedValue(created);
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await gameCtrl.createGame(req, res);
    expect(Game.create).toHaveBeenCalledWith(expect.objectContaining({ imageUrl: 'http://localhost:5000/uploads/games/img.jpg' }));
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('listGames uses $all when multiple tags provided', async () => {
    const mockQuery = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]),
    };
    Game.find.mockReturnValue(mockQuery);
    const req = { query: { tag: 'a,b' } };
    const res = { json: jest.fn() };
    await gameCtrl.listGames(req, res);
    expect(Game.find).toHaveBeenCalledWith(expect.objectContaining({ tags: { $all: ['a', 'b'] } }));
  });

  test('updateGame returns 400 if no updates', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' }, body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await gameCtrl.updateGame(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('deleteGame returns 404 when not found', async () => {
    Game.findByIdAndDelete.mockResolvedValue(null);
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await gameCtrl.deleteGame(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
