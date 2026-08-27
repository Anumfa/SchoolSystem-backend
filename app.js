import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import teacherRoutes from './routes/teachers.js';
import eventRoutes from './routes/events.js';
import admissionRoutes from './routes/admissions.js';
import courseRoutes from './routes/courses.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api', (req, res) => {
  const mode = mongoose.connection.readyState === 1 ? 'MongoDB' : 'In-Memory (Demo)';
  res.json({ message: '🏫 Bright Future High School API is running!', mode });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

export default app;
