const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  mobile: { type: String, required: true },
  messages: [{ type: mongoose.Types.ObjectId, ref: 'Message', required: true }],
});

module.exports = mongoose.model('User', userSchema);
