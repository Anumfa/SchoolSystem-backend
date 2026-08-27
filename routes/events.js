import express from 'express';
import Event from '../models/Event.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDbUp, mem, newId } from '../fallback/store.js';

const router = express.Router();

// GET /api/events (public)
router.get('/', async (req, res) => {
  try {
    if (!isDbUp()) return res.json(mem.events);
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/events/featured
router.get('/featured', async (req, res) => {
  try {
    if (!isDbUp()) return res.json(mem.events.filter((e) => e.featured).slice(0, 3));
    const events = await Event.find({ featured: true }).sort({ date: 1 }).limit(3);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/events
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const ev = { _id: newId('e'), ...req.body };
      mem.events.push(ev);
      return res.status(201).json(ev);
    }
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/events/:id
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.events.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Event not found' });
      mem.events[idx] = { ...mem.events[idx], ...req.body };
      return res.json(mem.events[idx]);
    }
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/events/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.events.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Event not found' });
      mem.events.splice(idx, 1);
      return res.json({ message: 'Event deleted' });
    }
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
