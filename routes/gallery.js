import express from 'express';
import Gallery from '../models/Gallery.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDbUp, mem, newId } from '../fallback/store.js';

const router = express.Router();

// GET /api/gallery (public)
router.get('/', async (req, res) => {
  try {
    if (!isDbUp()) return res.json(mem.gallery);
    const items = await Gallery.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/gallery (admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const item = { _id: newId('g'), order: mem.gallery.length, ...req.body };
      mem.gallery.push(item);
      return res.status(201).json(item);
    }
    const item = await Gallery.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/gallery/:id (admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.gallery.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Gallery item not found' });
      mem.gallery[idx] = { ...mem.gallery[idx], ...req.body };
      return res.json(mem.gallery[idx]);
    }
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/gallery/:id (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.gallery.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Gallery item not found' });
      mem.gallery.splice(idx, 1);
      return res.json({ message: 'Gallery item deleted' });
    }
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
