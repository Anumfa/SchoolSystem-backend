import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const teacherSchema = new mongoose.Schema(
  {
    teacherId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subject: { type: String, required: true },
    qualification: { type: String },
    experience: { type: String },
    phone: { type: String },
    address: { type: String },
    cnic: { type: String },
    gender: { type: String, enum: ['Male', 'Female'] },
    dateOfJoining: { type: Date, default: Date.now },
    photo: { type: String, default: '' },
    classesAssigned: [{ type: String }],
    salary: { type: Number, default: 0 },
  },
  { timestamps: true }
);

teacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

teacherSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
