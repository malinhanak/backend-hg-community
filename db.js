require('dotenv').config();
const mongoose = require('mongoose');

const DB_URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@malins-cluster-155rd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const DB_URI_TEST = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@malins-cluster-155rd.mongodb.net/hg_TEST?retryWrites=true&w=majority`;

function connect() {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'Test') {
      mongoose
        .connect(DB_URI_TEST, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true,
        })
        .then((res, err) => {
          if (err) return reject(err);
          resolve();
        });
    } else {
      mongoose
        .connect(DB_URI, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true,
        })
        .then((res, err) => {
          if (err) return reject(err);
          resolve();
        });
    }
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
