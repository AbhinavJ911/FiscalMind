import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        console.log("Checking models via fetch...");
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            console.error("No API Key found");
            return;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        let output = "";
        if (data.models) {
            output += "Available Models:\n";
            data.models.forEach(m => output += `- ${m.name} (${m.displayName})\n`);
        } else {
            output += "No models found or error: " + JSON.stringify(data);
        }

        fs.writeFileSync('models_list.txt', output, 'utf8');
        console.log("Written to models_list.txt");

    } catch (error) {
        console.error('Error listing models:', error);
        fs.writeFileSync('models_list.txt', 'Error: ' + error.message, 'utf8');
    }
}

listModels();
