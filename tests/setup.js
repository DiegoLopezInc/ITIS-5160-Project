const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { beforeAll, afterAll, afterEach } = require('@jest/globals');

let mongoServer;

// Connect to the in-memory database
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

// Clear database between tests
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

// Close database connection after tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}); 