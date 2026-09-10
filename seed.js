import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import Teacher from './models/Teacher.js';
import Student from './models/Student.js';
import Event from './models/Event.js';
import Course from './models/Course.js';
import Gallery from './models/Gallery.js';
import Review from './models/Review.js';

dotenv.config();
await connectDB();

const seedData = async () => {
  try {
    // Clear existing
    await Promise.all([
      Admin.deleteMany(),
      Teacher.deleteMany(),
      Student.deleteMany(),
      Event.deleteMany(),
      Course.deleteMany(),
      Gallery.deleteMany(),
      Review.deleteMany(),
    ]);

    // Admin
    const admin = await Admin.create({
      name: 'Mr. Ahmed Raza',
      email: 'admin@bfhs.edu.pk',
      password: 'admin123',
      phone: '+92 300 1234567',
    });
    console.log('✅ Admin created:', admin.email, '/ admin123');

    // Teachers
    const teachers = await Teacher.create([
      {
        teacherId: 'T-101',
        name: 'Ms. Ayesha Khan',
        email: 'ayesha@bfhs.edu.pk',
        password: 'teacher123',
        subject: 'Mathematics',
        qualification: 'M.Sc Mathematics, M.Ed',
        experience: '12 years',
        phone: '+92 321 1112233',
        gender: 'Female',
        classesAssigned: ['Grade 6', 'Grade 7', 'Grade 8'],
        salary: 85000,
      },
      {
        teacherId: 'T-102',
        name: 'Mr. Bilal Ahmed',
        email: 'bilal@bfhs.edu.pk',
        password: 'teacher123',
        subject: 'Physics',
        qualification: 'M.Phil Physics',
        experience: '9 years',
        phone: '+92 322 2223344',
        gender: 'Male',
        classesAssigned: ['Grade 9', 'Grade 10'],
        salary: 95000,
      },
      {
        teacherId: 'T-103',
        name: 'Ms. Sana Tariq',
        email: 'sana@bfhs.edu.pk',
        password: 'teacher123',
        subject: 'English',
        qualification: 'M.A English, B.Ed',
        experience: '7 years',
        phone: '+92 333 3334455',
        gender: 'Female',
        classesAssigned: ['Grade 4', 'Grade 5', 'Grade 6'],
        salary: 78000,
      },
      {
        teacherId: 'T-104',
        name: 'Mr. Hassan Ali',
        email: 'hassan@bfhs.edu.pk',
        password: 'teacher123',
        subject: 'Computer Science',
        qualification: 'MS Computer Science',
        experience: '5 years',
        phone: '+92 345 4445566',
        gender: 'Male',
        classesAssigned: ['Grade 8', 'Grade 9'],
        salary: 90000,
      },
    ]);
    console.log(`✅ ${teachers.length} teachers created (password: teacher123)`);

    // Students
    const students = await Student.create([
      {
        rollNo: 'BFHS-2026-001',
        name: 'Ali Hassan',
        fatherName: 'Muhammad Hassan',
        dateOfBirth: new Date('2013-04-12'),
        gender: 'Male',
        className: 'Grade 7',
        section: 'A',
        email: 'ali@bfhs.edu.pk',
        password: 'student123',
        phone: '+92 300 5556677',
        guardianPhone: '+92 300 5556677',
        bloodGroup: 'B+',
        attendance: 96,
        marks: [
          { subject: 'English', midterm: 78, final: 84, grade: 'A' },
          { subject: 'Mathematics', midterm: 88, final: 91, grade: 'A+' },
          { subject: 'Science', midterm: 82, final: 86, grade: 'A' },
          { subject: 'Urdu', midterm: 75, final: 80, grade: 'B+' },
        ],
      },
      {
        rollNo: 'BFHS-2026-002',
        name: 'Fatima Noor',
        fatherName: 'Abdul Noor',
        dateOfBirth: new Date('2012-09-25'),
        gender: 'Female',
        className: 'Grade 8',
        section: 'A',
        email: 'fatima@bfhs.edu.pk',
        password: 'student123',
        phone: '+92 301 6667788',
        guardianPhone: '+92 301 6667788',
        bloodGroup: 'A+',
        attendance: 98,
        marks: [
          { subject: 'English', midterm: 85, final: 90, grade: 'A+' },
          { subject: 'Mathematics', midterm: 80, final: 85, grade: 'A' },
          { subject: 'Science', midterm: 88, final: 92, grade: 'A+' },
          { subject: 'Urdu', midterm: 82, final: 86, grade: 'A' },
        ],
      },
      {
        rollNo: 'BFHS-2026-003',
        name: 'Hamza Iqbal',
        fatherName: 'Iqbal Hussain',
        dateOfBirth: new Date('2010-02-14'),
        gender: 'Male',
        className: 'Grade 10',
        section: 'B',
        email: 'hamza@bfhs.edu.pk',
        password: 'student123',
        phone: '+92 302 7778899',
        guardianPhone: '+92 302 7778899',
        bloodGroup: 'O+',
        attendance: 92,
        marks: [
          { subject: 'English', midterm: 70, final: 76, grade: 'B+' },
          { subject: 'Mathematics', midterm: 85, final: 89, grade: 'A' },
          { subject: 'Physics', midterm: 80, final: 83, grade: 'A' },
          { subject: 'Computer', midterm: 90, final: 95, grade: 'A+' },
        ],
      },
      {
        rollNo: 'BFHS-2026-004',
        name: 'Zainab Fatima',
        fatherName: 'Ghulam Rasool',
        dateOfBirth: new Date('2014-07-08'),
        gender: 'Female',
        className: 'Grade 6',
        section: 'A',
        email: 'zainab@bfhs.edu.pk',
        password: 'student123',
        phone: '+92 303 8889900',
        guardianPhone: '+92 303 8889900',
        bloodGroup: 'AB+',
        attendance: 95,
        marks: [
          { subject: 'English', midterm: 82, final: 88, grade: 'A' },
          { subject: 'Mathematics', midterm: 86, final: 90, grade: 'A+' },
          { subject: 'Science', midterm: 79, final: 84, grade: 'A' },
          { subject: 'Urdu', midterm: 88, final: 91, grade: 'A+' },
        ],
      },
    ]);
    console.log(`✅ ${students.length} students created (password: student123)`);

    // Courses
    const courses = await Course.create([
      {
        title: 'Primary Section (KG - Grade 5)',
        code: 'PRM',
        grade: 'KG - 5',
        description: 'Foundational learning focusing on literacy, numeracy, and character building in a fun, safe environment.',
        subjects: ['English', 'Urdu', 'Mathematics', 'General Science', 'Islamiyat', 'Computer Basics', 'Art & Craft'],
        duration: '6 Years',
        fee: 8500,
      },
      {
        title: 'Middle Section (Grade 6 - 8)',
        code: 'MID',
        grade: '6 - 8',
        description: 'Strengthening core concepts with science labs, computer lab, and activity-based learning.',
        subjects: ['English', 'Urdu', 'Mathematics', 'Science', 'Islamiyat', 'Computer Science', 'Social Studies'],
        duration: '3 Years',
        fee: 10000,
      },
      {
        title: 'Matriculation (Grade 9 - 10)',
        code: 'MAT',
        grade: '9 - 10',
        description: 'Board exam preparation with experienced faculty, mock tests, and career counselling.',
        subjects: ['English', 'Urdu', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Pak Studies'],
        duration: '2 Years',
        fee: 12500,
      },
    ]);
    console.log(`✅ ${courses.length} courses created`);

    // Events
    const events = await Event.create([
      {
        title: 'Annual Sports Gala 2026',
        description: 'A fun-filled day of athletics, races, and team sports for all grade levels.',
        date: new Date('2026-11-20'),
        time: '9:00 AM',
        venue: 'School Ground',
        category: 'Sports',
        image: '/gallery/sports-gala.svg',
        featured: true,
        status: 'upcoming',
      },
      {
        title: 'Science & Tech Exhibition',
        description: 'Students showcase innovative science and technology projects.',
        date: new Date('2026-12-05'),
        time: '10:00 AM',
        venue: 'Main Hall',
        category: 'Academics',
        image: '/gallery/science-lab.svg',
        featured: true,
        status: 'upcoming',
      },
      {
        title: 'Independence Day Celebration',
        description: 'Flag hoisting ceremony and cultural performances celebrating 14th August.',
        date: new Date('2026-08-14'),
        time: '8:30 AM',
        venue: 'School Ground',
        category: 'Cultural',
        image: '/gallery/independence-day.svg',
        featured: true,
        status: 'upcoming',
      },
      {
        title: 'Parent Teacher Meeting',
        description: 'Quarterly meeting to discuss student progress with parents.',
        date: new Date('2026-09-15'),
        time: '2:00 PM',
        venue: 'Classrooms',
        category: 'Other',
        image: '/gallery/smart-classroom.svg',
        status: 'upcoming',
      },
      {
        title: 'Annual Result Day',
        description: 'Distribution of annual examination results and awards ceremony.',
        date: new Date('2027-03-30'),
        time: '10:00 AM',
        venue: 'School Hall',
        category: 'Annual',
        image: '/gallery/arts-exhibition.svg',
        status: 'upcoming',
      },
      {
        title: 'Inter-School Football Tournament',
        description: 'Our football team competes against schools from across the city.',
        date: new Date('2026-10-18'),
        time: '3:30 PM',
        venue: 'Sports Ground',
        category: 'Sports',
        image: '/gallery/library.svg',
        status: 'upcoming',
      },
      {
        title: 'Computer Literacy Week',
        description: 'Coding workshops and a digital poster competition for Grade 6-10.',
        date: new Date('2026-11-02'),
        time: '11:00 AM',
        venue: 'Computer Lab',
        category: 'Academics',
        image: '/gallery/computer-lab.svg',
        status: 'upcoming',
      },
    ]);
    console.log(`✅ ${events.length} events created`);

    // Gallery
    const gallery = await Gallery.create([
      { title: 'Main School Building', category: 'Campus', image: '/gallery/campus-building.svg', description: 'Our main academic block.', order: 0 },
      { title: 'Annual Sports Gala', category: 'Sports', image: '/gallery/sports-gala.svg', description: 'Athletics and team sports day.', order: 1 },
      { title: 'Science Lab', category: 'Campus', image: '/gallery/science-lab.svg', description: 'Fully equipped science laboratory.', order: 2 },
      { title: 'Independence Day', category: 'Events', image: '/gallery/independence-day.svg', description: '14th August celebrations.', order: 3 },
      { title: 'Smart Classroom', category: 'Classrooms', image: '/gallery/smart-classroom.svg', description: 'Interactive smart boards in every room.', order: 4 },
      { title: 'Library', category: 'Campus', image: '/gallery/library.svg', description: 'Thousands of books and quiet study space.', order: 5 },
      { title: 'Computer Lab', category: 'Classrooms', image: '/gallery/computer-lab.svg', description: 'Modern computer lab for IT classes.', order: 6 },
      { title: 'Arts Exhibition', category: 'Events', image: '/gallery/arts-exhibition.svg', description: 'Student artwork on display.', order: 7 },
    ]);
    console.log(`✅ ${gallery.length} gallery images created`);

    // Reviews (approved = shown on the home page testimonials section)
    const reviews = await Review.create([
      { name: 'Mrs. Nadia Aslam', role: 'Parent of Grade 8 Student', rating: 5, message: 'BFHS has transformed my son into a confident, disciplined learner. The teachers genuinely care about every child’s progress.', status: 'approved' },
      { name: 'Mr. Imran Sheikh', role: 'Parent of Grade 10 Student', rating: 5, message: 'The science labs and computer education here are outstanding. My daughter won first prize in the city science exhibition!', status: 'approved' },
      { name: 'Mrs. Saira Batool', role: 'Alumna & Parent', rating: 5, message: 'A wonderful, safe environment with excellent academics and character building. Proud to be part of the BFHS family.', status: 'approved' },
    ]);
    console.log(`✅ ${reviews.length} reviews created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('  Admin:   admin@bfhs.edu.pk / admin123');
    console.log('  Teacher: ayesha@bfhs.edu.pk / teacher123');
    console.log('  Student: ali@bfhs.edu.pk / student123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
