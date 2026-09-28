import React, { useState } from 'react';
import BlochSphere from '../lab/BlochSphere';
import {
  Sparkles,
  Bot,
  Play,
  RotateCcw,
  ChevronRight,
  Layers,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Zap,
  Compass,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LearnView({ onNavigateToLab, onOpenAITutor }) {
  const [activeLesson, setActiveLesson] = useState('qubits'); // 'qubits' | 'superposition' | 'gates' | 'measurement' | 'entanglement'

  // Qubit explorer state (theta angle from 0 to PI)
  const [qubitTheta, setQubitTheta] = useState(0); // 0 = |0⟩, PI = |1⟩, PI/2 = |+⟩
  const [lastMeasuredResult, setLastMeasuredResult] = useState(null);
  const [measurementCount, setMeasurementCount] = useState({ 0: 0, 1: 0 });

  // Superposition module state
  const [superpositionStep, setSuperpositionStep] = useState(0); // 0: |0⟩, 1: after H, 2: measured
  const [simulatedSuperpositionRuns, setSimulatedSuperpositionRuns] = useState(null);

  // Entanglement module state
  const [bellStep, setBellStep] = useState(0); // 0: initial, 1: H on q0, 2: CNOT, 3: measured
  const [bellShots, setBellShots] = useState(null);
  const [isEntangledExperimentRunning, setIsEntangledExperimentRunning] = useState(false);

  // Math for Qubit Explorer
  const prob0 = Math.pow(Math.cos(qubitTheta / 2), 2);
  const prob1 = Math.pow(Math.sin(qubitTheta / 2), 2);

  // Single shot measurement for Qubit Explorer
  const handleMeasureSingleQubit = () => {
    const outcome = Math.random() < prob0 ? 0 : 1;
    setLastMeasuredResult(outcome);
    setMeasurementCount(prev => ({
      ...prev,
      [outcome]: prev[outcome] + 1
    }));
  };

  // Run 100 trials for Superposition
  const run100Trials = () => {
    let zeros = 0;
    let ones = 0;
    for (let i = 0; i < 100; i++) {
      if (Math.random() < 0.5) zeros++;
      else ones++;
    }
    setSimulatedSuperpositionRuns({ 0: zeros, 1: ones });
  };

  // Run Bell Pair Experiment
  const runBellExperiment = () => {
    setIsEntangledExperimentRunning(true);
    setTimeout(() => {
      let c00 = 0;
      let c11 = 0;
      for (let i = 0; i < 100; i++) {
        if (Math.random() < 0.5) c00++;
        else c11++;
      }
      setBellShots({ '00': c00, '01': 0, '10': 0, '11': c11 });
      setIsEntangledExperimentRunning(false);
      setBellStep(3);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (e) {
        // fallback
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Module Selector Ribbon */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'qubits', label: '1. Qubit Basics', status: 'Completed', color: 'emerald' },
          { id: 'superposition', label: '2. Superposition', status: 'Completed', color: 'emerald' },
          { id: 'gates', label: '3. Quantum Gates', status: 'Active', color: 'indigo' },
          { id: 'measurement', label: '4. Measurement', status: 'Ready', color: 'slate' },
          { id: 'entanglement', label: '5. Entanglement (Bell Pair)', status: 'Featured', color: 'purple' }
        ].map(lesson => {
          const isActive = activeLesson === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{lesson.label}</span>
              {lesson.status === 'Featured' && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-purple-100 text-purple-700 font-extrabold uppercase">
                  Bell Pair
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: UNDERSTANDING QUBITS */}
      {/* ========================================================================= */}
      {activeLesson === 'qubits' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Explanation & Interaction (Left 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  Concept 1
                </span>
                <span className="text-xs text-slate-400 font-medium">Visual Foundations</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Understanding the Qubit</h2>
            </div>

            {/* Short punchy explanations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Classical Bit</div>
                <div className="text-sm font-bold text-slate-800 mt-1">Strictly 0 OR 1</div>
                <p className="text-xs text-slate-500 mt-1">Like a binary light switch: either on or off.</p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Quantum Bit (Qubit)</div>
                <div className="text-sm font-bold text-indigo-950 mt-1">Combination of |0⟩ AND |1⟩</div>
                <p className="text-xs text-slate-600 mt-1">Can exist in a continuous blend until measured.</p>
              </div>
            </div>

            {/* Interactive Slider */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Drag Slider to Rotate Qubit State Vector:
                </span>
                <span className="font-mono text-xs font-bold text-indigo-600">
                  θ = {(qubitTheta * (180 / Math.PI)).toFixed(0)}°
                </span>
              </div>

              <input
                type="range"
                min="0"
                max={Math.PI}
                step="0.01"
                value={qubitTheta}
                onChange={(e) => setQubitTheta(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />

              <div className="flex justify-between text-[11px] font-mono font-semibold text-slate-500">
                <button onClick={() => setQubitTheta(0)} className="hover:text-indigo-600 cursor-pointer">
                  |0⟩ (Ground, 0°)
                </button>
                <button onClick={() => setQubitTheta(Math.PI / 2)} className="hover:text-indigo-600 cursor-pointer text-indigo-600">
                  |+⟩ (Superposition, 90°)
                </button>
                <button onClick={() => setQubitTheta(Math.PI)} className="hover:text-indigo-600 cursor-pointer">
                  |1⟩ (Excited, 180°)
                </button>
              </div>
            </div>

            {/* Probability Bars */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-slate-700">|0⟩ Probability [cos²(θ/2)]:</span>
                  <span className="font-bold text-indigo-600">{(prob0 * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-150"
                    style={{ width: `${prob0 * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-slate-700">|1⟩ Probability [sin²(θ/2)]:</span>
                  <span className="font-bold text-purple-600">{(prob1 * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-150"
                    style={{ width: `${prob1 * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Measurement Collapse Tester */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-indigo-950">Test Quantum Wavefunction Collapse:</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Measurement forces the continuous superposition into a single discrete outcome.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleMeasureSingleQubit}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                >
                  Measure Qubit
                </button>

                {lastMeasuredResult !== null && (
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 font-mono font-extrabold text-sm text-indigo-700 shadow-xs animate-bounce">
                    Observed: |{lastMeasuredResult}⟩
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Visualizer (Bloch Sphere) (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <BlochSphere
              theta={qubitTheta}
              phi={0}
              label="Interactive Qubit"
              interactive={true}
              onAngleChange={(t, p) => setQubitTheta(t)}
            />

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                State Vector Math:
              </span>
              <div className="p-2.5 rounded-xl bg-slate-50 font-mono font-bold text-indigo-900 border border-slate-200/60">
                |ψ⟩ = {Math.cos(qubitTheta / 2).toFixed(3)}|0⟩ + {Math.sin(qubitTheta / 2).toFixed(3)}|1⟩
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                The coefficients are probability amplitudes. Squaring them gives the exact probability of finding 0 or 1 upon measurement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: SUPERPOSITION */}
      {/* ========================================================================= */}
      {activeLesson === 'superposition' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                Concept 2
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Superposition with the Hadamard Gate</h2>
              <p className="text-xs text-slate-500">
                Watch how applying an H gate transforms a definite ground state into an equal quantum superposition.
              </p>
            </div>

            <button
              onClick={() => onNavigateToLab('superposition')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs border border-indigo-200 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Open in Quantum Lab</span>
            </button>
          </div>

          {/* Visual Transformation Chain */}
          {/* |0⟩ → H → Superposition → Measure */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/40 to-purple-50/40 border border-slate-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">
              The Superposition Pipeline: |0⟩ ─── [ H ] ─── Superposition ─── Measure
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {/* Step 1: |0⟩ */}
              <div className={`p-4 rounded-2xl border text-center transition-all ${
                superpositionStep === 0
                  ? 'bg-white border-indigo-400 ring-2 ring-indigo-200 shadow-md scale-105'
                  : 'bg-white/80 border-slate-200'
              }`}>
                <div className="text-[10px] font-bold text-slate-400 uppercase">1. Initial State</div>
                <div className="text-2xl font-mono font-extrabold text-slate-800 my-1">|0⟩</div>
                <div className="text-xs font-medium text-emerald-600">100% chance of 0</div>
              </div>

              <ArrowRight className="w-5 h-5 text-indigo-400" />

              {/* Step 2: H Gate Action */}
              <button
                onClick={() => setSuperpositionStep(1)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  superpositionStep === 1
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-300 scale-105'
                    : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">2. Apply Gate</div>
                <div className="text-2xl font-mono font-extrabold my-1">[ H ] Gate</div>
                <div className="text-xs font-semibold">Click to Apply H</div>
              </button>

              <ArrowRight className="w-5 h-5 text-indigo-400" />

              {/* Step 3: Superposition State */}
              <div className={`p-4 rounded-2xl border text-center transition-all ${
                superpositionStep >= 1
                  ? 'bg-white border-purple-400 ring-2 ring-purple-200 shadow-md'
                  : 'bg-white/60 border-slate-200 opacity-50'
              }`}>
                <div className="text-[10px] font-bold text-slate-400 uppercase">3. Superposition</div>
                <div className="text-lg font-mono font-extrabold text-purple-700 my-1">
                  (|0⟩ + |1⟩)/√2
                </div>
                <div className="text-xs font-semibold text-purple-600">50% / 50% Balance</div>
              </div>

              <ArrowRight className="w-5 h-5 text-indigo-400" />

              {/* Step 4: Measure */}
              <button
                onClick={run100Trials}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-center shadow-md cursor-pointer transition-all"
              >
                <div className="text-[10px] font-bold text-cyan-400 uppercase">4. Measure</div>
                <div className="text-xl font-mono font-bold my-1">∿ Burst 100x</div>
                <div className="text-xs text-slate-300">Run 100 Trials</div>
              </button>
            </div>
          </div>

          {/* Dynamic Probability Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Probability Amplitudes
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-slate-700">|0⟩ Probability:</span>
                    <span className="font-bold text-indigo-600">
                      {superpositionStep >= 1 ? '50.0%' : '100.0%'}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-700 rounded-full"
                      style={{ width: superpositionStep >= 1 ? '50%' : '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-slate-700">|1⟩ Probability:</span>
                    <span className="font-bold text-purple-600">
                      {superpositionStep >= 1 ? '50.0%' : '0.0%'}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-purple-600 transition-all duration-700 rounded-full"
                      style={{ width: superpositionStep >= 1 ? '50%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 100-Trial Statistics Result */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1">
                  Empirical Measurement Distribution (100 Shots)
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  Due to quantum randomness, 100 shots will converge closely around 50/50.
                </p>
              </div>

              {simulatedSuperpositionRuns ? (
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-3 rounded-xl bg-white border border-indigo-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400">Observed |0⟩</span>
                    <div className="text-2xl font-mono font-extrabold text-indigo-600">
                      {simulatedSuperpositionRuns[0]}%
                    </div>
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-white border border-purple-100 text-center">
                    <span className="text-[10px] font-bold text-slate-400">Observed |1⟩</span>
                    <div className="text-2xl font-mono font-extrabold text-purple-600">
                      {simulatedSuperpositionRuns[1]}%
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={run100Trials}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                >
                  Click to Run 100 Measurement Trials
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: QUANTUM GATES */}
      {/* ========================================================================= */}
      {activeLesson === 'gates' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                Concept 3
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Fundamental Quantum Gates</h2>
              <p className="text-xs text-slate-500">
                Unitary transformations that rotate and entangle quantum states.
              </p>
            </div>
            <button
              onClick={() => onNavigateToLab(null)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Open Gate Canvas →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-sm">
                  H
                </span>
                <div>
                  <h4 className="font-bold text-sm text-indigo-950">Hadamard Gate (H)</h4>
                  <span className="text-[10px] text-indigo-600 font-semibold">Superposition Generator</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maps basis states |0⟩ to ( |0⟩ + |1⟩ ) / √2. Rotates the state vector to the equator of the Bloch sphere.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-mono font-bold text-sm">
                  X
                </span>
                <div>
                  <h4 className="font-bold text-sm text-amber-950">Pauli-X Gate (NOT)</h4>
                  <span className="text-[10px] text-amber-600 font-semibold">Bit Flip Operator</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Swaps |0⟩ and |1⟩ deterministically. Equivalent to a 180° rotation around the X-axis of the Bloch sphere.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-sm">
                  Z
                </span>
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Pauli-Z Gate (Phase)</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold">Phase Inverter</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Leaves |0⟩ unchanged, but flips the sign of |1⟩ to -|1⟩. Inverts the relative quantum phase by 180°.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-mono font-bold text-sm">
                  CX
                </span>
                <div>
                  <h4 className="font-bold text-sm text-purple-950">CNOT (Controlled-NOT)</h4>
                  <span className="text-[10px] text-purple-600 font-semibold">2-Qubit Entangler</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flips the target qubit if and only if the control qubit is in state |1⟩. Crucial for synthesizing entangled pairs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: MEASUREMENT */}
      {/* ========================================================================= */}
      {activeLesson === 'measurement' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Concept 4
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Quantum Measurement & Wavefunction Collapse</h2>
            <p className="text-xs text-slate-500">
              Why observing a quantum state irrecoverably collapses its superposition into a classical bit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">1. Born Rule</span>
              <p className="text-xs text-slate-600 mt-1">
                The probability of each outcome is the absolute square of its amplitude: P(|0⟩) = |α|², P(|1⟩) = |β|².
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">2. Irreversible Collapse</span>
              <p className="text-xs text-slate-600 mt-1">
                Once collapsed to |0⟩, repeating the measurement returns |0⟩ with 100% certainty. The superposition is gone.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">3. Classical Readout</span>
              <p className="text-xs text-slate-600 mt-1">
                Quantum information is converted into ordinary classical bits (0 or 1) that can be read by classical computers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: ENTANGLEMENT ("CREATE YOUR FIRST BELL PAIR") */}
      {/* ========================================================================= */}
      {activeLesson === 'entanglement' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
                Interactive Special Lesson
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Create Your First Bell Pair (|Φ⁺⟩)
              </h2>
              <p className="text-xs text-slate-500">
                Learn how two independent qubits can become deeply entangled so that measuring one instantly dictates the other.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAITutor}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4 text-purple-600" />
                <span>Explain this with AI</span>
              </button>
              <button
                onClick={() => onNavigateToLab('bell_pair')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Open in Lab →
              </button>
            </div>
          </div>

          {/* Bell Circuit Blueprint Canvas */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-inner space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>Circuit Architecture: Bell State Generator</span>
              <span>|00⟩ ──→ (|00⟩ + |11⟩)/√2</span>
            </div>

            {/* Visual Circuit Diagram */}
            <div className="space-y-6 py-4 font-mono text-xs">
              {/* q0 */}
              <div className="flex items-center gap-2">
                <span className="w-8 font-bold text-indigo-300">q₀</span>
                <span className="text-slate-500">───</span>
                <span className="px-3 py-1.5 rounded-lg bg-indigo-600 font-bold text-white shadow-md">
                  [ H ]
                </span>
                <span className="text-slate-500">───</span>
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-purple-500 ring-4 ring-purple-500/30"></div>
                  {/* Line down to q1 */}
                  <div className="absolute top-4 left-1.5 w-0.5 h-10 bg-purple-400"></div>
                </div>
                <span className="text-slate-500">───</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                  Measure ∿
                </span>
              </div>

              {/* q1 */}
              <div className="flex items-center gap-2">
                <span className="w-8 font-bold text-purple-300">q₁</span>
                <span className="text-slate-500">───────────────</span>
                <div className="w-6 h-6 rounded-full border-2 border-purple-400 flex items-center justify-center font-bold text-xs text-purple-300">
                  ⊕
                </div>
                <span className="text-slate-500">───</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                  Measure ∿
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-800 text-slate-300">
              <div>
                <strong className="text-white">Step 1:</strong> Apply H to q₀ to enter equal superposition.
              </div>
              <div>
                <strong className="text-white">Step 2:</strong> Apply CNOT (q₀ control, q₁ target) to link states.
              </div>
              <div>
                <strong className="text-white">Step 3:</strong> Measure both qubits simultaneously.
              </div>
            </div>
          </div>

          {/* Interactive Run Experiment Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-purple-50 border border-purple-200">
            <div>
              <div className="text-sm font-bold text-purple-950">Run Quantum Correlation Experiment</div>
              <div className="text-xs text-purple-800 mt-0.5">
                Execute 100 shots to observe the entangled correlation in real time.
              </div>
            </div>

            <button
              onClick={runBellExperiment}
              disabled={isEntangledExperimentRunning}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isEntangledExperimentRunning ? 'Executing Shots...' : 'Run Experiment'}</span>
            </button>
          </div>

          {/* Experiment Results Histogram */}
          {bellShots && (
            <div className="p-6 rounded-2xl bg-white border border-purple-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  100-Shot Quantum Measurement Histogram
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  Fidelity: 100% Correlated
                </span>
              </div>

              {/* Bars */}
              <div className="space-y-3 font-mono">
                {/* 00 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">|00⟩ (Both Qubits measured 0)</span>
                    <span className="font-bold text-purple-700">{bellShots['00']}%</span>
                  </div>
                  <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-700"
                      style={{ width: `${bellShots['00']}%` }}
                    />
                  </div>
                </div>

                {/* 11 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">|11⟩ (Both Qubits measured 1)</span>
                    <span className="font-bold text-indigo-700">{bellShots['11']}%</span>
                  </div>
                  <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                      style={{ width: `${bellShots['11']}%` }}
                    />
                  </div>
                </div>

                {/* 01 */}
                <div className="space-y-1 opacity-40">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-500">|01⟩ (Mismatch)</span>
                    <span className="font-bold text-slate-500">0%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100"></div>
                </div>

                {/* 10 */}
                <div className="space-y-1 opacity-40">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-500">|10⟩ (Mismatch)</span>
                    <span className="font-bold text-slate-500">0%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100"></div>
                </div>
              </div>

              {/* Crucial Insight callout */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 leading-relaxed">
                ✨ <strong>Key Takeaway:</strong> Notice that <code className="bg-purple-100 px-1 py-0.5 rounded font-bold">|01⟩</code> and <code className="bg-purple-100 px-1 py-0.5 rounded font-bold">|10⟩</code> NEVER occur! Although each qubit is individually 50/50 random, they are 100% entangled. Knowing the state of <span className="font-mono font-bold">q₀</span> instantly dictates <span className="font-mono font-bold">q₁</span>.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
