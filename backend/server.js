
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- DATA PROCESSING LOGIC (Ported from Frontend) --- //
const farmDefinitions = {
    'Chattisgarh': { name: 'Verma Agri-Group, Raipur', mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7580695.815999384!2d78.53761369531248!3d21.2786566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28c2138c213e4b%3A0x952a1b6db421a1f!2sChhattisgarh!5e0!3m2!1sen!2sin!4v1716908616339!5m2!1sen!2sin' },
    'Miryalaguda': { name: 'Reddy Organic Farms, Nalgonda', mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61314.99009893992!2d79.542918833907!3d16.876115900000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb036443567793%3A0x6515942416e75551!2sMiryalaguda%2C%20Telangana!5e0!3m2!1sen!2sin!4v1716908681571!5m2!1sen!2sin' },
    'Kakinada': { name: 'Coastal Paddy Fields, East Godavari', mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122217.33446864115!2d82.17937748498595!3d16.9715993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3827ddaf732f83%3A0x4cb1995c52251817!2sKakinada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1716908713451!5m2!1sen!2sin' },
    'Warangal': { name: 'Kakatiya Growers Co-op, Warangal', mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243646.2384112185!2d79.46213038662998!3d17.975494800000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a334f3d17631d1b%3A0x9f58169a97a3b839!2sWarangal%2C%20Telangana!5e0!3m2!1sen!2sin!4v1716908743125!5m2!1sen!2sin' },
};
const plantDefinitions = {
    'Chattisgarh': { facility: 'MKRM Plant #1' },
    'Miryalaguda': { facility: 'MKRM Plant #2' },
    'Kakinada': { facility: 'MKRM Plant #3' },
    'Warangal': { facility: 'MKRM Plant #4' },
};
const riceTypeDefinitions = {
    'SonaMasoori': { name: 'Sona Masoori Rice', grade: 'Premium Quality' },
    'Broken Rice': { name: 'Broken White Rice', grade: 'Standard Grade' },
    'JaiSriRam': { name: 'Jai Sri Ram Premium Rice', grade: 'Superior Grade' },
    'Basmathi': { name: 'Extra-Long Grain Basmati', grade: 'USDA Grade A' },
};
const certificationDefinitions = [
    '100% Organic, FSSAI License #123-456-7890',
    'Fair Trade Certified, ISO 9001:2015',
    'Non-GMO Project Verified, FSSAI #987-654-3210',
    'Gluten-Free Certified, ISO 22000',
];

const getRandom = (min, max, decimals = 1) => (Math.random() * (max - min) + min).toFixed(decimals);

const generateTraceabilityRecord = (batchId) => {
    const parts = batchId.match(/MKRM-([a-zA-Z\s]+)(\d+)-(\d{4})-([a-zA-Z]+)(\d+)/);
    if (!parts) return null;

    const [, riceKey, , year, locationKey] = parts;

    const riceInfo = riceTypeDefinitions[riceKey.replace(/\s/g, '')] || riceTypeDefinitions[riceKey] || { name: 'Standard Rice', grade: 'Standard' };
    const farmInfo = farmDefinitions[locationKey] || { name: 'Unknown Farm', mapEmbedUrl: '' };
    const plantInfo = plantDefinitions[locationKey] || { facility: 'MKRM Plant #0' };

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const formatDate = (date) => `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    const randomDayOfYear = parseInt(getRandom(60, 300, 0));
    const millingDate = new Date(year, 0, randomDayOfYear);

    const harvestDate = new Date(millingDate);
    harvestDate.setDate(harvestDate.getDate() - parseInt(getRandom(20, 45, 0)));

    const departureDate = new Date(millingDate);
    departureDate.setDate(departureDate.getDate() + 1);

    const arrivalDate = new Date(departureDate);
    arrivalDate.setDate(arrivalDate.getDate() + parseInt(getRandom(2, 4, 0)));

    const packagingDate = new Date(arrivalDate);
    packagingDate.setDate(packagingDate.getDate() + 1);

    return {
        batchId: batchId,
        productName: riceInfo.name,
        farm: {
            name: farmInfo.name,
            mapEmbedUrl: farmInfo.mapEmbedUrl,
            harvestDate: formatDate(harvestDate),
        },
        milling: {
            date: formatDate(millingDate),
            facility: `${plantInfo.facility} (${locationKey})`,
        },
        logistics: {
            mode: 'GPS-tracked, Temperature-controlled truck',
            departure: formatDate(departureDate),
            arrival: formatDate(arrivalDate),
        },
        packagingAndStorage: {
            packagingDate: formatDate(packagingDate),
            material: '5-ply BOPP woven bag, Nitrogen flushed',
            warehouse: `MKRM Central Warehouse, ${locationKey}`,
            conditions: 'Temp: < 18°C, Humidity: < 60%',
        },
        quality: {
            moisture: `${getRandom(12.5, 14.0)}%`,
            brokenGrains: `${getRandom(0.5, 4.5)}%`,
            purity: `${getRandom(99.5, 99.9)}%`,
            avgGrainLength: riceKey === 'Basmathi' ? `${getRandom(7.0, 8.4)}mm` : 'N/A',
            grade: riceInfo.grade,
            testedBy: 'MKRM Central Quality Lab',
        },
        certifications: certificationDefinitions[millingDate.getDate() % certificationDefinitions.length],
    };
};

// Load CSV Data
let traceabilityData = {};
const loadCsvData = () => {
    try {
        const csvPath = path.join(__dirname, 'data.csv');
        const csvText = fs.readFileSync(csvPath, 'utf-8');
        let cleanText = csvText;
        if (cleanText.charCodeAt(0) === 0xFEFF) {
            cleanText = cleanText.substring(1);
        }
        const batchIdList = cleanText.split('\n').filter(id => id.trim() !== '' && !id.startsWith('http'));
        batchIdList.forEach(id => {
            const record = generateTraceabilityRecord(id.trim());
            if (record) traceabilityData[id.trim()] = record;
        });
        console.log(`Loaded ${Object.keys(traceabilityData).length} traceability records.`);
    } catch (error) {
        console.error("Error loading CSV data:", error);
    }
};

loadCsvData();

// --- API ENDPOINTS --- //

// 1. Traceability Endpoint
app.get('/api/trace/:batchId', (req, res) => {
    const { batchId } = req.params;
    const record = traceabilityData[batchId.trim()];
    if (record) {
        res.json(record);
    } else {
        res.status(404).json({ error: 'Batch ID not found' });
    }
});

// 2. Price Estimator Endpoint
app.post('/api/estimate', async (req, res) => {
    const { riceType, quantity, region, season } = req.body;

    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API Key not configured' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Estimate the wholesale price for ${quantity} quintals of "${riceType}" rice from the ${region} region of India during the ${season} season. Provide the total estimated price in INR, the price per quintal in INR, and a brief justification for the price based on factors like rice type, grade, region, season, and market trends. Return the response as a JSON object with keys: estimatedPriceINR (number), pricePerQuintal (number), reason (string).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown if present
        if (text.startsWith('```json')) {
            text = text.substring(7, text.length - 3).trim();
        } else if (text.startsWith('```')) {
            text = text.substring(3, text.length - 3).trim();
        }

        const data = JSON.parse(text);
        res.json(data);
    } catch (error) {
        console.error("Gemini API Error (Falling back to mock):", error);
        // Fallback Mock Response
        const mockPrice = quantity * 5500; // Approx 5500 per quintal
        res.json({
            estimatedPriceINR: mockPrice,
            pricePerQuintal: 5500,
            reason: "AI Service Unavailable. This is a simulated estimate based on historical averages for the region."
        });
    }
});

// 3. Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
    const { messages, systemPrompt } = req.body;

    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API Key not configured' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Transform messages for Gemini (GoogleGenerativeAI expects 'user' and 'model' roles)
        const history = messages.slice(0, -1).map(msg => ({
            role: msg.role === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const lastMessage = messages[messages.length - 1].text;

        // Inject Traceability Data into System Prompt
        const traceabilityContext = Object.values(traceabilityData).slice(0, 5).map(t => `- Batch ID ${t.batchId} for ${t.productName} was harvested on ${t.farm.harvestDate} from ${t.farm.name}.`).join('\n');
        const fullSystemPrompt = `${systemPrompt}\n\nSample Traceability Data (Backend Injected):\n${traceabilityContext}`;

        // Start chat with history
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `System Instruction: ${fullSystemPrompt}` }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to assist as the MKRM AI Assistant." }],
                },
                ...history
            ],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text, sources: [] }); // Sources not directly supported in basic text-only model response easily without grounding tool setup, keeping it simple for now.

    } catch (error) {
        console.error("Chatbot API Error (Falling back to mock):", error);
        // Fallback Mock Response
        res.json({
            text: "I apologize, but I am currently unable to connect to the AI service. However, I can tell you that MKRM Rice offers premium Sona Masoori, Basmati, and other varieties. Please check the Shop page for current prices.",
            sources: []
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
