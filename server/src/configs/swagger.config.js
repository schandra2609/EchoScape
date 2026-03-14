/**
 * @file swagger.config.js
 * @module Config/Swagger
 * @description Configuration for generating Swagger UI API documentation.
 * @author Sayan Chandra
 */
import swaggerJSDoc from "swagger-jsdoc";
import { ENV_CONFIG } from "./env.config.js";
import { response } from "express";
import { descriptions } from "jest-config";

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Echoscape API',
            version: '1.0.0',
            description: 'API documentation for the Echoscape Journaling backend. Analyzes nature-immersive journal entries using Google Gemini.',
        },
        servers: [
            {
                url: `http://localhost:${ENV_CONFIG.SERVER.PORT}/api${ENV_CONFIG.SERVER.API_V}`,
                description: 'Development Server',
            },
        ],
        paths: {
            '/journal/analyze': {
                post: {
                    summary: 'Analyze text using LLM without saving',
                    tags: ['Journal'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { text: { type: 'string', example: 'I felt so at peace listening to the ocean waves today.' } }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Successful analysis' }
                    }
                }
            },
            '/journal': {
                post: {
                    summary: 'Create a new journal entry.',
                    tags: ['Journal'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        userId: { type: 'string', example: 'user-123' },
                                        ambience: { type: 'string', example: 'ocean' },
                                        text: { type: 'string', example: 'The sound of the waves really helped me clear my mind.' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Journal created successfully' }
                    }
                }
            },
            '/journal/{userId}': {
                get: {
                    summary: 'Get all journal entries for a user',
                    tags: ['Journal'],
                    parameters: [
                        { name: 'userId', in: 'path', required: true, schema: { type: 'string' }, example: 'user-123' }
                    ],
                    responses: {
                        200: { description: 'List of journal entries' }
                    }
                }
            },
            '/journal/insights/{userId}': {
                get: {
                    summary: 'Get aggregated insights for a user',
                    tags: ['Journal'],
                    parameters: [
                        { name: 'userId', in: 'path', required: true, schema: { type: 'string' }, example: 'user-123' }
                    ],
                    responses: {
                        200: { description: 'User insights retrieved successfully' }
                    }
                }
            }
        }
    },
    apis: []
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);