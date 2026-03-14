/**
 * @file llm.service.js 
 * @module Services/LLM 
 * @description Handles communication with the Google Gemini Generative Language API.
 * @author Sayan Chandra
 */
import { GoogleGenAI } from "@google/genai";
import { ENV_CONFIG } from "../configs/env.config.js";
import Logger from "../utils/Logger.js";
import { getJournalAnalysisPrompt } from "../configs/prompts.config.js";
import { ServiceUnavailableError } from "../errors/handler.error.js";

// Initialize the official Gemini SDK
const AI = new GoogleGenAI({ apiKey: ENV_CONFIG.LLM.GEMINI_API_KEY });

/**
 * @async
 * @function analyzeJournalText
 * @description Sends the user's journal text to Gemini and retrieves a structured JSON analysis.
 * @param {string} rawJournalText - The raw journal entry text (renamed to avoid scope collision).
 * @returns {Promise<Object>} The parsed JSON object containing emotion, keywords, and summary.
 * @throws {ServiceUnavailableError} If the LLM API fails or times out.
 */
export const analyzeJournalText = async (rawJournalText) => {
    try {
        // 1. Pass the cleanly named parameter to the prompt generator
        const prompt = getJournalAnalysisPrompt(rawJournalText);

        // 2. Call the Gemini API
        const response = await AI.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        // 3. Extract the text property (no parentheses needed in the new SDK)
        const resultText = response.text;

        // 4. Parse and return the JSON
        return JSON.parse(resultText);
    } catch (error) {
        Logger.error("LLM Analysis Pipeline Failed", error);
        throw new ServiceUnavailableError("Failed to analyze journal entry. The AI service is currently unavailable.");
    }
};