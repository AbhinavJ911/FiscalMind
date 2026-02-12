import express from 'express';
import { Sector } from '../models/Sector.js';

const router = express.Router();

// Get all sectors summary (optional filter by year)
router.get('/', async (req, res) => {
    try {
        const { year } = req.query;
        const filter = year ? { budget_year: year } : {};
        const sectors = await Sector.find(filter);
        res.json(sectors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific sector by name/id
router.get('/:id', async (req, res) => {
    try {
        const sector = await Sector.findById(req.params.id);
        if (!sector) return res.status(404).json({ message: 'Sector not found' });
        res.json(sector);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
