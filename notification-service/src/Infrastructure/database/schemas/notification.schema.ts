import { Schema } from 'mongoose';

export const NotificationSchema = new Schema({
  passed: {type: Boolean, required: true},
  applicationId: { type: String, required: true },
  position: { type: String, required: true },
  date: { type: Date },
  details: {
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    links: [{ type: String }],
    score: { type: Number, required: true },
  },
});
