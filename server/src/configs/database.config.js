/**
 * @file database.config.js
 * @module Config/Database
 * @description Handles the connection logic to the MongoDB database using Mongoose.
 * Includes connection event listeners for monitoring database health.
 * @author Sayan Chandra
 */
import mongoose from 'mongoose';
import { ENV_CONFIG } from './env.config.js';
import Logger from '../utils/Logger.js';

/**
 * @async
 * @function connectDatabase
 * @description Establishes a connection to the MongoDB cluster.
 * Exits the process if the initial connection fails to prevent app malfunction.
 * @returns {Promise<void>}
 */
export const connectDatabase = async () => {
    try {
        if (!ENV_CONFIG.DATABASE.URI) {
            throw new Error("Database URI is not found in the environment variables.");
        }

        // Mongoose connection options
        const connectionOptions = {
            autoIndex: ENV_CONFIG.SERVER.ENV === 'development', // Build indexes automatically only in dev
            maxPoolSize: 10, // Maintain up to 10 socket connections
        };

        // Connect mongoose to the database
        await mongoose.connect(ENV_CONFIG.DATABASE.URI, connectionOptions);
        Logger.info(`Successfully connected to MongoDB cluster.`);

    } catch (error) {
        Logger.error(`Failed to connect to MongoDB: ${error.message}`, error);
        // Fail fast: Kill the server if the database won't connect
        process.exit(1);
    }
};

// ==========================================
// Database Event Listeners
// ==========================================

/**
 * @listens mongoose.Connection#disconnected
 * @description Triggered when the Mongoose connection to the MongoDB server is lost.
 * Logs a warning to the console. Mongoose will attempt to reconnect automatically.
 */
mongoose.connection.on('disconnected', () => {
    Logger.warn('MongoDB connection lost. Attempting to reconnect...');
});

/**
 * @listens mongoose.Connection#reconnected
 * @description Triggered when Mongoose successfully re-establishes a lost connection.
 * Logs an informational message to the console.
 */
mongoose.connection.on('reconnected', () => {
    Logger.info('MongoDB connection re-established.');
});

/**
 * @listens process#SIGINT
 * @async
 * @description Catches the application termination signal (e.g., Ctrl+C in the terminal).
 * Ensures the database connection is gracefully closed before the Node.js process exits,
 * preventing memory leaks or corrupted operations.
 */
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    Logger.log('MongoDB connection closed due to application termination.');
    process.exit(0);
});