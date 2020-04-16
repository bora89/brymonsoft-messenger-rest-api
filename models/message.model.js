const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  text: { type: String, required: true },
  date: { type: Date, required: true },
  recipient: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  isDelivered: { type: Boolean, required: true },
  isRead: { type: Boolean, required: true },
});

module.exports = mongoose.model('Message', messageSchema);
