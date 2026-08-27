import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import { isDbUp, mem, findUserByEmail, stripPassword } from '../fallback/store.js';

const router = express.Router();

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/login  { email, password, role }
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // ---- DEMO MODE: use in-memory store when MongoDB is down ----
    if (!isDbUp()) {
      const user = findUserByEmail(email, role);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const userRole = role === 'admin' || role === 'teacher' || role === 'student'
        ? role
        : (user.teacherId ? 'teacher' : user.rollNo ? 'student' : 'admin');
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
        token: generateToken(user._id, userRole),
        extra:
          userRole === 'student'
            ? { rollNo: user.rollNo, className: user.className, section: user.section }
            : userRole === 'teacher'
            ? { teacherId: user.teacherId, subject: user.subject }
            : {},
      });
    }

    let user = null;
    let userRole = role;

    if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else if (role === 'teacher') {
      user = await Teacher.findOne({ email });
    } else if (role === 'student') {
      user = await Student.findOne({ email });
    } else {
      // Try each collection
      user = (await Admin.findOne({ email })) || (await Teacher.findOne({ email })) || (await Student.findOne({ email }));
      if (user) {
        const check = await Admin.findById(user._id).catch(() => null);
        const checkT = await Teacher.findById(user._id).catch(() => null);
        const checkS = await Student.findById(user._id).catch(() => null);
        if (check) userRole = 'admin';
        else if (checkT) userRole = 'teacher';
        else userRole = 'student';
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: userRole || role,
      token: generateToken(user._id, userRole || role),
      extra:
        userRole === 'student'
          ? { rollNo: user.rollNo, className: user.className, section: user.section }
          : userRole === 'teacher'
          ? { teacherId: user.teacherId, subject: user.subject }
          : {},
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me  (returns profile by token + role in body)
router.post('/me', async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!isDbUp()) {
      const pool =
        role === 'admin' ? mem.admins : role === 'teacher' ? mem.teachers : mem.students;
      const found = (pool || []).find((u) => u._id === userId);
      if (!found) return res.status(404).json({ message: 'User not found' });
      return res.json(stripPassword(found));
    }
    let user = null;
    if (role === 'admin') user = await Admin.findById(userId);
    else if (role === 'teacher') user = await Teacher.findById(userId);
    else user = await Student.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
