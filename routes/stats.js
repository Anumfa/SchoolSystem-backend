import express from 'express';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Event from '../models/Event.js';
import Gallery from '../models/Gallery.js';
import { isDbUp, mem } from '../fallback/store.js';

const router = express.Router();

// Year the school was founded — "Years of Excellence" is derived from this,
// so the number grows automatically every year.
const FOUNDED_YEAR = 2001;

// A mark at or above this counts as a pass (used for the success rate).
const PASS_MARK = 40;

// Shown when the database has no marks yet.
const DEFAULT_SUCCESS_RATE = 98;

// The school's historical/registry figures. The live database counts are added
// on top, so the site keeps its published numbers while still growing with real
// data. Set both to 0 to display the raw database counts instead.
const BASELINE = { students: 1196, teachers: 71 };

// GET /api/stats  (public - powers the animated stats strip on the home page)
router.get('/', async (req, res) => {
  try {
    let students = 0;
    let teachers = 0;
    let events = 0;
    let gallery = 0;
    let marks = [];

    if (!isDbUp()) {
      students = mem.students.length;
      teachers = mem.teachers.length;
      events = mem.events.length;
      gallery = mem.gallery.length;
      marks = mem.students
        .flatMap((s) => s.marks || [])
        .map((m) => m.final)
        .filter((n) => typeof n === 'number');
    } else {
      [students, teachers, events, gallery] = await Promise.all([
        Student.countDocuments(),
        Teacher.countDocuments(),
        Event.countDocuments(),
        Gallery.countDocuments(),
      ]);
      const withMarks = await Student.find({ 'marks.0': { $exists: true } }).select('marks');
      marks = withMarks
        .flatMap((s) => s.marks.map((m) => m.final))
        .filter((n) => typeof n === 'number');
    }

    const successRate = marks.length
      ? Math.round((marks.filter((m) => m >= PASS_MARK).length / marks.length) * 100)
      : DEFAULT_SUCCESS_RATE;

    res.json({
      students: students + BASELINE.students,
      teachers: teachers + BASELINE.teachers,
      years: Math.max(0, new Date().getFullYear() - FOUNDED_YEAR),
      successRate,
      // Raw database counts (handy for admins / debugging)
      counts: { students, teachers, events, gallery },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
