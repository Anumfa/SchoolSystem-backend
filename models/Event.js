import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    venue: { type: String },
    category: { type: String, enum: ['Sports', 'Academics', 'Cultural', 'Annual', 'Religious', 'Other'], default: 'Other' },
    image: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['upcoming', 'completed', 'ongoing'], default: 'upcoming' },
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
