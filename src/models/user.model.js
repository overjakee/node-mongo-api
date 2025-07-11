const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },     // เพิ่มฟิลด์ password
  age: { type: Number, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
