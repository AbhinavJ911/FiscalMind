import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const budgetSchema = new mongoose.Schema({
    year: { type: String, required: true, unique: true },
    total_expenditure: { type: Number, required: true },
    total_receipts: { type: Number, required: true },
    fiscal_deficit: { type: Number, required: true },
    inflation_rate: { type: Number },
    usd_inr_rate: { type: Number },
    gdp_growth: { type: Number },
    created_at: { type: Date, default: Date.now }
});

const Budget = mongoose.model('Budget', budgetSchema);

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        const latestBudget = await Budget.findOne({ year: '2024-2025' });

        console.log('=== 2024-2025 Budget Data ===');
        console.log('Year:', latestBudget.year);
        console.log('Total Expenditure:', latestBudget.total_expenditure);
        console.log('Total Receipts:', latestBudget.total_receipts);
        console.log('Fiscal Deficit:', latestBudget.fiscal_deficit);
        console.log('Inflation Rate:', latestBudget.inflation_rate);
        console.log('USD/INR Rate:', latestBudget.usd_inr_rate);
        console.log('GDP Growth:', latestBudget.gdp_growth);
        console.log('\nHas economic indicators:', !!(latestBudget.inflation_rate && latestBudget.usd_inr_rate && latestBudget.gdp_growth));

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkData();
