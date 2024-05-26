import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/Users.model.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { userId, password } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Authenticated'});
});

export default router;