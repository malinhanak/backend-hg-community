require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');
const Horse = require('./models/horse');
const User = require('./models/user');
const horsesRouter = require('./routes/horseRouter')(Horse);
const userRouter = require('./routes/userRouter')(User);
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

db.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log('DB is running, listening on port ' + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
