import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import { isDbUp, mem, findUserByEmail, stripPassword, newId } from '../fallback/store.js';

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
    const emailNorm = String(email).toLowerCase().trim();

    // ---- Fallback: use in-memory store when MongoDB is down ----
    if (!isDbUp()) {
      const user = findUserByEmail(emailNorm, role);
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
      user = await Admin.findOne({ email: emailNorm });
    } else if (role === 'teacher') {
      user = await Teacher.findOne({ email: emailNorm });
    } else if (role === 'student') {
      user = await Student.findOne({ email: emailNorm });
    } else {
      // Try each collection
      user = (await Admin.findOne({ email: emailNorm })) || (await Teacher.findOne({ email: emailNorm })) || (await Student.findOne({ email: emailNorm }));
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

// POST /api/auth/register  { name, email, password, role, ...extra }
// Creates a user account (student / teacher / admin) and returns a token so the
// user can be logged straight in after registering.
router.post('/register', async (req, res) => {
  try {
    const { name, password, role: rawRole } = req.body;
    const role = ['student', 'teacher', 'admin'].includes(rawRole) ? rawRole : 'student';
    const email = String(req.body.email || '').toLowerCase().trim();

    if (!name || !name.trim() || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (role === 'student' && (!req.body.fatherName || !req.body.className || !req.body.gender)) {
      return res.status(400).json({ message: "Father's name, class and gender are required" });
    }
    if (role === 'teacher' && !req.body.subject) {
      return res.status(400).json({ message: 'Subject is required' });
    }

    const base = { name: name.trim(), email, password: String(password) };

    const extra = (u) =>
      role === 'student'
        ? { rollNo: u.rollNo, className: u.className, section: u.section }
        : role === 'teacher'
        ? { teacherId: u.teacherId, subject: u.subject }
        : {};

    const authResponse = (u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role,
      token: generateToken(u._id, role),
      extra: extra(u),
    });

    const year = new Date().getFullYear();

    // ---- Fallback: in-memory store when MongoDB is down ----
    if (!isDbUp()) {
      if (findUserByEmail(email)) {
        return res.status(400).json({ message: 'This email is already registered' });
      }

      let user;
      if (role === 'student') {
        user = {
          _id: newId('s'),
          ...base,
          rollNo: `BFHS-${year}-${String(mem.students.length + 1).padStart(3, '0')}`,
          fatherName: req.body.fatherName,
          className: req.body.className,
          section: req.body.section || 'A',
          gender: req.body.gender,
          phone: req.body.phone || '',
          attendance: 0,
          marks: [],
        };
        mem.students.push(user);
      } else if (role === 'teacher') {
        user = {
          _id: newId('t'),
          ...base,
          teacherId: `T-${101 + mem.teachers.length}`,
          subject: req.body.subject,
          qualification: req.body.qualification || '',
          classesAssigned: [],
        };
        mem.teachers.push(user);
      } else {
        user = { _id: newId('admin'), ...base, role: 'admin' };
        mem.admins.push(user);
      }

      return res.status(201).json(authResponse(user));
    }

    // ---- MongoDB ----
    const Model = role === 'admin' ? Admin : role === 'teacher' ? Teacher : Student;
    const existing = await Model.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    let user;
    if (role === 'student') {
      const count = await Student.countDocuments();
      user = await Student.create({
        ...base,
        rollNo: `BFHS-${year}-${String(count + 1).padStart(3, '0')}`,
        fatherName: req.body.fatherName,
        className: req.body.className,
        section: req.body.section || 'A',
        gender: req.body.gender,
        phone: req.body.phone || '',
        attendance: 0,
        marks: [],
      });
    } else if (role === 'teacher') {
      const count = await Teacher.countDocuments();
      user = await Teacher.create({
        ...base,
        teacherId: `T-${101 + count}`,
        subject: req.body.subject,
        qualification: req.body.qualification || '',
        classesAssigned: [],
      });
    } else {
      user = await Admin.create({ ...base, role: 'admin' });
    }

    res.status(201).json(authResponse(user));
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(400).json({ message: 'This email is already registered' });
    }
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
