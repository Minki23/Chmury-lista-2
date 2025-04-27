import { Schema } from 'mongoose';

export const ApplicationSchema = new Schema({
  id: String,
  passed: Boolean,
  position: String,
  resume: { 
    phoneNumber: String,
    email: String,
    name: String,
    score: Number,
    links: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  requiredTchnologies:{
    type: [String]
  }
});