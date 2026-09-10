import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Campus', 'Events', 'Sports', 'Classrooms', 'Other'],
      default: 'Campus',
    },
    // Relative path (e.g. /gallery/campus-building.svg) or absolute image URL
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
