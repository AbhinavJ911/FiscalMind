import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    year: { type: String, required: true, unique: true }, // e.g., "2024-2025"
    total_expenditure: { type: Number, required: true },
    total_receipts: { type: Number, required: true },
    fiscal_deficit: { type: Number, required: true }, // Percentage
    inflation_rate: { type: Number }, // CPI-based inflation %
    usd_inr_rate: { type: Number }, // Average USD/INR exchange rate
    gdp_growth: { type: Number }, // Real GDP growth %
    created_at: { type: Date, default: Date.now }
});

export const Budget = mongoose.model('Budget', budgetSchema);
