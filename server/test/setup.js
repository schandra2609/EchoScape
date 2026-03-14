import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

// 1. Before all tests: Spin up the in-memory DB and connect Mongoose to it
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // If the app accidentally connected to the real DB, disconnect it first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongoUri);
});

// 2. Before each test: Wipe the database completely clean
// This ensures Test A doesn't accidentally leave data behind that breaks Test B
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// 3. After all tests: Disconnect Mongoose and stop the fake server
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});