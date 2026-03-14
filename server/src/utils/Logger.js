/**
 * @file Logger.js
 * @module Utils/Logger
 * @description Custom logging utility integrated with Morgan for Express.
 * @author Sayan Chandra
 */

class Logger {
    /**
     * @private
     * @description Generates a standardized UTC timestamp.
     * @returns {string} Current timestamp in ISO format
     */
    static #getTimeStamp() {
        return new Date().toISOString();
    }

    /**
     * @method info
     * @description Logs general informational messages (Cyan)
     * @param {string} message - The message to log
     */
    static info(message) {
        console.log(`\x1b[36m[INFO] ${this.#getTimeStamp()} - ${message}\x1b[0m`);
    }

    /**
     * @method log
     * @description Standard log output (Green)
     * @param {string} message - The message to log
     */
    static log(message) {
        console.log(`\x1b[32m[LOG] ${this.#getTimeStamp()} - ${message}\x1b[0m`);
    }

    /**
     * @method warn
     * @description Logs warning messages (Yellow)
     * @param {string} message - The message to log
     */
    static warn(message) {
        console.warn(`\x1b[33m[WARN] ${this.#getTimeStamp()} - ${message}\x1b[0m`);
    }

    /**
     * @method error
     * @description Logs error messages (Red)
     * @param {string} message - The error message to log
     * @param {Error} [error] - Optional error object for stack trace
     */
    static error(message, error = null) {
        console.error(`\x1b[31m[ERROR] ${this.#getTimeStamp()} - ${message}\x1b[0m`);
        if (error && error.stack) {
            console.error(`\x1b[31m${error.stack}\x1b[0m`);
        }
    }

    /**
     * @method getMorganStream
     * @description Creates a writable stream for Morgan to pipe HTTP logs into the custom logger.
     * @returns {object} Writable stream object
     */
    static getMorganStream() {
        return {
            write: (message) => {
                // Morgan adds a trailing newline; trim it to keep logs clean
                this.info(message.trim());
            }
        };
    }
}

export default Logger;