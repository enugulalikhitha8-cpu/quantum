import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import LearnView from './components/learn/LearnView';
import QuantumLab from './components/lab/QuantumLab';
import AdaptiveQuiz from './components/practice/AdaptiveQuiz';
import PracticeChallenges from './components/practice/PracticeChallenges';
import ProgressView from './components/progress/ProgressView';
import AITutorModal from './components/tutor/AITutorModal';
import {
  Sparkles,
  Bot,
  Compass,
  Cpu,
  Brain,
  Award,
  Layers,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'learn' | 'lab' | 'practice' | 'progress'
  const [practiceSubTab, setPracticeSubTab] = useState('quiz'); // 'quiz' | 'challenges'
  const [activeLabPreset, setActiveLabPreset] = useState(null);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [userXP, setUserXP] = useState(850);
  const [userStreak, setUserStreak] = useState(4);

  // Navigate to lab with specific preset
  const handleNavigateToLabWithPreset = (presetId) => {
    setActiveLabPreset(presetId);
    setActiveTab('lab');
  };

  const handleOpenAITutor = () => {
    setIsAITutorOpen(true);
  };

  const handleAddXP = (amount) => {
    setUserXP(prev => prev + amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAITutor={handleOpenAITutor}
        xp={userXP}
        streak={userStreak}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAITutor={handleOpenAITutor}
        />

        {/* Dynamic Center/Right Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {/* TAB 1: HOME DASHBOARD */}
          {activeTab === 'home' && (
            <Dashboard
              onNavigateToTab={setActiveTab}
              onNavigateToLabWithPreset={handleNavigateToLabWithPreset}
              onOpenAITutor={handleOpenAITutor}
            />
          )}

          {/* TAB 2: LEARN MODULES */}
          {activeTab === 'learn' && (
            <LearnView
              onNavigateToLab={handleNavigateToLabWithPreset}
              onOpenAITutor={handleOpenAITutor}
            />
          )}

          {/* TAB 3: QUANTUM LAB */}
          {activeTab === 'lab' && (
            <QuantumLab
              initialPreset={activeLabPreset}
              onOpenAITutor={handleOpenAITutor}
            />
          )}

          {/* TAB 4: PRACTICE & AI (Adaptive Quiz & Challenges) */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              {/* Practice Sub-tab switcher */}
              <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPracticeSubTab('quiz')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      practiceSubTab === 'quiz'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Brain className="w-4 h-4" />
                    <span>AI Adaptive Quiz & Diagnostics</span>
                  </button>

                  <button
                    onClick={() => setPracticeSubTab('challenges')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      practiceSubTab === 'challenges'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Interactive Circuit Challenges</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 pr-3">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Real-time Misconception Diagnostic Engine</span>
                </div>
              </div>

              {practiceSubTab === 'quiz' ? (
                <AdaptiveQuiz
                  onNavigateToLab={handleNavigateToLabWithPreset}
                  onOpenAITutor={handleOpenAITutor}
                  onCompleteQuiz={() => handleAddXP(200)}
                />
              ) : (
                <PracticeChallenges
                  onCompleteChallenge={handleAddXP}
                  onNavigateToLab={handleNavigateToLabWithPreset}
                />
              )}
            </div>
          )}

          {/* TAB 5: PROGRESS & PERSONALIZATION */}
          {activeTab === 'progress' && (
            <ProgressView
              onNavigateToLab={handleNavigateToLabWithPreset}
              onNavigateToPractice={() => {
                setActiveTab('practice');
                setPracticeSubTab('quiz');
              }}
              onNavigateToLearn={() => setActiveTab('learn')}
            />
          )}
        </main>
      </div>

      {/* Floating AI Tutor Summon Button at bottom right */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isAITutorOpen && (
          <button
            onClick={handleOpenAITutor}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all cursor-pointer transform hover:scale-105 active:scale-95 group"
          >
            <div className="relative">
              <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-700 animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-700"></span>
            </div>
            <span>Ask Quantum AI Tutor</span>
          </button>
        )}
      </div>

      {/* Floating Context-Aware AI Tutor Modal */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        activeContext={activeTab}
        onLoadPreset={handleNavigateToLabWithPreset}
      />
    </div>
  );
}
