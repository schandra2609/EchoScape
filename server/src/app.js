/**
 * @file app.js
 * @module Core/Application
 * @description The main Express application entry point.
 * This file configures the middleware pipeline, security layers,
 * request parsing, and routing architecture for the ArvyaX Echo API.
 * @author Sayan Chandra
 */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./configs/swagger.config.js";
import { ENV_CONFIG } from "./configs/env.config.js";
import Logger from "./utils/Logger.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import HttpError from "./errors/http.error.js";
import rootRouter from "./routes/root.routes.js";

/**
 * @constant app
 * @type {import('express').Application}
 * @description The Express application instance.
 */
const app = express();

/**
 * @section Network Security
 * @description Configures proxy trust settings.
 * 'trust proxy' is essential when the app is behind a load balancer.
 */
if (ENV_CONFIG.SERVER.ENV === "production") {
    app.set("trust proxy", 1);
}

/**
 * @section Security Middlewares
 */

/**
 * @description Helmet helps secure Express apps by setting various HTTP headers.
 */
app.use(helmet());

/**
 * @description Cross-Origin Resource Sharing (CORS) configuration.
 * Strictly verifies origins against the allowed list in our environment variables.
 */
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or Postman) or explicitly whitelisted origins
            if (!origin || ENV_CONFIG.CORS.ORIGIN.includes(origin)) {
                callback(null, true);
            } else {
                Logger.warn(`[CORS] Rejected origin: ${origin}`);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

/**
 * @section Request Parsers
 */

/**
 * @description Built-in middleware to parse incoming requests with JSON payloads.
 * Limit is set to 16kb to protect against large-payload Denial of Service (DoS) attacks.
 */
app.use(express.json({ limit: '16kb' }));

/**
 * @description Built-in middleware to parse URL-encoded bodies.
 */
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

/**
 * @section Logging
 */

/**
 * @description HTTP request logger middleware integrated with our custom Logger class.
 * Skipped during automated tests to keep the terminal output clean.
 */
if (ENV_CONFIG.SERVER.ENV !== "test") {
    app.use(morgan("dev", { stream: Logger.getMorganStream() }));
}

/**
 * @section Base/Utility Routes
 */

/**
 * @description Basic Health Check Route to verify API uptime.
 */
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ArvyaX Echo API is active.",
        timestamp: new Date().toISOString()
    });
});

/**
 * @section API Documentation
 * @description Serves the Swagger UI interface for testing and exploring the API.
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @section API Routing
 * @description Mounts the root router. All core endpoints are prefixed with the version string.
 */
app.use(`/api${ENV_CONFIG.SERVER.API_V}`, rootRouter);

/**
 * @section Error Handling Layer
 */

/**
 * @description Catch-all for undefined routes.
 * Throws a 404 error that is picked up by the global error handler.
 */
app.use((req, res, next) => {
    const error = new HttpError(`Route ${req.originalUrl} not found`, 404);
    next(error);
});

/**
 * @description Catch-all global error handler.
 * Processes all errors passed via next(err) and returns standardized JSON responses.
 * MUST be the final middleware in the pipeline.
 */
app.use(globalErrorHandler);

export default app;