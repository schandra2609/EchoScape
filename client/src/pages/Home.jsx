import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { JournalAPI } from '../services/API.js';
import { Trees, Waves, Mountain, Calendar, Sparkles, Loader2, Edit3 } from 'lucide-react';

const Home = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Hardcoded for the assignment simulation
  const userId = 'user-123';

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const responseData = await JournalAPI.getEntries(userId);

        const actualArray = Array.isArray(responseData)
          ? responseData
          : (responseData?.data || []);

        setEntries(actualArray);
      } catch (err) {
        setError('Failed to load journal entries.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Helper function to render the correct icon based on ambience
  const getAmbienceIcon = (ambience) => {
    switch (ambience) {
      case 'forest': return <Trees className="h-5 w-5 text-green-600" />;
      case 'ocean': return <Waves className="h-5 w-5 text-blue-500" />;
      case 'mountain': return <Mountain className="h-5 w-5 text-slate-700" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-forest" />
        <p>Loading your journal entries...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
        <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Your journal is empty</h2>
        <p className="text-slate-500 mb-6">Start your mindfulness journey by writing your first entry.</p>
        <Link to="/write" className="inline-flex items-center gap-2 bg-forest hover:bg-green-800 text-white font-medium py-2 px-6 rounded-lg transition-colors">
          <Edit3 className="h-4 w-4" />
          Write an Entry
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Your Journal</h1>
        <span className="bg-slate-200 text-slate-700 py-1 px-3 rounded-full text-sm font-medium">
          {entries.length} {entries.length === 1 ? 'Entry' : 'Entries'}
        </span>
      </div>

      {entries.map((entry) => (
        <div key={entry._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
          {/* Header Row */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {getAmbienceIcon(entry.ambience)}
              <span className="capitalize font-semibold text-slate-700">{entry.ambience} Session</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(entry.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6">
            <p className="text-slate-600 italic mb-6">"{entry.text}"</p>
            
            {/* AI Analysis Section */}
            <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-800 uppercase tracking-wider">AI Analysis</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-1 bg-white p-3 rounded-lg border border-green-50 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Primary Emotion</p>
                  <p className="text-lg font-bold text-forest capitalize">{entry.analysis.emotion}</p>
                </div>
                <div className="md:col-span-2 bg-white p-3 rounded-lg border border-green-50 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">AI Summary</p>
                  <p className="text-sm text-slate-700">{entry.analysis.summary}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Extracted Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {entry.analysis.keywords.map((kw, idx) => (
                    <span key={idx} className="bg-white border border-green-200 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;