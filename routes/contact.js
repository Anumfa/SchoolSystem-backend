import express from 'express';

const router = express.Router();

// POST /api/contact - contact form messages
// Stored in-memory / could be extended with a model
const messages = [];

router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  messages.push({ name, email, subject, message, date: new Date() });
  res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.' });
});

router.get('/', (req, res) => {
  res.json(messages);
});

export default router;
