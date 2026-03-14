/**
 * @file error.middleware.js
 * @module Middlewares/ErrorHandler
 * @description Centralized global error handling middleware for Express.
 * intercepts Mongoose, JWT, and custom HTTP errors to format a standard JSON response.
 * @author Sayan Chandra
 */
import mongoose from "mongoose";
import Logger from "../utils/Logger.js";
import { ENV_CONFIG } from "../configs/env.config.js";
import HttpError from "../errors/http.error.js";
import {
    BadRequestError,
    ConflictError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
} from "../errors/handler.error.js";

/**
 * @function globalErrorHandler
 * @description Express error handling middleware. Must maintain the 4-parameter signature.
 * @param {Error} err - The error object passed through the next() function.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const globalErrorHandler = (err, req, res, next) => {
    let customError = err;

    // ==========================================
    // Specific Error Interceptors
    // ==========================================

    // 🔹 Mongoose: Invalid ObjectId (e.g., passing a bad ID in URL parameters)
    if (err instanceof mongoose.Error.CastError) {
        customError = new NotFoundError(`Resource not found. Invalid ID: ${err.value}`);
    }

    // 🔹 Mongoose: Duplicate Key (e.g., registering an email that already exists)
    else if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        customError = new ConflictError(`Duplicate field value entered for: ${field}`);
    }

    // 🔹 Mongoose: Validation Error (Schema requirements not met)
    else if (err instanceof mongoose.Error.ValidationError) {
        const message = Object.values(err.errors).map((val) => val.message).join(", ");
        customError = new BadRequestError(message);
    }

    // 🔹 JWT: Invalid JSON Web Token
    else if (err.name === "JsonWebTokenError") {
        customError = new UnauthorizedError("Invalid token. Please log in again.");
    }

    // 🔹 JWT: Expired JSON Web Token
    else if (err.name === "TokenExpiredError") {
        customError = new UnauthorizedError("Token has expired. Please log in again.");
    }

    // 🔹 Unknown / System Error (Bugs, syntax errors, or unhandled exceptions)
    else if (!(err instanceof HttpError)) {
        customError = new InternalServerError("An unexpected internal server error occurred.");
    }

    // ==========================================
    // Logging & Response
    // ==========================================

    const statusCode = customError.statusCode || 500;

    // Log the error server-side
    if (statusCode >= 500) {
        // For 500s (unexpected bugs), log the full original error stack
        Logger.error(`[${req.method}] ${req.originalUrl} - ${customError.message}`, err);
    } else {
        // For 400s (client errors), just log the warning
        Logger.warn(`[${req.method}] ${req.originalUrl} - ${customError.message}`);
    }

    // Construct the standardized JSON payload
    const errorResponse = {
        success: false,
        status: statusCode,
        message: customError.message,
        // Only leak the stack trace to the client if we are in development mode
        ...(ENV_CONFIG.SERVER.ENV === "development" && { stack: err.stack })
    };

    res.status(statusCode).json(errorResponse);
};

// ==========================================
// Process Level Error Catchers
// ==========================================

/**
 * @description Catches asynchronous errors that occur outside the Express request lifecycle.
 */
process.on("unhandledRejection", (reason, promise) => {
    Logger.error("UNHANDLED REJECTION! Shutting down gracefully...");
    Logger.error(reason.name || "Error", reason);
    process.exit(1);
});

/**
 * @description Catches synchronous exceptions that bubble all the way to the top.
 */
process.on("uncaughtException", (err) => {
    Logger.error("UNCAUGHT EXCEPTION! Shutting down gracefully...");
    Logger.error(err.name || "Error", err);
    process.exit(1);
});