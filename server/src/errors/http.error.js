/**
 * @file http.error.js
 * @module Errors/HttpError
 * @description Base custom error class for HTTP exceptions.
 * Extends the native JavaScript Error class to include HTTP status codes.
 * @author Sayan Chandra
 */

class HttpError extends Error {
    /**
     * @constructor
     * @param {string} message - The error message to be sent to the client.
     * @param {number} statusCode - The HTTP status code associated with the error.
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Flag to identify trusted, operational errors vs programming bugs
        Error.captureStackTrace(this, this.constructor);
    }
}

export default HttpError;