require('dotenv').config();
const mongoose = require('mongoose');
const MockMongoose = require('mock-mongoose').MockMongoose;

async function connect() {
  if (process.env.NODE_ENV === 'Test') {
    const mockMongoose = new MockMongoose(mongoose);
    await mockMongoose.prepareStorage();
    await mongoose.connect('mongodb://example.com/TestingDB', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  } else {
    try {
      await mongoose.connect(process.env.MONGO_DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      });

      console.log(`Connected to DB`);
    } catch (error) {
      console.error(`Something went wrong`, err);
      // process.exit(1)
    }
  }
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
