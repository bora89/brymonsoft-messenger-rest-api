const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const deliverMessageToRecipient = require('../utils/delivery-service');

const getMessages = async (req, res, next) => {
  let users;
  try {
    users = await User.find().populate('messages');
  } catch (err) {
    return next(
      new HttpError('Fetching messages failed, please try again later', 500)
    );
  }

  if (!users || !users.length) {
    return next(new HttpError('Could not find any messages', 404));
  }

  const dialogs = users.map(user => ({
    userName: user.name,
    userImageUrl: user.imageUrl,
    messages: user.messages.map(message => ({
      previewText: message.text.slice(0, 3),
      fullText: message.text,
      date: message.date,
    })),
  }));
  res.json({ dialogs });
};

const createMessage = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data', 422);
  }

  const { text, date, recipientId } = req.body;
  const createdMessage = new Message({
    text,
    date,
    recipient: recipientId,
    isDelivered: false,
    isRead: false,
  });

  let user;
  try {
    user = await User.findById(recipientId);
  } catch (err) {
    return next(new HttpError('Sending message failed, please try again', 500));
  }

  if (!user) {
    return next(
      new HttpError('Could not find recipient with provided id', 404)
    );
  }

  deliverMessageToRecipient(createdMessage);

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdMessage.save({ session });
    user.messages.push(createdMessage);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError('Sending message failed, please try again', 500));
  }

  res
    .status(201)
    .json({ message: 'Message sent successfully', message: createdMessage });
};

exports.getMessages = getMessages;
exports.createMessage = createMessage;
