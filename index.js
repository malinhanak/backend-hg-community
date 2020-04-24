const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');
const horsesRoutes = require('./routes/horses');
const userRoutes = require('./routes/users');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/horses', horsesRoutes);
// app.use('/api/updates', userRoutes);
// app.use('/api/cms', userRoutes);

app.use((req, res, next) => {
  throw new HttpError('Could not find the requested route', 404);
});

mongoose
  .connect(
    `mongodb+srv://hgAdmin:hg_forLIFE@art-api-155rd.mongodb.net/hg-dev?retryWrites=true&w=majority`,
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  )
  .then(() => {
    app.listen(process.env.PORT || PORT);
    console.log('DB is running');
  })
  .catch((err) => {
    console.log(err);
  });
