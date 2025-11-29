const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY || process.env.GEMINI_API_KEY);
    // Note: listModels might not be directly exposed on the client instance in this SDK version easily without using the model manager or similar, 
    // but let's try a simple generation with a known model like 'gemini-pro' and catch the error to see if it gives hints, 
    // OR just try to use the model directly.

    // Actually, the best way to debug "404 model not found" is to ensure we are using the right string.
    // Common strings: "gemini-pro", "gemini-1.0-pro", "gemini-1.5-flash", "gemini-1.5-pro".

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro", "gemini-1.5-pro-latest"];

    for (const modelName of modelsToTry) {
        console.log(`Trying model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`SUCCESS: ${modelName} works! Response: ${result.response.text()}`);
            return;
        } catch (error) {
            console.log(`FAILED: ${modelName} - ${error.message}`);
        }
    }
}

listModels();
