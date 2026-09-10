import express from 'express';
import Review from '../models/Review.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDbUp, mem, newId } from '../fallback/store.js';

const router = express.Router();

// GET /api/reviews  (public - approved reviews only, shown on the website)
router.get('/', async (req, res) => {
  try {
    if (!isDbUp()) {
      return res.json(mem.reviews.filter((r) => r.status === 'approved').slice().reverse());
    }
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reviews/all  (admin - every review including pending ones)
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) return res.json(mem.reviews.slice().reverse());
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reviews  (public - the "Write a Review" form)
router.post('/', async (req, res) => {
  try {
    const { name, role, rating, message } = req.body;

    if (!name || !String(name).trim() || !message || !String(message).trim()) {
      return res.status(400).json({ message: 'Please enter your name and your review' });
    }

    const payload = {
      name: String(name).trim().slice(0, 60),
      role: String(role || 'Parent').trim().slice(0, 60),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      message: String(message).trim().slice(0, 600),
    };

    if (!isDbUp()) {
      const review = { _id: newId('r'), ...payload, status: 'pending', createdAt: new Date().toISOString() };
      mem.reviews.push(review);
      return res.status(201).json(review);
    }

    const review = await Review.create(payload);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/reviews/:id  (admin - approve / reject)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.reviews.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Review not found' });
      mem.reviews[idx] = { ...mem.reviews[idx], ...req.body };
      return res.json(mem.reviews[idx]);
    }
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/reviews/:id  (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.reviews.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Review not found' });
      mem.reviews.splice(idx, 1);
      return res.json({ message: 'Review deleted' });
    }
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
