import React from 'react';
import { Sparkles, Flame, Award, Bot, Compass, Orbit, Search } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenAITutor, xp = 850, streak = 4 }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Lab Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <Orbit className="w-6 h-6 animate-orbit-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white ring-1 ring-emerald-300"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                Fullerenes
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Quantum Learning Lab</p>
          </div>
        </div>

        {/* Global Progress & Learning Philosophy Pipeline */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/60 text-xs font-medium text-slate-600">
          <span className="text-indigo-600 font-semibold flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            Learn
          </span>
          <span className="text-slate-300">→</span>
          <span className="text-slate-700 font-medium">See</span>
          <span className="text-slate-300">→</span>
          <span className="text-slate-700 font-medium">Build</span>
          <span className="text-slate-300">→</span>
          <span className="text-slate-700 font-medium">Run</span>
          <span className="text-slate-300">→</span>
          <span className="text-purple-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Understand
          </span>
        </div>

        {/* Right Controls: Streak, XP, AI Tutor Button, Profile */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-semibold" title="Daily Learning Streak">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{streak} Days</span>
          </div>

          {/* XP */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200/70 text-indigo-800 text-xs font-semibold" title="Quantum Mastery Points">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>{xp} QP</span>
          </div>

          {/* AI Tutor Button */}
          <button
            onClick={onOpenAITutor}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium text-xs shadow-sm hover:shadow-indigo-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="relative">
              <Bot className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full"></span>
            </div>
            <span>AI Tutor</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
              AC
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">Alex Chen</div>
              <div className="text-[10px] text-slate-500 font-medium">Quantum Explorer • Lvl 2</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
