import express from 'express';
import { register, login, addContact, getContacts } from '../controllers/users.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/add-contact', addContact);
router.get('/:userId/contacts', getContacts);

export default router;