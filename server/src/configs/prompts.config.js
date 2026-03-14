/**
 * @file prompts.config.js
 * @module Config/Prompts
 * @description Centralized storage for LLM system prompts.
 * @author Sayan Chandra
 */

/**
 * @function getJournalAnalysisPrompt
 * @description Generates the strict prompt required to enforce a specific JSON schema from the LLM.
 * @param {string} journalText - The raw text submitted by the user.
 * @returns {string} The fully constructed prompt.
 */
export const getJournalAnalysisPrompt = (journalText) => {
    return `
You are an expert psychological text analyzer.
Analyze the following journal entry written by a user after an immersive nature session.

Your task is to identify the primary emotion, extract key themes as keywords, and provide a concise summary of the user's experience.

You must respond strictly in valid JSON format. Do not include any conversational text or markdown.

Required JSON schema:
{
  "emotion": "string (a single lowercase word describing the primary emotion)",
  "keywords": ["string", "string", "string"],
  "summary": "string (one concise sentence)"
}

Journal Entry to analyze:
"${journalText}"
    `.trim();
};