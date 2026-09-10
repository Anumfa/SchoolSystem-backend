import express from 'express';
import Message from '../models/Message.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDbUp, mem, newId } from '../fallback/store.js';

const router = express.Router();

// POST /api/contact  (public - "Send Us a Message" form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !String(name).trim() || !email || !String(email).trim() || !message || !String(message).trim()) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const payload = {
      name: String(name).trim().slice(0, 80),
      email: String(email).trim().slice(0, 120),
      phone: String(phone || '').trim().slice(0, 40),
      subject: String(subject || '').trim().slice(0, 120),
      message: String(message).trim().slice(0, 2000),
    };

    if (!isDbUp()) {
      const saved = {
        _id: newId('m'),
        ...payload,
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      mem.messages.push(saved);
      return res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.', saved });
    }

    const saved = await Message.create(payload);
    res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.', saved });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/contact  (admin - inbox of contact form messages)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) return res.json(mem.messages.slice().reverse());
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/contact/:id  (admin - mark as read / replied)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.messages.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Message not found' });
      mem.messages[idx] = { ...mem.messages[idx], ...req.body };
      return res.json(mem.messages[idx]);
    }
    const updated = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Message not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/contact/:id  (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.messages.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Message not found' });
      mem.messages.splice(idx, 1);
      return res.json({ message: 'Message deleted' });
    }
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
