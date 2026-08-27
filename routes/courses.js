import express from 'express';
import Course from '../models/Course.js';
import { isDbUp, mem, newId } from '../fallback/store.js';

const router = express.Router();

// GET /api/courses (public)
router.get('/', async (req, res) => {
  try {
    if (!isDbUp()) return res.json(mem.courses);
    const courses = await Course.find().sort({ grade: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/courses
router.post('/', async (req, res) => {
  try {
    if (!isDbUp()) {
      const c = { _id: newId('c'), ...req.body };
      mem.courses.push(c);
      return res.status(201).json(c);
    }
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
