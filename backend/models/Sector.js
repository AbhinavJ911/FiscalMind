import mongoose from 'mongoose';

const sectorSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Agriculture"
    budget_year: { type: String, required: true }, // e.g., "2024-2025"
    allocation: { type: Number, required: true }, // In Crores
    description: { type: String },
    schemes: [{
        name: { type: String },
        allocation: { type: Number }
    }],
    policies: [{ type: String }],
    sourceUrl: { type: String }, // URL to official budget document
    created_at: { type: Date, default: Date.now }
});

export const Sector = mongoose.model('Sector', sectorSchema);
