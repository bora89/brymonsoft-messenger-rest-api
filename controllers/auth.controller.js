const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const HttpError = require('../models/http-error.model');

const login = async (req, res, next) => {
  const { login, password } = req.body;

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD
    );
  } catch (err) {
    return next(
      new HttpError(
        'Could not log you in, please check your credentials and try again',
        500
      )
    );
  }

  if (!isValidPassword || login !== process.env.ADMIN_LOGIN) {
    return next(
      new HttpError('Invalid credentials, could not log you in', 403)
    );
  }

  let token;
  try {
    token = jwt.sign({ login: process.env.ADMIN_LOGIN }, process.env.JWT_KEY, {
      expiresIn: '1h',
    });
  } catch (err) {
    return next(
      new HttpError('Logging in failed, please try again later', 500)
    );
  }

  res.json({ token });
};

exports.login = login;
