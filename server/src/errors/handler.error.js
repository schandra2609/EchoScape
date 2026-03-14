/**
 * @file handler.error.js
 * @module Errors/Handlers
 * @description Specific HTTP error classes extending the base HttpError.
 * Provides ready-to-use exception classes for standard HTTP error responses.
 * @author Sayan Chandra
 */
import HttpError from "./http.error.js";

class BadRequestError extends HttpError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

class ForbiddenError extends HttpError {
    constructor(message = "Access Denied") {
        super(message, 403);
    }
}

class NotFoundError extends HttpError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}

class ConflictError extends HttpError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}

class UnprocessableEntityError extends HttpError {
    constructor(message = "Unprocessable Entity - Validation Failed") {
        super(message, 422);
    }
}

class TooManyRequestsError extends HttpError {
    constructor(message = "Too Many Requests") {
        super(message, 429);
    }
}

class InternalServerError extends HttpError {
    constructor(message = "Internal Server Error") {
        super(message, 500);
    }
}

class ServiceUnavailableError extends HttpError {
    constructor(message = "Service Unavailable") {
        super(message, 503);
    }
}

export {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    UnprocessableEntityError,
    TooManyRequestsError,
    InternalServerError,
    ServiceUnavailableError
};