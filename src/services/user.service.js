const User = require('../models/user.model');

const getUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const users = await User.find().skip(skip).limit(limit);
  const total = await User.countDocuments();
  return { users, total, page, limit };
};

const getUserById = async (id) => {
  return User.findById(id);
};

const createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

const updateUser = async (id, updateData) => {
  return User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
