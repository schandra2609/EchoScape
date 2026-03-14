import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trees, Waves, Mountain, Loader2, Send } from 'lucide-react';
import { JournalAPI } from '../services/API.js';

const WriteJournal = () => {
  const navigate = useNavigate();
  
  // State management for our form
  const [userId, setUserId] = useState('user-123'); // Hardcoded for assignment purposes
  const [ambience, setAmbience] = useState('forest');
  const [text, setText] = useState('');
  
  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate minimum length (matching our backend schema)
      if (text.trim().length < 5) {
        throw new Error('Your journal entry is too short to analyze. Please write a bit more.');
      }

      // Send to our Express backend
      await JournalAPI.createEntry(userId, ambience, text);
      
      // On success, redirect the user back to the Home page to see their new entry
      navigate('/');
    } catch (err) {
      // Safely extract the error message from the Axios response if it exists
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">How are you feeling?</h1>
        <p className="text-slate-500">Take a deep breath, choose your environment, and let your thoughts flow.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
        
        {/* Mock User ID Input (Since we bypassed real auth for the assignment) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">User ID (Simulation)</label>
          <input 
            type="text" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Ambience Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">Select your environment</label>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            
            {/* Forest Option */}
            <button
              type="button"
              onClick={() => setAmbience('forest')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                ambience === 'forest' ? 'border-forest bg-green-50 text-forest' : 'border-slate-100 hover:border-green-200 text-slate-500'
              }`}
            >
              <Trees className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Forest</span>
            </button>

            {/* Ocean Option */}
            <button
              type="button"
              onClick={() => setAmbience('ocean')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                ambience === 'ocean' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-blue-200 text-slate-500'
              }`}
            >
              <Waves className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Ocean</span>
            </button>

            {/* Mountain Option */}
            <button
              type="button"
              onClick={() => setAmbience('mountain')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                ambience === 'mountain' ? 'border-slate-700 bg-slate-100 text-slate-800' : 'border-slate-100 hover:border-slate-300 text-slate-500'
              }`}
            >
              <Mountain className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Mountain</span>
            </button>
            
          </div>
        </div>

        {/* Journal Text Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Your Journal</label>
          <textarea
            rows="6"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I felt really at peace today while listening to the wind..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all resize-none"
            required
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-forest hover:bg-green-800 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing with Gemini AI...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Save Entry</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default WriteJournal;