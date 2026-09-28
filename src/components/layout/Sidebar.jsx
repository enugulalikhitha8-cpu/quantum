import React from 'react';
import { Home, BookOpen, Cpu, Sparkles, LineChart, ChevronRight, Zap } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenAITutor }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, badge: null },
    { id: 'learn', label: 'Learn', icon: BookOpen, badge: '5 Lessons' },
    { id: 'lab', label: 'Quantum Lab', icon: Cpu, badge: 'Interactive' },
    { id: 'practice', label: 'Practice & AI', icon: Sparkles, badge: 'Adaptive' },
    { id: 'progress', label: 'Progress', icon: LineChart, badge: '78%' },
  ];

  return (
    <aside className="w-64 bg-white/70 backdrop-blur-md border-r border-slate-200/80 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-semibold shadow-xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-500 bg-slate-100 group-hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Learning Journey Roadmap summary */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-blue-50/70 border border-indigo-100/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              Learning Path
            </span>
            <span className="text-[10px] font-bold text-indigo-600">3 of 5 Done</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Qubit Basics
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">100%</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Superposition
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">100%</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-indigo-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                Quantum Gates
              </span>
              <span className="text-[10px] text-indigo-600 font-bold">65%</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                Measurement
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Ready</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                Entanglement
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Locked</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('learn')}
            className="w-full mt-3 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 pt-2 border-t border-indigo-100 cursor-pointer"
          >
            <span>Resume Lesson</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Assistant Quick Card */}
      <div className="mt-4 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Contextual AI Tutor</div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Synchronized with Lab
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-2.5">
          Ask questions about current circuit states or quiz misconceptions in real time.
        </p>
        <button
          onClick={onOpenAITutor}
          className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 text-xs font-semibold transition-colors cursor-pointer text-center"
        >
          Open AI Assistant
        </button>
      </div>
    </aside>
  );
}
