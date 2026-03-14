/**
 * @file journal.service.js
 * @module Services/Journal
 * @description Handles core business logic and database interactions for journal entries.
 * Integrates with the LLM service to analyze text before saving to MongoDB.
 * @author Sayan Chandra
 */
import Journal from "../models/journal.model.js";
import { analyzeJournalText } from "./llm.service.js";
import { NotFoundError } from "../errors/handler.error.js";
import Logger from "../utils/Logger.js";

/**
 * @async
 * @function createJournalEntry
 * @description Processes a new journal entry through the LLM and saves it to the database.
 * @param {string} userId - The ID of the user creating the entry.
 * @param {string} ambience - The immersive environment (forest, ocean, mountain).
 * @param {string} text - The raw text written by the user.
 * @returns {Promise<Object>} The saved database document.
 */
export const createJournalEntry = async (userId, ambience, text) => {
    // 1. Send the text to Gemini for emotional analysis
    Logger.info(`Initiating LLM analysis for user: ${userId}`);
    const analysis = await analyzeJournalText(text);

    // 2. Construct and save the new database document
    const newEntry = new Journal({ userId, ambience, text, analysis });

    await newEntry.save();
    Logger.info(`Successfully saved journal entry for user: ${userId}`);

    return newEntry;
};

/**
 * @async
 * @function getUserEntries
 * @description Retrieves all journal entries for a specific user, sorted by newest first.
 * @param {string} userId - The target user's ID.
 * @returns {Promise<Array>} Array of journal documents.
 */
export const getUserEntries = async (userId) => {
    return await Journal.find({ userId }).sort({ createdAt: -1 });
};

/**
 * @async
 * @function getUserInsights
 * @description Calculates psychological and behavioral insights for a user using MongoDB aggregations.
 * @param {string} userId - The target user's ID.
 * @returns {Promise<Object>} The aggregated insights payload.
 * @throws {NotFoundError} If the user has no entries to analyze.
 */
export const getUserInsights = async (userId) => {
    // We run these queries in parallel using Promise.all for maximum performance
    const [totalEntries, emotionAgg, ambienceAgg, recentEntries] = await Promise.all([
        // Query 1: Total count
        Journal.countDocuments({ userId }),

        // Query 2: Top Emotion (Group by emotion, sort by count descending, take top 1)
        Journal.aggregate([
            { $match: { userId } },
            { $group: { _id: "$analysis.emotion", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]),

        // Query 3: Most Used Ambience (Group by ambience, sort by count descending, take top 1)
        Journal.aggregate([
            { $match: { userId } },
            { $group: { _id: "$ambience", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]),

        // Query 4: Fetch the 5 most recent entries to extract recent keywords
        Journal.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("analysis.keywords")
    ]);

    // If totalEntries is 0, we can't generate insights
    if (totalEntries === 0) {
        throw new NotFoundError("No journal entries found for this user. Cannot generate insights.");
    }

    // Extract recent keywords, flatten the arrays, and remove duplicates using a Set
    const keywordsSet = new Set();
    recentEntries.forEach(entry => {
        if (entry.analysis && entry.analysis.keywords) {
            entry.analysis.keywords.forEach(kw => keywordsSet.add(kw));
        }
    });

    // Format the final response to exactly match the assignment's expected schema
    return {
        totalEntries,
        topEmotion: emotionAgg.length > 0 ? emotionAgg[0]._id : null,
        mostUsedAmbience: ambienceAgg.length > 0 ? ambienceAgg[0]._id : null,
        recentKeywords: Array.from(keywordsSet).slice(0, 10) // Limit to 10 unique recent keywords
    };
};