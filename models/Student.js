import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    cnic: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    className: { type: String, required: true }, // e.g. "Grade 6"
    section: { type: String, default: 'A' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    guardianName: { type: String },
    guardianPhone: { type: String },
    bloodGroup: { type: String },
    admissionDate: { type: Date, default: Date.now },
    photo: { type: String, default: '' },
    attendance: { type: Number, default: 0 },
    marks: [
      {
        subject: String,
        midterm: Number,
        final: Number,
        grade: String,
      },
    ],
  },
  { timestamps: true }
);

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);
export default Student;
