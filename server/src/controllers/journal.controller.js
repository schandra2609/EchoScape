/**
 * @file journal.controller.js
 * @module Controllers/Journal
 * @description Handles incoming HTTP requests for journal operations.
 * Extracts parameters and delegates business logic to the appropriate services.
 * @author Sayan Chandra
 */
import { UnprocessableEntityError } from "../errors/handler.error.js";
import { createJournalEntry, getUserEntries, getUserInsights } from "../service/journal.service.js";
import { analyzeJournalText } from "../service/llm.service.js";

/**
 * @async
 * @function createEntry
 * @description Handles POST /api/v1/journal requests. Creates a new journal entry.
 */
export const createEntry = async (req, res, next) => {
    try {
        const { userId, ambience, text } = req.body;

        // Basic validation before hitting the database
        if ([userId, ambience, text].some(str => !str || str.trim() === "")) {
            throw new UnprocessableEntityError("Missing required fields: userId, ambience, and text are mandatory.");
        }

        const newEntry = await createJournalEntry(userId, ambience, text);

        res.status(201).json({
            success: true,
            data: newEntry,
            message: "Journal created"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @async
 * @function getEntries
 * @description Handles GET /api/v1/journal/:userId requests. Returns all entries for a user.
 */
export const getEntries = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if(!userId) {
            throw new UnprocessableEntityError("User ID parameter is missing.");
        }

        const entries = await getUserEntries(userId);

        res.status(200).json({
            success: true,
            data: entries,
            message: "Fetched all journals"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @async
 * @function analyzeText
 * @description Handles POST /api/v1/journal/analyze requests. 
 * Standalone endpoint to test LLM integration without saving to the database.
 */
export const analyzeText = async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text?.trim()) {
            throw new UnprocessableEntityError("Text payload is required for analysis.");
        }

        const analysis = await analyzeJournalText(text);

        res.status(200).json({
            success: true,
            data: analysis,
            message: "Journal text analyzed"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @async
 * @function getInsights
 * @description Handles GET /api/v1/journal/insights/:userId requests.
 * Returns aggregated mental state data.
 */
export const getInsights = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId?.trim()) {
            throw new UnprocessableEntityError("User ID parameter is missing.");
        }

        const insights = await getUserInsights(userId);

        res.status(200).json({
            success: true,
            data: insights,
            message: "User insights fetched"
        });
    } catch (error) {
        next(error);
    }
};