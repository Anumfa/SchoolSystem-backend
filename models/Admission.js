import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female'] },
    classApplyingFor: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    previousSchool: { type: String },
    lastMarks: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'interview'], default: 'pending' },
    remarks: { type: String },
  },
  { timestamps: true }
);

const Admission = mongoose.model('Admission', admissionSchema);
export default Admission;
