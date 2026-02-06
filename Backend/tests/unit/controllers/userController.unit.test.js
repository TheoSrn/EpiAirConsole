import * as userCtrl from '../../../src/controllers/userController.js';
import User from '../../../src/models/User.js';
import bcrypt from 'bcrypt';

jest.mock('../../../src/models/User.js');
jest.mock('bcrypt');

describe('userController (unit)', () => {
  afterEach(() => jest.clearAllMocks());

  test('listUsers returns users', async () => {
    User.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ username: 'u' }]) });
    const req = {};
    const res = { json: jest.fn() };
    await userCtrl.listUsers(req, res);
    expect(res.json).toHaveBeenCalledWith([{ username: 'u' }]);
  });

  test('getUser returns 400 for invalid id', async () => {
    const req = { params: { id: 'abc' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await userCtrl.getUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('getUser returns 404 when not found', async () => {
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await userCtrl.getUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('updateUser hashes password and updates', async () => {
    bcrypt.hash.mockResolvedValue('h');
    const updated = { _id: '1', username: 'u' };
    User.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue(updated) });
    const req = { params: { id: '507f1f77bcf86cd799439011' }, body: { password: 'new' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await userCtrl.updateUser(req, res);
    expect(bcrypt.hash).toHaveBeenCalledWith('new', 10);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, expect.objectContaining({ password: 'h' }), { new: true });
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test('deleteUser returns 404 when not found', async () => {
    User.findByIdAndDelete.mockResolvedValue(null);
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await userCtrl.deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('deleteUser returns success message', async () => {
    User.findByIdAndDelete.mockResolvedValue({ _id: '1' });
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await userCtrl.deleteUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur supprimé' });
  });
});
