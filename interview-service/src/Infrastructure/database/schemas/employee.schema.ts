import { Schema } from 'mongoose';

export const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  proficientTechnologies: { type: [String], required: true },
});
