import mongoose from 'mongoose';

export const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee'],
    required: true,
  },
  password: { type: String, required: true },
  nif: { type: Number },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  deactivateAt: { type: Date, default: null },
});
