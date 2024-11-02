import mongoose from 'mongoose';

const containerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['running', 'stopped', 'error'], required: true },
  url: { type: String },
  port: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export const Container = mongoose.model('Container', containerSchema);
