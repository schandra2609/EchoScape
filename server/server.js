/**
 * @file server.js
 * @module Core/Bootstrapper
 * @description The hardware-level entry point of the application.
 * This script is responsible for:
 * 1. Initializing infrastructure connections (MongoDB).
 * 2. Starting the HTTP listener.
 * 3. Managing process lifecycle and graceful shutdowns.
 * @author Sayan Chandra
 */
import app from "./src/app.js";
import mongoose from "mongoose";
import { ENV_CONFIG } from "./src/configs/env.config.js";
import { connectDatabase } from "./src/configs/database.config.js";
import Logger from "./src/utils/Logger.js";

/**
 * @async
 * @function startServer
 * @description Orchestrates the startup sequence of the backend.
 * Sequence:
 * 1. Establish MongoDB connection via Mongoose.
 * 2. Bind the Express app to the configured network port.
 * @returns {Promise<void>}
 */
const startServer = async () => {
    try {
        // Step 1: Connect to Database
        await connectDatabase();

        // Step 2: Start Listening
        app.listen(ENV_CONFIG.SERVER.PORT, "0.0.0.0", () => {
            Logger.log(`>>> Server running in ${ENV_CONFIG.SERVER.ENV} mode on port ${ENV_CONFIG.SERVER.PORT} `);
            Logger.log(`API routing mapped to /api${ENV_CONFIG.SERVER.API_V}`);
        });

    } catch (error) {
        // Clean up on failure
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        Logger.error("Shutting down server due to startup failure.");
        Logger.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
};

/**
 * @section Process Event Listeners
 * @description Global handlers for process-level events to ensure
 * data integrity and clean resource release.
 */

/**
 * @event unhandledRejection
 * @description Handles Promise rejections that aren't caught in local try-catch blocks.
 */
process.on("unhandledRejection", async (error) => {
    if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
    Logger.error("Critical: Unhandled Promise Rejection.");
    Logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});

/**
 * @event uncaughtException
 * @description Handles synchronous errors that bubble up to the process level.
 */
process.on("uncaughtException", async (error) => {
    if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
    Logger.error("Critical: Uncaught Exception.");
    Logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});

/**
 * @event SIGINT
 * @description Triggered by (Ctrl+C). Ensures Mongoose disconnects gracefully.
 */
process.on("SIGINT", async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
    Logger.log("\nSIGINT received: MongoDB Client disconnected. Shutting down.");
    process.exit(0);
});

/**
 * @event SIGTERM
 * @description Triggered by process managers (like PM2 or Docker). Ensures clean shutdown.
 */
process.on("SIGTERM", async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
    Logger.log("\nSIGTERM received: MongoDB Client disconnected. Shutting down.");
    process.exit(0);
});

// Execute the bootstrap sequence
await startServer();