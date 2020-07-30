require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const HttpError = require('./models/errors/HttpError');
const EntityNotFoundError = require('./models/errors/EntityNotFoundError');
const User = require('./models/user');
const horseRouter = require('./routes/horseRouter');
const horsesRouter = require('./routes/horsesRouter');
const userRouter = require('./routes/userRouter');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const store = new MongoDBStore({
  uri: process.env.MONGO_DB_URI,
  collection: 'sessions',
});

app.use(bodyParser.json());
app.use(
  session({
    secret: 'mysuperdupersecretsecretword',
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

app.use(async (req, res, next) => {
  if (!req.session.user) return next();

  const user = await User.findById(req.session.user._id);

  if (!user) {
    return next(new EntityNotFoundError(`Kunde inte hitta användade från session`));
  }

  req.user = user;

  next();
});

app.use('/api/users', userRouter);
app.use('/api/horses', horsesRouter);
app.use('/api/horse', horseRouter);
app.use('/api/docs', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/docs/index.html'));
});

app.use((req, res, next) => {
  throw new HttpError('Could not find the requested route', 404);
});

app.use((error, req, res, next) => {
  return (
    res.status(error.code).json({ message: error.message, error: error.errors }) || res.status(500)
  );
});

(async () => {
  try {
    await db.connect();
    app.listen(process.env.NODE_ENV === 'Test' ? 4000 : PORT, () => {
      if (process.env.NODE_ENV === 'Test') return;
      console.log('App is running on port  ' + PORT);
    });
  } catch (err) {
    console.error(`Connection error: ${err.stack} on Worker process: ${process.pid}`);
    process.exit(1);
  }
})();

module.exports = app;
