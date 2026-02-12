import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Budget } from './models/Budget.js';
import { Sector } from './models/Sector.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fiscalmind')
    .then(() => {
        console.log('MongoDB connected for seeding');
        seedData();
    })
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        // Read sample data
        const dataPath = path.join(process.cwd(), '../data-pipeline/budget_data_2004_2024.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const budgetData = JSON.parse(rawData);

        // Clear existing data and indexes
        try {
            await Budget.collection.drop();
        } catch (e) { console.log('Budget collection not found, skipping drop'); }

        try {
            await Sector.collection.drop();
        } catch (e) { console.log('Sector collection not found, skipping drop'); }

        for (const data of budgetData) {
            // Create Budget Document
            const budget = new Budget({
                year: data.year,
                total_expenditure: data.total_expenditure,
                total_receipts: data.total_receipts,
                fiscal_deficit: data.fiscal_deficit,
                inflation_rate: data.inflation_rate,
                usd_inr_rate: data.usd_inr_rate,
                gdp_growth: data.gdp_growth
            });
            await budget.save();
            console.log(`Saved Budget for ${data.year}`);

            // Create Sector Documents
            for (const sector of data.sectors) {
                const sectorDoc = new Sector({
                    name: sector.name,
                    budget_year: data.year,
                    allocation: sector.allocation,
                    description: sector.description,
                    schemes: sector.schemes,
                    policies: sector.policies,
                    sourceUrl: sector.sourceUrl
                });
                await sectorDoc.save();
            }
            console.log(`Saved ${data.sectors.length} sectors for ${data.year}`);
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};
