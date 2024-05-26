// src/middleware/authMiddleware.js
import bcrypt from 'bcrypt';
import User from '../models/Users.model.js';

const authMiddleware = async (req, res, next) => {
  const { userId, password } = req.body;

  const user = await User.findOne({ userId });
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  next();
};

export default authMiddleware;