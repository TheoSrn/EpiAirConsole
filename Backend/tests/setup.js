import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';

let mongoServer;

beforeAll(async () => {
  if (process.env.MONGO_URI) {
    await connectDB();
    return;
  }

  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  await connectDB();
});

afterEach(async () => {
  // Clean all collections after each test
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});
