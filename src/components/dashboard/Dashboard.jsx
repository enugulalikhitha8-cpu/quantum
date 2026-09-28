import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Play,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  BarChart2,
  ChevronRight,
  Flame,
  Award,
  Zap,
  HelpCircle,
  Compass
} from 'lucide-react';

export default function Dashboard({
  onNavigateToTab,
  onNavigateToLabWithPreset,
  onOpenAITutor
}) {
  // Active view for the "ONE CIRCUIT → MULTIPLE VIEWS" interactive demonstration
  const [multiViewMode, setMultiViewMode] = useState('circuit'); // 'circuit' | 'matrix' | 'bloch' | 'prob' | 'ai'

  const journeySteps = [
    { id: 'qubits', label: 'Qubits', status: 'completed', pct: 100, desc: 'Ground & Excited states' },
    { id: 'superposition', label: 'Superposition', status: 'completed', pct: 100, desc: 'Hadamard 50/50 balance' },
    { id: 'gates', label: 'Quantum Gates', status: 'in_progress', pct: 65, desc: 'X, Z & Unitary operations' },
    { id: 'measurement', label: 'Measurement', status: 'ready', pct: 0, desc: 'Wavefunction collapse' },
    { id: 'entanglement', label: 'Entanglement', status: 'locked', pct: 0, desc: 'Bell pair synthesis' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Continue Learning Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Continue Learning Card (Left 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100/60 to-purple-100/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                Continue Learning
              </span>
              <span className="text-xs text-slate-400 font-medium">Session #14</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Welcome back, Alex.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg leading-relaxed">
              You're currently exploring <strong>Quantum Gates & Unitary Rotations</strong>. Ready to test how the Hadamard gate generates superposition?
            </p>

            {/* Progress Bar inside Hero */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 max-w-md">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800">Current Course Progress</span>
                <span className="font-mono font-bold text-indigo-600">78% Completed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full w-[78%]" />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToLabWithPreset('superposition')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Quantum Lab</span>
            </button>

            <button
              onClick={() => onNavigateToTab('learn')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Review Lesson
            </button>

            <button
              onClick={onOpenAITutor}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200/70 transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>

        {/* Learning Insights Widget (Right 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Adaptive Learning Insights
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                AI Diagnostic
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Strong */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Strong Mastery:</span>
                </div>
                <div className="text-emerald-800 text-[11px] flex gap-2 font-medium">
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-emerald-200/60">✓ Qubits (90%)</span>
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-emerald-200/60">✓ Superposition (70%)</span>
                </div>
              </div>

              {/* Needs Practice */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Needs Practice:</span>
                </div>
                <div className="text-amber-800 text-[11px] flex flex-wrap gap-1.5 font-medium">
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-amber-200/60">○ Quantum Gates (50%)</span>
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-amber-200/60">○ Entanglement (20%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Next Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase text-indigo-600">Recommended Next Step</div>
              <div className="text-xs font-bold text-indigo-950">Practice: H + CNOT Bell Pair</div>
            </div>
            <button
              onClick={() => onNavigateToLabWithPreset('bell_pair')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Start →
            </button>
          </div>
        </div>
      </div>

      {/* "Your Quantum Journey" Learning Path Roadmap */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Your Quantum Journey</h3>
            <p className="text-xs text-slate-500">
              Follow our structured visual curriculum from single-qubit intuition to multi-qubit entanglement.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            3 of 5 Milestones Unlocked
          </span>
        </div>

        {/* Roadmap Nodes with Connecting Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {journeySteps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress';
            const isReady = step.status === 'ready';

            return (
              <div
                key={step.id}
                onClick={() => onNavigateToTab(step.id === 'entanglement' ? 'learn' : 'learn')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                  isInProgress
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200 shadow-sm'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Node Status Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    0{idx + 1}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isInProgress
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓ Completed' : isInProgress ? 'In Progress' : isReady ? 'Ready' : 'Locked'}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {step.label}
                </div>
                <div className="text-xs text-slate-500 leading-snug line-clamp-2">
                  {step.desc}
                </div>

                {/* Micro progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full ${
                      isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KEY DIFFERENTIATOR SHOWCASE: "ONE CIRCUIT → MULTIPLE VIEWS" */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-cyan-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
              Core Platform Philosophy
            </span>
            <span className="text-xs text-cyan-300 font-mono">Simultaneous Synchronized Representations</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            ONE CIRCUIT → MULTIPLE VIEWS
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Students struggle with quantum computing because math, circuits, and physics are taught in isolation. In Fullerenes, every circuit simultaneously renders in 5 connected dimensions:
          </p>
        </div>

        {/* View Switcher Bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'circuit', label: '1. Circuit View', icon: Cpu },
            { id: 'matrix', label: '2. Matrix Lab', icon: Layers },
            { id: 'bloch', label: '3. Bloch Sphere', icon: Activity },
            { id: 'prob', label: '4. Probability & Shots', icon: BarChart2 },
            { id: 'ai', label: '5. AI Explanation', icon: Bot },
          ].map(view => {
            const Icon = view.icon;
            const isSelected = multiViewMode === view.id;
            return (
              <button
                key={view.id}
                onClick={() => setMultiViewMode(view.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
                    : 'bg-white/10 hover:bg-white/15 text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{view.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive View Display Box */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-700/80 backdrop-blur-md">
          {multiViewMode === 'circuit' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-cyan-300">
                <span>View 1: Quantum Wire Canvas (Bell Pair Circuit)</span>
                <span>Time Steps t₁ ➔ t₂ ➔ t₃</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">q₀ |0⟩</span>
                  <span className="text-slate-500">───</span>
                  <span className="px-3 py-1 rounded bg-indigo-600 font-bold text-white shadow-xs">[ H ]</span>
                  <span className="text-slate-500">───</span>
                  <span className="w-3 h-3 rounded-full bg-purple-400 inline-block"></span>
                  <span className="text-slate-500">───</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">Measure ∿</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">q₁ |0⟩</span>
                  <span className="text-slate-500">───────────────</span>
                  <span className="w-5 h-5 rounded-full border border-purple-400 text-purple-300 font-bold flex items-center justify-center text-xs">⊕</span>
                  <span className="text-slate-500">───</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">Measure ∿</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visual gates placed along chronological time slices demonstrate quantum state flow before measurement.
              </p>
            </div>
          )}

          {multiViewMode === 'matrix' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-cyan-300">
                <span>View 2: Linear Algebra Unitary Evolution</span>
                <span>U = CNOT · (H ⊗ I)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs flex flex-wrap items-center gap-4">
                <div className="text-indigo-300">
                  |00⟩ ──→
                </div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  <span className="text-slate-400 text-[10px] block mb-1">Composite 4×4 Matrix:</span>
                  <div className="grid grid-cols-4 gap-1 text-[11px] text-center text-cyan-300">
                    <span>1/√2</span><span>0</span><span>1/√2</span><span>0</span>
                    <span>0</span><span>1/√2</span><span>0</span><span>1/√2</span>
                    <span>0</span><span>1/√2</span><span>0</span><span>-1/√2</span>
                    <span>1/√2</span><span>0</span><span>-1/√2</span><span>0</span>
                  </div>
                </div>
                <div className="text-cyan-300 font-bold">
                  ──→ (|00⟩ + |11⟩)/√2
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Math is accessible when needed: see how vectors transform through unitary operations without overwhelming syntax.
              </p>
            </div>
          )}

          {multiViewMode === 'bloch' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-cyan-300">
                <span>View 3: Geometric Bloch Coordinates</span>
                <span>θ = 90°, φ = 0° (Equator +X axis)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white mb-1">State Vector Orientation:</div>
                  <div>• Qubit 0 rotates from North Pole (|0⟩) to Equator (|+⟩)</div>
                  <div>• Entanglement couples Qubit 1 into the joint state space</div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-indigo-900/60 border border-indigo-500/40 text-cyan-300 font-mono font-bold text-center">
                  |+⟩ = (|0⟩ + |1⟩)/√2
                </div>
              </div>
            </div>
          )}

          {multiViewMode === 'prob' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-cyan-300">
                <span>View 4: Measurement Distribution (1,024 Shots)</span>
                <span>P(|00⟩) = 50%, P(|11⟩) = 50%, Cross-states = 0%</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>|00⟩</span><span>512 shots (50%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800">
                  <div className="w-1/2 h-full bg-cyan-400 rounded-full" />
                </div>
                <div className="flex justify-between text-xs font-mono pt-2">
                  <span>|11⟩</span><span>512 shots (50%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800">
                  <div className="w-1/2 h-full bg-purple-400 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {multiViewMode === 'ai' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
                <Bot className="w-4 h-4" />
                <span>View 5: Context-Aware AI Explanation</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 text-xs text-slate-300 leading-relaxed">
                “You just inspected the Bell pair circuit! The H gate first placed Qubit 0 into equal superposition. Then, the CNOT gate flipped Qubit 1 only when Qubit 0 is in state |1⟩, tangling their fates together. Notice how the cross terms |01⟩ and |10⟩ have zero probability.”
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Try building and testing this circuit hands-on:
            </span>
            <button
              onClick={() => onNavigateToLabWithPreset('bell_pair')}
              className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              <span>Launch in Quantum Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
