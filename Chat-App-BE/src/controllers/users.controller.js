import User from '../models/Users.model.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    const { fullName, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'user not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'password not match' });

    res.status(200).json({ message: 'Login successful', userId: user._id });
};

export const addContact = async (req, res) => {
    const { username, contactUsername } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const contact = await User.findOne({ username: contactUsername });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        if (user.contacts.includes(contact._id)) {
            return res.status(400).json({ message: 'Contact already added' });
        }

        user.contacts.push(contact._id);
        await user.save();

        res.status(200).json({ message: 'Contact added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getContacts = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.userId }).populate('contacts');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};