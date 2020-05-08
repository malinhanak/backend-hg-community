require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');
const horsesRouter = require('./routes/horseRouter');
const userRouter = require('./routes/userRouter');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/api/users', userRouter);
app.use('/api/horses', horsesRouter);
// app.use('/api/updates', userRoutes);
// app.use('/api/cms', userRoutes);

app.use((req, res, next) => {
  throw new HttpError('Could not find the requested route', 404);
});

app.use((error, req, res, next) => {
  return res
    .status(error.code)
    .json({ message: error.message, error: error.error });
});

db.connect()
  .then(() => {
    app.server = app.listen(PORT, () => {
      console.log('DB is running, listening on port ' + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
