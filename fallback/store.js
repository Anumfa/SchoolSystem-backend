import mongoose from 'mongoose';

/**
 * In-memory fallback store.
 * Used when MongoDB is unavailable (e.g. blocked by system policy).
 * Keeps the same data shape as the Mongoose models so routes can switch
 * seamlessly between MongoDB and this store.
 */

export const isDbUp = () => mongoose.connection.readyState === 1;

// Seed data (mirrors backend/seed.js, plaintext passwords for fallback login)
let nextStudentId = 5;
let nextTeacherId = 5;
let nextEventId = 6;
let nextCourseId = 4;
let nextAdmissionId = 1;
let nextAdminId = 2;
let nextGalleryId = 9;

const admins = [
  { _id: 'a1', name: 'Mr. Ahmed Raza', email: 'admin@bfhs.edu.pk', password: 'admin123', phone: '+92 300 1234567', role: 'admin' },
];

const teachers = [
  { _id: 't1', teacherId: 'T-101', name: 'Ms. Ayesha Khan', email: 'ayesha@bfhs.edu.pk', password: 'teacher123', subject: 'Mathematics', qualification: 'M.Sc Mathematics, M.Ed', experience: '12 years', phone: '+92 321 1112233', gender: 'Female', classesAssigned: ['Grade 6', 'Grade 7', 'Grade 8'], salary: 85000 },
  { _id: 't2', teacherId: 'T-102', name: 'Mr. Bilal Ahmed', email: 'bilal@bfhs.edu.pk', password: 'teacher123', subject: 'Physics', qualification: 'M.Phil Physics', experience: '9 years', phone: '+92 322 2223344', gender: 'Male', classesAssigned: ['Grade 9', 'Grade 10'], salary: 95000 },
  { _id: 't3', teacherId: 'T-103', name: 'Ms. Sana Tariq', email: 'sana@bfhs.edu.pk', password: 'teacher123', subject: 'English', qualification: 'M.A English, B.Ed', experience: '7 years', phone: '+92 333 3334455', gender: 'Female', classesAssigned: ['Grade 4', 'Grade 5', 'Grade 6'], salary: 78000 },
  { _id: 't4', teacherId: 'T-104', name: 'Mr. Hassan Ali', email: 'hassan@bfhs.edu.pk', password: 'teacher123', subject: 'Computer Science', qualification: 'MS Computer Science', experience: '5 years', phone: '+92 345 4445566', gender: 'Male', classesAssigned: ['Grade 8', 'Grade 9'], salary: 90000 },
];

const students = [
  { _id: 's1', rollNo: 'BFHS-2026-001', name: 'Ali Hassan', fatherName: 'Muhammad Hassan', dateOfBirth: '2013-04-12', gender: 'Male', className: 'Grade 7', section: 'A', email: 'ali@bfhs.edu.pk', password: 'student123', phone: '+92 300 5556677', guardianPhone: '+92 300 5556677', bloodGroup: 'B+', attendance: 96, marks: [
    { subject: 'English', midterm: 78, final: 84, grade: 'A' },
    { subject: 'Mathematics', midterm: 88, final: 91, grade: 'A+' },
    { subject: 'Science', midterm: 82, final: 86, grade: 'A' },
    { subject: 'Urdu', midterm: 75, final: 80, grade: 'B+' },
  ] },
  { _id: 's2', rollNo: 'BFHS-2026-002', name: 'Fatima Noor', fatherName: 'Abdul Noor', dateOfBirth: '2012-09-25', gender: 'Female', className: 'Grade 8', section: 'A', email: 'fatima@bfhs.edu.pk', password: 'student123', phone: '+92 301 6667788', guardianPhone: '+92 301 6667788', bloodGroup: 'A+', attendance: 98, marks: [
    { subject: 'English', midterm: 85, final: 90, grade: 'A+' },
    { subject: 'Mathematics', midterm: 80, final: 85, grade: 'A' },
    { subject: 'Science', midterm: 88, final: 92, grade: 'A+' },
    { subject: 'Urdu', midterm: 82, final: 86, grade: 'A' },
  ] },
  { _id: 's3', rollNo: 'BFHS-2026-003', name: 'Hamza Iqbal', fatherName: 'Iqbal Hussain', dateOfBirth: '2010-02-14', gender: 'Male', className: 'Grade 10', section: 'B', email: 'hamza@bfhs.edu.pk', password: 'student123', phone: '+92 302 7778899', guardianPhone: '+92 302 7778899', bloodGroup: 'O+', attendance: 92, marks: [
    { subject: 'English', midterm: 70, final: 76, grade: 'B+' },
    { subject: 'Mathematics', midterm: 85, final: 89, grade: 'A' },
    { subject: 'Physics', midterm: 80, final: 83, grade: 'A' },
    { subject: 'Computer', midterm: 90, final: 95, grade: 'A+' },
  ] },
  { _id: 's4', rollNo: 'BFHS-2026-004', name: 'Zainab Fatima', fatherName: 'Ghulam Rasool', dateOfBirth: '2014-07-08', gender: 'Female', className: 'Grade 6', section: 'A', email: 'zainab@bfhs.edu.pk', password: 'student123', phone: '+92 303 8889900', guardianPhone: '+92 303 8889900', bloodGroup: 'AB+', attendance: 95, marks: [
    { subject: 'English', midterm: 82, final: 88, grade: 'A' },
    { subject: 'Mathematics', midterm: 86, final: 90, grade: 'A+' },
    { subject: 'Science', midterm: 79, final: 84, grade: 'A' },
    { subject: 'Urdu', midterm: 88, final: 91, grade: 'A+' },
  ] },
];

const events = [
  { _id: 'e1', title: 'Annual Sports Gala 2026', description: 'A fun-filled day of athletics, races, and team sports for all grade levels.', date: '2026-11-20', time: '9:00 AM', venue: 'School Ground', category: 'Sports', featured: true, status: 'upcoming' },
  { _id: 'e2', title: 'Science & Tech Exhibition', description: 'Students showcase innovative science and technology projects.', date: '2026-12-05', time: '10:00 AM', venue: 'Main Hall', category: 'Academics', featured: true, status: 'upcoming' },
  { _id: 'e3', title: 'Independence Day Celebration', description: 'Flag hoisting ceremony and cultural performances celebrating 14th August.', date: '2026-08-14', time: '8:30 AM', venue: 'School Ground', category: 'Cultural', featured: true, status: 'upcoming' },
  { _id: 'e4', title: 'Parent Teacher Meeting', description: 'Quarterly meeting to discuss student progress with parents.', date: '2026-09-15', time: '2:00 PM', venue: 'Classrooms', category: 'Other', status: 'upcoming' },
  { _id: 'e5', title: 'Annual Result Day', description: 'Distribution of annual examination results and awards ceremony.', date: '2027-03-30', time: '10:00 AM', venue: 'School Hall', category: 'Annual', status: 'upcoming' },
];

const courses = [
  { _id: 'c1', title: 'Primary Section (KG - Grade 5)', code: 'PRM', grade: 'KG - 5', description: 'Foundational learning focusing on literacy, numeracy, and character building in a fun, safe environment.', subjects: ['English', 'Urdu', 'Mathematics', 'General Science', 'Islamiyat'], duration: '6 Years', fee: 8500 },
  { _id: 'c2', title: 'Middle Section (Grade 6 - 8)', code: 'MID', grade: '6 - 8', description: 'Strengthening core concepts with science labs, computer lab, and activity-based learning.', subjects: ['English', 'Urdu', 'Mathematics', 'Science', 'Computer Science'], duration: '3 Years', fee: 10000 },
  { _id: 'c3', title: 'Matriculation (Grade 9 - 10)', code: 'MAT', grade: '9 - 10', description: 'Board exam preparation with experienced faculty, mock tests, and career counselling.', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science'], duration: '2 Years', fee: 12500 },
];

const admissions = [];

const gallery = [
  { _id: 'g1', title: 'Main School Building', category: 'Campus', image: '/gallery/campus-building.svg', description: 'Our main academic block.', order: 0 },
  { _id: 'g2', title: 'Annual Sports Gala', category: 'Sports', image: '/gallery/sports-gala.svg', description: 'Athletics and team sports day.', order: 1 },
  { _id: 'g3', title: 'Science Lab', category: 'Campus', image: '/gallery/science-lab.svg', description: 'Fully equipped science laboratory.', order: 2 },
  { _id: 'g4', title: 'Independence Day', category: 'Events', image: '/gallery/independence-day.svg', description: '14th August celebrations.', order: 3 },
  { _id: 'g5', title: 'Smart Classroom', category: 'Classrooms', image: '/gallery/smart-classroom.svg', description: 'Interactive smart boards in every room.', order: 4 },
  { _id: 'g6', title: 'Library', category: 'Campus', image: '/gallery/library.svg', description: 'Thousands of books and quiet study space.', order: 5 },
  { _id: 'g7', title: 'Computer Lab', category: 'Classrooms', image: '/gallery/computer-lab.svg', description: 'Modern computer lab for IT classes.', order: 6 },
  { _id: 'g8', title: 'Arts Exhibition', category: 'Events', image: '/gallery/arts-exhibition.svg', description: 'Student artwork on display.', order: 7 },
];

// ---- Helpers ----
export const mem = {
  admins,
  teachers,
  students,
  events,
  courses,
  admissions,
  gallery,
};

export const newId = (prefix) => {
  const map = { a: 'a', t: 't', s: 's', e: 'e', c: 'c', ad: 'ad', g: 'g' };
  const key = map[prefix] || prefix;
  if (key === 's') return `${key}${nextStudentId++}`;
  if (key === 't') return `${key}${nextTeacherId++}`;
  if (key === 'e') return `${key}${nextEventId++}`;
  if (key === 'c') return `${key}${nextCourseId++}`;
  if (key === 'ad') return `${key}${nextAdmissionId++}`;
  if (key === 'g') return `${key}${nextGalleryId++}`;
  return `${key}${nextAdminId++}`;
};

export const stripPassword = (obj) => {
  if (!obj) return obj;
  const { password, ...rest } = obj;
  return rest;
};

// Login helper for fallback mode
export const findUserByEmail = (email, role) => {
  if (role === 'admin') return admins.find((u) => u.email === email);
  if (role === 'teacher') return teachers.find((u) => u.email === email);
  if (role === 'student') return students.find((u) => u.email === email);
  return (
    admins.find((u) => u.email === email) ||
    teachers.find((u) => u.email === email) ||
    students.find((u) => u.email === email)
  );
};
