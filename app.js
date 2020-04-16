const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users.routes');
const messagesRoutes = require('./routes/messages.routes');
const HttpError = require('./models/http-error.model');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);

app.use((req, res, next) => {
  throw new HttpError('Could not find this route', 404);
});

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res
    .status(err.code || 500)
    .json({ message: err.message || 'An unknown error occured' });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@brymonsoft-messenger-rest-api-db-4apqn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch(err => console.log(err));
