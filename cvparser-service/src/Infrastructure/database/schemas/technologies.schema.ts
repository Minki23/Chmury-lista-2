import { Schema } from 'mongoose';

export const TechnologiesSchema = new Schema({
    technologies: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});