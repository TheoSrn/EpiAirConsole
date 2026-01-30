import { register, login } from '../../../src/controllers/authController.js';
import User from '../../../src/models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/models/User.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authController (unit)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('register returns 400 when fields missing', async () => {
    const req = { body: { username: '', email: '' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('register returns 400 if email already exists', async () => {
    User.findOne.mockResolvedValue({ _id: '1' });
    // Must satisfy password policy to reach User.findOne
    const req = { body: { username: 'u', email: 'e', password: 'Passw0rd!Passw0rd!' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await register(req, res);
    expect(User.findOne).toHaveBeenCalledWith({ email: 'e' });
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('register creates user and returns 201', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed');
    const fakeUser = { toObject: () => ({ username: 'u', email: 'e' }) };
    User.create.mockResolvedValue(fakeUser);

    // Must satisfy password policy to reach bcrypt.hash/User.create
    const req = { body: { username: 'u', email: 'e', password: 'Passw0rd!Passw0rd!' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await register(req, res);
    expect(bcrypt.hash).toHaveBeenCalledWith('Passw0rd!Passw0rd!', 10);
    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('login returns 400 when missing fields', async () => {
    const req = { body: { email: '' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('login returns 400 on invalid credentials', async () => {
    User.findOne.mockResolvedValue(null);
    const req = { body: { email: 'x', password: 'p' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('login returns token and user on success', async () => {
    const userObj = { _id: '1', password: 'hash', toObject: () => ({ _id: '1', email: 'e' }) };
    User.findOne.mockResolvedValue(userObj);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');

    const req = { body: { email: 'e', password: 'p' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await login(req, res);
    expect(bcrypt.compare).toHaveBeenCalledWith('p', 'hash');
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'token' }));
  });
});
