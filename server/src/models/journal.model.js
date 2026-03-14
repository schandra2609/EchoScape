/**
 * @file journal.model.js
 * @module Database/Models/Journal
 * @description Mongoose schema definition for user journal entries.
 * Stores the original entry and the AI-generated emotional analysis.
 * @author Sayan Chandra
 */
import mongoose from "mongoose";

/**
 * @constant journalSchema
 * @description The structural blueprint for a journal document in MongoDB.
 */
const journalSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "User ID is required to save a journal entry."],
            index: true, // Indexed because we will query heavily by userId for the GET endpoints
            trim: true
        },
        ambience: {
            type: String,
            required: [true, "Ambience type is required."],
            enum: {
                values: ["forest", "ocean", "mountain"],
                message: "{VALUE} is not a valid immersive ambience. Allowed: forest, ocean, mountain."
            }
        },
        text: {
            type: String,
            required: [true, "Journal text cannot be empty."],
            trim: true,
            minlength: [5, "Journal entry is too short to analyze."]
        },
        // Grouped the AI analysis into a nested object for cleaner data modeling
        analysis: {
            emotion: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },
            keywords: {
                type: [String],
                required: true,
                validate: {
                    validator: function(arr) {
                        return arr && arr.length > 0;
                    },
                    message: "At least one keyword must be extracted."
                }
            },
            summary: {
                type: String,
                required: true,
                trim: true
            }
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/**
 * @constant Journal
 * @description The compiled Mongoose model for interacting with the journals collection.
 */
const Journal = mongoose.model("Journal", journalSchema);

export default Journal;