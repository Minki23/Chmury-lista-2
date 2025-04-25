import { Schema } from 'mongoose';

export const InterviewSchema = new Schema({
  applicationId: { type: String, required: true },
  passed: { type: Boolean, required: true },
  position: { type: String, required: true },
  date: { type: Date},
  employeePhone: {type: String},
  details: {
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    links: [{ type: String }],
    score: { type: Number, required: true },
  },
});
