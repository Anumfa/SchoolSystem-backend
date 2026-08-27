import express from 'express';
import Admission from '../models/Admission.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDbUp, mem, newId } from '../fallback/store.js';

const router = express.Router();

// GET /api/admissions
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) return res.json(mem.admissions);
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/admissions (public - application form)
router.post('/', async (req, res) => {
  try {
    if (!isDbUp()) {
      const admission = { _id: newId('ad'), ...req.body, status: 'pending' };
      mem.admissions.unshift(admission);
      return res.status(201).json({ message: 'Application submitted successfully!', admission });
    }
    const admission = await Admission.create(req.body);
    res.status(201).json({ message: 'Application submitted successfully!', admission });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/admissions/:id  (admin update status)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.admissions.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Application not found' });
      mem.admissions[idx] = { ...mem.admissions[idx], ...req.body };
      return res.json(mem.admissions[idx]);
    }
    const admission = await Admission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!admission) return res.status(404).json({ message: 'Application not found' });
    res.json(admission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/admissions/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.admissions.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Application not found' });
      mem.admissions.splice(idx, 1);
      return res.json({ message: 'Application deleted' });
    }
    const admission = await Admission.findByIdAndDelete(req.params.id);
    if (!admission) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
