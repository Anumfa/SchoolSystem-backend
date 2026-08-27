import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String },
    grade: { type: String },
    description: { type: String },
    subjects: [{ type: String }],
    duration: { type: String },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    fee: { type: Number },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
