import { Schema } from 'mongoose';

export const PositionsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    keyTechnologies: {
        type: [String],
    },
    usefulTechnologies: {
        type: [String],
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