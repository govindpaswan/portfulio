const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// 20 messages per hour (was 5 - too restrictive)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { message: 'Too many messages sent. Please try again later.' }
});

// POST - public (user contact form)
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: 'Invalid email address.' });
    const contact = new Contact({ name, email, phone: phone || '', subject: subject || '', message });
    await contact.save();
    res.status(201).json({ message: 'Message sent! I will reply within 24 hours. ✅' });
  } catch (err) {
    console.error('Contact POST error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// GET - admin only
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH mark read - admin
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(contact);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// DELETE - admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
