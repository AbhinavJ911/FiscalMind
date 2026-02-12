import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sector } from '../models/Sector.js';
import { Budget } from '../models/Budget.js';

const router = express.Router();

// New Gemini API Key
const GEMINI_API_KEY = "AIzaSyB2HZeZuyRWWIoU8-pExSe1YOiu7CNZnAQ";

router.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        // Build context from database
        const keywords = message.toLowerCase().split(' ');
        const yearMatch = message.match(/(\d{4}[-\/]\d{4}|\d{4})/);
        const targetYear = yearMatch ? yearMatch[0] : "2024-2025";

        const sectors = await Sector.find({}, 'name description allocation schemes policies budget_year');
        const relevantSectors = sectors.filter(s =>
            keywords.some(k => s.name.toLowerCase().includes(k))
        );

        let budget = await Budget.findOne({ year: targetYear });
        if (!budget) {
            budget = await Budget.findOne().sort({ year: -1 });
        }

        // Build AI context
        let context = `You are an expert financial analyst specializing in the Indian Union Budget. Provide detailed, helpful responses using the verified data below.

BUDGET DATA (${targetYear}):
`;

        if (budget) {
            context += `Total Expenditure: ₹${budget.total_expenditure} Cr
Total Receipts: ₹${budget.total_receipts} Cr
Fiscal Deficit: ₹${budget.fiscal_deficit} Cr
GDP Growth: ${budget.gdp_growth}%
Inflation: ${budget.inflation_rate}%
`;
        }

        if (relevantSectors.length > 0) {
            context += `\nRELEVANT SECTORS:\n`;
            relevantSectors.slice(0, 3).forEach(s => {
                context += `${s.name}: ₹${s.allocation} Cr - ${s.description}\n`;
                if (s.schemes && s.schemes.length > 0) {
                    s.schemes.slice(0, 2).forEach(sch => {
                        if (typeof sch === 'object' && sch.name) {
                            context += `  • ${sch.name}: ₹${sch.allocation || 'N/A'} Cr\n`;
                        }
                    });
                }
            });
        }

        // Call Gemini AI
        console.log('Calling Gemini AI with new key...');
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(`${context}\n\nUSER: ${message}\n\nProvide a helpful, detailed response using the data above.`);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini AI responded successfully');
        res.json({ response: text });

    } catch (error) {
        console.error('❌ Gemini Error:', error.message);

        // Provide helpful fallback
        res.status(500).json({
            response: `I encountered an error: ${error.message}\n\nPlease try asking about specific topics like:\n- Budget overview\n- Sector allocations (Defense, Agriculture, Education)\n- Economic concepts (Inflation, GDP, Fiscal Deficit)`,
            error: error.message
        });
    }
});

export default router;
