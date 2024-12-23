import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoMemoryServer: MongoMemoryServer;

beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();

    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoMemoryServer.stop();
});

beforeEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();

        collections.forEach(async (collection) => {
            await collection.deleteMany({});
        });
    } else {
        throw new Error('MongoDB connection is not established');
    }
});