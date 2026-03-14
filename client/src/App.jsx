import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Leaf, BookOpen, BarChart2, Edit3 } from 'lucide-react';
import WriteJournal from './pages/WriteJournal.jsx';
import Home from './pages/Home.jsx';
import Insights from './pages/Insights.jsx';

function App() {
  const location = useLocation();

  // Helper to highlight the active tab in the navbar
  const isActive = (path) => location.pathname === path ? "text-forest font-semibold border-b-2 border-forest" : "text-slate-500 hover:text-forest";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">

            {/* Logo area */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-forest" />
                <span className="text-xl font-bold text-slate-800 tracking-tight">Echoscape</span>
              </Link>
            </div>

            {/* Nav Links */}
            <div className="flex space-x-8 items-center">
              <Link to="/" className={`flex items-center gap-1.5 px-1 py-5 text-sm transition-colors ${isActive('/')}`}>
                <BookOpen className="h-4 w-4" />
                <span>Entries</span>
              </Link>

              <Link to="/write" className={`flex items-center gap-1.5 px-1 py-5 text-sm transition-colors ${isActive('/write')}`}>
                <Edit3 className="h-4 w-4" />
                <span>Write</span>
              </Link>

              <Link to="/insights" className={`flex items-center gap-1.5 px-1 py-5 text-sm transition-colors ${isActive('/insights')}`}>
                <BarChart2 className="h-4 w-4" />
                <span>Insights</span>
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Routing Area */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<WriteJournal />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </main>
      
    </div>
  );
}

export default App;