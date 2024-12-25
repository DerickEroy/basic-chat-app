import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { userIntegrationTests } from "./user";

describe('Integration Testing', () => {
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

    userIntegrationTests();
});