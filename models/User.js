const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  hasSubmittedSurvey: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
