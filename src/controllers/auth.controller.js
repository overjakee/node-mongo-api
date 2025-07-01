const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { signToken } = require('../utils/jwt.util');  // นำเข้า signToken

exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword, name });
    res.status(201).json({ message: 'Registered successfully', user: { id: user._id, email: user.email } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // ใช้ signToken แทน jwt.sign
    const token = signToken({ userId: user._id }, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    next(err);
  }
};
