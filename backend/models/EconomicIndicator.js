import mongoose from 'mongoose';

const economicIndicatorSchema = new mongoose.Schema({
    metric: { type: String, required: true }, // e.g., "Repo Rate", "Inflation"
    value: { type: Number, required: true },
    unit: { type: String, required: true }, // e.g., "%", "Trillion"
    date: { type: Date, default: Date.now },
    source: { type: String, default: "RBI" }
});

export const EconomicIndicator = mongoose.model('EconomicIndicator', economicIndicatorSchema);
