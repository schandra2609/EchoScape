import React, { useEffect, useState } from 'react';
import { JournalAPI } from '../services/API.js';
import { BarChart2, Hash, Loader2, Compass, Heart } from 'lucide-react';

const Insights = () => {
    const [insights, setInsights] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const userId = 'user-123';

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                // This will grab the { success: true, data: { ... } } object from your API service
                const rawResponse = await JournalAPI.getInsights(userId);
                
                // Log it to the browser console just to be safe!
                console.log("Raw Insights Response:", rawResponse);
                
                // Extract the nested 'data' object that actually contains totalEntries, topEmotion, etc.
                const actualInsights = rawResponse.data ? rawResponse.data : rawResponse;
                
                setInsights(actualInsights);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError('No data available. Write a journal entry to generate insights.');
                } else {
                    setError('Failed to load insights. Please try again later.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsights();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-forest" />
                <p>Crunching your mental state data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
                <BarChart2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">{error}</p>
            </div>
        );
    }

    if (!insights) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Mindscape Insights</h1>
                <p className="text-slate-500">A psychological overview based on your recent nature journaling.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Entries Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="bg-blue-50 p-3 rounded-full mb-4">
                        <BarChart2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Entries</p>
                    <p className="text-4xl font-bold text-slate-800">{insights.totalEntries}</p>
                </div>

                {/* Top Emotion Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="bg-rose-50 p-3 rounded-full mb-4">
                        <Heart className="h-6 w-6 text-rose-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Top Emotion</p>
                    <p className="text-3xl font-bold text-forest capitalize">{insights.topEmotion || 'N/A'}</p>
                </div>

                {/* Most Used Ambience Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="bg-amber-50 p-3 rounded-full mb-4">
                        <Compass className="h-6 w-6 text-amber-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Go-To Ambience</p>
                    <p className="text-3xl font-bold text-slate-800 capitalize">{insights.mostUsedAmbience || 'N/A'}</p>
                </div>
            </div>

            {/* Recent Keywords Tag Cloud */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                    <Hash className="h-5 w-5 text-forest" />
                    <h2 className="text-xl font-bold text-slate-800">Recent Themes</h2>
                </div>
        
                {insights.recentKeywords && insights.recentKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {insights.recentKeywords.map((keyword, index) => (
                            <span 
                                key={index} 
                                className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-sm font-medium hover:bg-forest hover:text-white hover:border-forest transition-colors cursor-default"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 italic">Not enough data to extract themes yet.</p>
                )}
            </div>
        </div>
    );
};

export default Insights;