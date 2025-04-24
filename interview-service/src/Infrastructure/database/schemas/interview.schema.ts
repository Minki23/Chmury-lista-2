import { Schema } from 'mongoose';

export const InterviewSchema = new Schema({
  applicationId: { type: String, required: true },
  position: { type: String, required: true },
  date: { type: Date, required: true },
  employeeId: {type: String, required: true},
  details: {
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    links: [{ type: String }],
    score: { type: Number, required: true },
  },
});
