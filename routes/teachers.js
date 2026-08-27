import express from 'express';
import Teacher from '../models/Teacher.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDbUp, mem, stripPassword, newId } from '../fallback/store.js';

const router = express.Router();

// GET /api/teachers (public)
router.get('/', async (req, res) => {
  try {
    if (!isDbUp()) return res.json(mem.teachers.map(stripPassword));
    const teachers = await Teacher.find().select('-password').sort({ name: 1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/teachers/:id
router.get('/:id', async (req, res) => {
  try {
    if (!isDbUp()) {
      const t = mem.teachers.find((x) => x._id === req.params.id);
      if (!t) return res.status(404).json({ message: 'Teacher not found' });
      return res.json(stripPassword(t));
    }
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/teachers
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const t = { _id: newId('t'), ...req.body, password: req.body.password || 'teacher123' };
      mem.teachers.push(t);
      return res.status(201).json(stripPassword(t));
    }
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/teachers/:id
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.teachers.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Teacher not found' });
      mem.teachers[idx] = { ...mem.teachers[idx], ...req.body };
      return res.json(stripPassword(mem.teachers[idx]));
    }
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/teachers/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.teachers.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Teacher not found' });
      mem.teachers.splice(idx, 1);
      return res.json({ message: 'Teacher deleted' });
    }
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
