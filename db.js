require('dotenv').config();
const mongoose = require('mongoose');
const MockMongoose = require('mock-mongoose').MockMongoose;

async function connect() {
  if (process.env.NODE_ENV === 'TEST') {
    const mockMongoose = new MockMongoose(mongoose);
    await mockMongoose.prepareStorage();
    await mongoose.connect('mongodb://example.com/TestingDB', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  } else {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    mongoose.connection.on('connected', () => {
      resolve();
    });
    mongoose.connection.on('error', (err) => {
      reject();
    });
  }
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
