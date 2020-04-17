const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error.model');
const User = require('../models/user.model');

const getUsers = async (req, res, next) => {
  const { name, mobile } = req.query;
  const filters = {};
  let users;

  if (name) {
    filters.name = name;
  }

  if (mobile) {
    filters.mobile = mobile;
  }

  try {
    users = await User.find(filters);
  } catch (err) {
    return next(
      new HttpError('Fetching users failed, please try again later', 500)
    );
  }

  if (!users || !users.length) {
    return next(new HttpError('Could not find any users', 404));
  }

  res.status(200).json({
    users: users.map(user => ({
      id: user._id,
      name: user.name,
      imageUrl: user.imageUrl,
      mobile: user.mobile,
    })),
  });
};

const createUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data', 422);
  }

  const { name, imageUrl, mobile } = req.body;
  const createdUser = new User({
    name,
    imageUrl,
    mobile,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError('Creating user failed, please try again', 500));
  }

  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: createdUser._id,
      name: createdUser.name,
      imageUrl: createdUser.imageUrl,
      mobile: createdUser.mobile,
    },
  });
};

exports.getUsers = getUsers;
exports.createUser = createUser;
