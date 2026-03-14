/**
 * @file api.service.js
 * @description Centralized Axios configuration for the Echoscape API.
 */
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const JournalAPI = {
    /**
     * Submit a new journal entry to the database
     */
    createEntry: async (userId, ambience, text) => {
        const response = await apiClient.post('/journal', { userId, ambience, text });
        return response.data;
    },

    /**
     * Fetch all past journal entries for a user
     */
    getEntries: async (userId) => {
        const response = await apiClient.get(`/journal/${userId}`);
        return response.data;
    },

    /**
     * Fetch aggregated psychological insights for a user
     */
    getInsights: async (userId) => {
        const response = await apiClient.get(`/journal/insights/${userId}`);
        return response.data;
    },

    /**
     * Standalone LLM text analysis (no database save)
     */
    analyzeText: async (text) => {
        const response = await apiClient.post('/journal/analyze', { text });
        return response.data;
    }
};

export default apiClient;