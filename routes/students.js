import express from 'express';
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/auth.js';
import { isDbUp, mem, stripPassword, newId } from '../fallback/store.js';

const router = express.Router();

// GET /api/students
router.get('/', protect, async (req, res) => {
  try {
    if (!isDbUp()) return res.json(mem.students.map(stripPassword));
    const students = await Student.find().sort({ className: 1, rollNo: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/students/:id
router.get('/:id', protect, async (req, res) => {
  try {
    if (!isDbUp()) {
      const s = mem.students.find((x) => x._id === req.params.id);
      if (!s) return res.status(404).json({ message: 'Student not found' });
      return res.json(stripPassword(s));
    }
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/students
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const s = { _id: newId('s'), ...req.body, password: req.body.password || 'student123', attendance: 100 };
      mem.students.push(s);
      return res.status(201).json(stripPassword(s));
    }
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/students/:id
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.students.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Student not found' });
      mem.students[idx] = { ...mem.students[idx], ...req.body };
      return res.json(stripPassword(mem.students[idx]));
    }
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (!isDbUp()) {
      const idx = mem.students.findIndex((x) => x._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Student not found' });
      mem.students.splice(idx, 1);
      return res.json({ message: 'Student deleted' });
    }
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
