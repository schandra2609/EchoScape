/**
 * @file journal.routes.js
 * @module Routes/Journal
 * @description Express router for all journal-related endpoints.
 * Maps specific HTTP methods and paths to their respective controller functions.
 * @author Sayan Chandra
 */
import { Router } from "express";
import { analyzeText, createEntry, getEntries, getInsights } from "../controllers/journal.controller.js";

const router = Router();

// ==========================================
// Static Routes
// ==========================================

/**
 * @route POST /api/v1/journal/analyze
 * @description Standalone LLM analysis endpoint
 */
router.post("/analyze", analyzeText);

// ==========================================
// Dynamic Routes (Containing URL parameters)
// ==========================================

/**
 * @route GET /api/v1/journal/insights/:userId
 * @description Aggregated insights for a specific user
 */
router.get("/insights/:userId", getInsights);

/**
 * @route POST /api/v1/journal
 * @description Save a new journal entry and trigger analysis
 */
router.post("/", createEntry);

/**
 * @route GET /api/v1/journal/:userId
 * @description Get all past journal entries for a specific user
 */
router.get("/:userId", getEntries);


export default router;