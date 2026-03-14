/**
 * @file env.config.js
 * @module Config/Environment
 * @description Centralized environment variable management.
 * This module loads environment-specific variables from respective .env files,
 * validates them and exports a structured, typed configuration object.
 * @author Sayan Chandra
 */
import { config } from "dotenv";
import path from "path";
import Logger from "../utils/Logger.js";

// Determine the environment and load the corresponding .env file
const currentEnv = process.env.NODE_ENV || "development";
config({ path: path.resolve(process.cwd(), `.env.${currentEnv}`) });

/**
 * @description Destructured environment variables directly from the process.
 * Loaded after the dotenv config initializes the specific .env file.
 */
const {
    NODE_ENV, PORT, API_V,
    MONGO_URI,
    JWT_SECRET, JWT_EXPIRY,
    GEMINI_API_KEY
} = process.env;

/**
 * @constant CORS_ORIGIN
 * @type {string[]}
 * @description Parsed list of allowed origins for Cross-Origin Resource Sharing.
 */
const CORS_ORIGIN = process.env.CORS_ORIGIN?.trim() ?
                    process.env.CORS_ORIGIN.split(",").map(origin => origin.trim()).filter(origin => origin !== "") :
                    ["http://localhost:3000"];
Logger.log(`Environment: ${NODE_ENV} | Port: ${PORT} | API: ${API_V}`);
Logger.log(`CORS Origin(s): ${CORS_ORIGIN}`);

// Fail fast if critical AI variables are missing
if(!GEMINI_API_KEY) {
    Logger.error("FATAL ERROR: GEMINI_API_KEY is not defined.");
    process.exit(1);
}

/**
 * @constant ENV_CONFIG
 * @description The application's unified configuration object.
 * Organizes raw environment variables into logical groups for use across the backend.
 */
export const ENV_CONFIG = {
    /** @property {Object} SERVER - Core server configurations */
    SERVER: {
        /** @property {string} SERVER.ENV - Current execution mode (development | production | test) */
        ENV: NODE_ENV || "development",
        /** @property {number} SERVER.PORT - The network port the Express server listens on */
        PORT: Number(PORT) || 3000,
        /** @property {string} SERVER.API_V - Base versioning path for all API routes */
        API_V: API_V || "/v1"
    },

    /** @property {Object} CORS - Cross-Origin Resource Sharing configurations */
    CORS: {
        /** @property {string[]} CORS.ORIGIN - Array of URLs allowed to interact with the API */
        ORIGIN: CORS_ORIGIN
    },

    /** @property {Object} DATABASE - MongoDB connection credentials */
    DATABASE: {
        /** @property {string} DATABASE.URI - The MongoDB connection string */
        URI: MONGO_URI || ""
    },

    /** @property {Object} JWT - JSON Web Token configurations for authentication */
    JWT: {
        /** @property {string} JWT.SECRET - Secret key used for signing and verifying JWTs */
        SECRET: JWT_SECRET || "",
        /** @property {string} JWT.EXPIRY - Lifespan of the generated JWTs (e.g., "7d", "1h", "24h") */
        EXPIRY: JWT_EXPIRY || "7d"
    },

    /** @property {Object} LLM - Large Language Model (LLM) API credentials */
    LLM: {
        /** @property {string} LLM.GEMINI_API_KEY - The API key for Google Gemini Generative AI */
        GEMINI_API_KEY: GEMINI_API_KEY || ""
    }
};