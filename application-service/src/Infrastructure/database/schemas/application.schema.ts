import { Schema } from 'mongoose';

export const ApplicationSchema = new Schema({
  id: String,
  resume: {
    text: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});