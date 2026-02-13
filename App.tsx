
import React, { useState, useEffect } from 'react';
import { Curriculum, GenerateParams } from './types';
import { generateCurriculum } from './services/geminiService';
import CurriculumCard from './components/CurriculumCard';
import CurriculumViewer from './components/CurriculumViewer';

const App: React.FC = () => {
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeCurriculumId, setActiveCurriculumId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<GenerateParams>({
    topic: '',
    audience: 'Absolute Beginners',
    depth: 'Comprehensive',
    weeks: 4
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('curricuforge_data');
    if (saved) {
      try {
        setCurricula(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load curricula", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('curricuforge_data', JSON.stringify(curricula));
  }, [curricula]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic) return;

    setIsGenerating(true);
    setShowModal(false);
    
    try {
      const newCurriculum = await generateCurriculum(formData);
      setCurricula(prev => [newCurriculum, ...prev]);
      setActiveCurriculumId(newCurriculum.id);
    } catch (error) {
      console.error("Generation failed", error);
      alert("Something went wrong during generation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const activeCurriculum = curricula.find(c => c.id === activeCurriculumId);

  if (activeCurriculumId && activeCurriculum) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <CurriculumViewer 
          curriculum={activeCurriculum} 
          onBack={() => setActiveCurriculumId(null)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-slate-950">CF</div>
            <span className="text-xl font-bold tracking-tight">Curricu<span className="text-amber-500">Forge</span></span>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            Forge New Curriculum
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      {curricula.length === 0 && !isGenerating && (
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Mastery</span> in Minutes.
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Harness high-intelligence AI to architect professional, structured, and comprehensive learning paths for any subject.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-slate-100 text-slate-950 hover:bg-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
            >
              Start Forging
            </button>
            <a href="#how" className="bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all">
              See How it Works
            </a>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-12">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-amber-500">
                <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-100">Forging your curriculum...</h2>
              <p className="text-slate-500">Our AI architect is drafting modules, lessons, and learning outcomes.</p>
            </div>
          </div>
        ) : (
          <>
            {curricula.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
                  My Forged Curricula
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {curricula.map(curriculum => (
                    <CurriculumCard 
                      key={curriculum.id} 
                      curriculum={curriculum} 
                      onClick={(id) => setActiveCurriculumId(id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Generation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Curriculum Blueprints</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleGenerate} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Primary Topic</label>
                <input 
                  autoFocus
                  required
                  placeholder="e.g. Modern Web Development, Urban Gardening, Astrophysics..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  value={formData.topic}
                  onChange={e => setFormData({...formData, topic: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Duration (Weeks)</label>
                  <input 
                    type="number"
                    min="1"
                    max="52"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
                    value={formData.weeks}
                    onChange={e => setFormData({...formData, weeks: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Detail Level</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
                    value={formData.depth}
                    onChange={e => setFormData({...formData, depth: e.target.value as any})}
                  >
                    <option>Overview</option>
                    <option>Comprehensive</option>
                    <option>Mastery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Target Audience</label>
                <input 
                  placeholder="e.g. Undergraduates, Busy Professionals, Kids..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
                  value={formData.audience}
                  onChange={e => setFormData({...formData, audience: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Commence Forging
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
