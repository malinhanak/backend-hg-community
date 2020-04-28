require('dotenv').config();
const mongoose = require('mongoose');

const DB_URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@malins-cluster-155rd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

function connect() {
  return new Promise((resolve, reject) => {
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
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
