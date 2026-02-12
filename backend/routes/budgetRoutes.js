import express from 'express';
import { Budget } from '../models/Budget.js';
import { Sector } from '../models/Sector.js';

const router = express.Router();

// Get all budget years summary
router.get('/', async (req, res) => {
    try {
        const budgets = await Budget.find().lean();

        // Fetch sectors for each budget
        const budgetsWithSectors = await Promise.all(budgets.map(async (budget) => {
            const sectors = await Sector.find({ budget_year: budget.year });
            return { ...budget, sectors };
        }));

        res.json(budgetsWithSectors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific budget year
router.get('/:year', async (req, res) => {
    try {
        const budget = await Budget.findOne({ year: req.params.year }).lean();
        if (!budget) return res.status(404).json({ message: 'Budget not found' });

        const sectors = await Sector.find({ budget_year: req.params.year });

        res.json({ ...budget, sectors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
