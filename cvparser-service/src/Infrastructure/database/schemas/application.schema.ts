import { Schema } from 'mongoose';

export const ApplicationSchema = new Schema({
  id: String,
  position: String,
  resume: {
    name: String,
    phoneNumber: String,
    links: [String],
    email: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    technologies: [String]
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