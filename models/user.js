const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String },
  horses: [{ type: mongoose.Types.ObjectId, ref: 'Horse' }],
  name: { type: String, required: true, unique: true },
  level: { type: String, required: true },
  stable: { type: String },
  roles: { type: [String], required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
