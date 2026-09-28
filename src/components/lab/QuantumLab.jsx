import React, { useState, useEffect } from 'react';
import { GATES, PRESET_CIRCUITS, calculateCircuitState, generateMeasurementShots } from '../../utils/quantumEngine';
import BlochSphere from './BlochSphere';
import MatrixLab from './MatrixLab';
import {
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Trash2,
  ChevronRight,
  BarChart2,
  Layers,
  Cpu,
  Bot,
  Activity,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function QuantumLab({ onOpenAITutor, initialPreset = null }) {
  // Tabs: 'circuit' | 'matrix' | 'bloch' | 'results'
  const [activeTab, setActiveTab] = useState('circuit');

  // Circuit layout: 2 qubits, 4 time steps each
  const [circuit, setCircuit] = useState({
    q0: ['H', 'CNOT', null, 'MEASURE'],
    q1: [null, 'CNOT', null, 'MEASURE']
  });

  const [selectedToolGate, setSelectedToolGate] = useState('H');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [simulatedShots, setSimulatedShots] = useState(null);

  // Initialize with initialPreset if passed
  useEffect(() => {
    if (initialPreset) {
      const presetObj = PRESET_CIRCUITS.find(p => p.id === initialPreset);
      if (presetObj) {
        setCircuit(JSON.parse(JSON.stringify(presetObj.circuit)));
      }
    }
  }, [initialPreset]);

  // Recalculate quantum state whenever circuit changes
  const quantumState = calculateCircuitState(circuit);

  // Auto-generate shots when state changes
  useEffect(() => {
    setSimulatedShots(generateMeasurementShots(quantumState.probabilities, 1024));
  }, [circuit]);

  // Handle clicking a wire slot
  const handleSlotClick = (qubitKey, slotIdx) => {
    setCircuit(prev => {
      const newCircuit = {
        q0: [...prev.q0],
        q1: [...prev.q1]
      };

      const existingGate = newCircuit[qubitKey][slotIdx];

      // If clicked with same gate, remove it
      if (existingGate === selectedToolGate) {
        newCircuit[qubitKey][slotIdx] = null;
        if (existingGate === 'CNOT') {
          newCircuit.q0[slotIdx] = null;
          newCircuit.q1[slotIdx] = null;
        }
        return newCircuit;
      }

      // If placing CNOT, place across both wires
      if (selectedToolGate === 'CNOT') {
        newCircuit.q0[slotIdx] = 'CNOT';
        newCircuit.q1[slotIdx] = 'CNOT';
        return newCircuit;
      }

      // Otherwise place single qubit gate
      newCircuit[qubitKey][slotIdx] = selectedToolGate;
      return newCircuit;
    });
  };

  const removeGate = (qubitKey, slotIdx, e) => {
    e.stopPropagation();
    setCircuit(prev => {
      const newCircuit = {
        q0: [...prev.q0],
        q1: [...prev.q1]
      };
      if (newCircuit[qubitKey][slotIdx] === 'CNOT') {
        newCircuit.q0[slotIdx] = null;
        newCircuit.q1[slotIdx] = null;
      } else {
        newCircuit[qubitKey][slotIdx] = null;
      }
      return newCircuit;
    });
  };

  const clearCircuit = () => {
    setCircuit({
      q0: [null, null, null, null],
      q1: [null, null, null, null]
    });
    setCurrentStepIndex(-1);
  };

  const loadPreset = (presetId) => {
    const p = PRESET_CIRCUITS.find(item => item.id === presetId);
    if (p) {
      setCircuit(JSON.parse(JSON.stringify(p.circuit)));
      setCurrentStepIndex(-1);
    }
  };

  const runSimulation = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex(curr => {
        if (curr >= 3) {
          clearInterval(stepInterval);
          setIsRunning(false);
          setSimulatedShots(generateMeasurementShots(quantumState.probabilities, 1024));
          return 3;
        }
        return curr + 1;
      });
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Multi-View Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Quantum Circuit Lab</h2>
              <p className="text-xs text-slate-500">
                Visual circuit workspace with synchronized Matrix, Bloch Sphere, and Probability representations.
              </p>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 self-stretch sm:self-auto">
          {[
            { id: 'circuit', label: 'Circuit Canvas', icon: Cpu },
            { id: 'matrix', label: 'Matrix Lab', icon: Layers },
            { id: 'bloch', label: 'Bloch Spheres', icon: Activity },
            { id: 'results', label: 'Shot Results', icon: BarChart2 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'circuit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Toolbox (Gates & Controls) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Gate Palette */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Quantum Gate Toolbox
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Select a gate below, then click any empty slot on the circuit wires:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {Object.values(GATES).map(gate => {
                  const isSelected = selectedToolGate === gate.id;
                  return (
                    <button
                      key={gate.id}
                      onClick={() => setSelectedToolGate(gate.id)}
                      className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm text-white shadow-xs bg-gradient-to-br ${gate.color} mb-1.5`}>
                        {gate.symbol}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{gate.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{gate.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Quick Presets
              </h3>
              <div className="space-y-1.5">
                {PRESET_CIRCUITS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset.id)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-150 hover:border-indigo-200 hover:bg-indigo-50/40 text-xs font-medium text-slate-700 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{preset.title}</div>
                      <div className="text-[10px] text-slate-400">{preset.subtitle}</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Canvas (Circuit Wire Grid) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-800">Quantum Circuit Canvas</span>
                  <span className="text-[11px] font-mono text-slate-400">|ψ₀⟩ = |00⟩</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={runSimulation}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs hover:shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isRunning ? 'Simulating...' : 'Run Circuit'}</span>
                  </button>
                  <button
                    onClick={clearCircuit}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    title="Clear Circuit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quantum Wire Board */}
              <div className="relative py-6 px-4 rounded-2xl bg-slate-900 text-white shadow-inner overflow-hidden">
                {/* Time Step Markers */}
                <div className="grid grid-cols-4 gap-4 mb-4 text-center">
                  {[0, 1, 2, 3].map(step => (
                    <div
                      key={step}
                      className={`text-[10px] font-mono font-bold tracking-wider uppercase transition-colors ${
                        currentStepIndex === step
                          ? 'text-cyan-400 font-extrabold underline'
                          : 'text-slate-500'
                      }`}
                    >
                      Step t{step + 1}
                    </div>
                  ))}
                </div>

                {/* Laser scan line when running */}
                {isRunning && (
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_16px_#22d3ee] z-20 pointer-events-none transition-all duration-300"
                    style={{ left: `${(currentStepIndex + 0.5) * 25}%` }}
                  />
                )}

                {/* Wires container */}
                <div className="space-y-12 my-4 relative">
                  {/* Qubit 0 Line */}
                  <div className="relative flex items-center">
                    {/* Qubit Label */}
                    <div className="w-12 font-mono font-bold text-xs text-indigo-300 flex items-center gap-1">
                      <span>q₀</span>
                      <span className="text-slate-500 text-[10px]">|0⟩</span>
                    </div>

                    {/* Horizontal Wire Line */}
                    <div className="absolute left-12 right-0 h-0.5 bg-slate-700"></div>

                    {/* Slots */}
                    <div className="grid grid-cols-4 gap-4 flex-1 pl-4 z-10">
                      {circuit.q0.map((gateId, idx) => (
                        <div
                          key={`q0-${idx}`}
                          onClick={() => handleSlotClick('q0', idx)}
                          className={`relative h-14 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                            gateId
                              ? 'border-indigo-400 bg-slate-800/90 shadow-md group'
                              : 'border-dashed border-slate-700/80 hover:border-indigo-400/80 hover:bg-slate-800/40'
                          }`}
                        >
                          {gateId ? (
                            gateId === 'CNOT' ? (
                              <div className="flex flex-col items-center">
                                {/* Control dot for CNOT on q0 */}
                                <div className="w-4 h-4 rounded-full bg-purple-500 ring-4 ring-purple-500/30"></div>
                                <span className="text-[9px] font-mono text-purple-300 mt-1">Control</span>
                                <button
                                  onClick={(e) => removeGate('q0', idx, e)}
                                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] hidden group-hover:flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm bg-gradient-to-br ${GATES[gateId]?.color || 'from-indigo-500 to-purple-600'}`}>
                                  {GATES[gateId]?.symbol || gateId}
                                </span>
                                <button
                                  onClick={(e) => removeGate('q0', idx, e)}
                                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] hidden group-hover:flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          ) : (
                            <span className="text-[10px] font-mono text-slate-600">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vertical CNOT entanglement bridges */}
                  {circuit.q0.map((gateId, idx) => {
                    if (gateId === 'CNOT' && circuit.q1[idx] === 'CNOT') {
                      return (
                        <div
                          key={`cnot-bridge-${idx}`}
                          className="absolute z-0 w-0.5 bg-gradient-to-b from-purple-400 to-indigo-400 pointer-events-none"
                          style={{
                            left: `calc(3rem + 1rem + ${idx * 25}% + 12.5% - 1px)`,
                            top: '1.75rem',
                            bottom: '1.75rem'
                          }}
                        ></div>
                      );
                    }
                    return null;
                  })}

                  {/* Qubit 1 Line */}
                  <div className="relative flex items-center">
                    {/* Qubit Label */}
                    <div className="w-12 font-mono font-bold text-xs text-purple-300 flex items-center gap-1">
                      <span>q₁</span>
                      <span className="text-slate-500 text-[10px]">|0⟩</span>
                    </div>

                    {/* Horizontal Wire Line */}
                    <div className="absolute left-12 right-0 h-0.5 bg-slate-700"></div>

                    {/* Slots */}
                    <div className="grid grid-cols-4 gap-4 flex-1 pl-4 z-10">
                      {circuit.q1.map((gateId, idx) => (
                        <div
                          key={`q1-${idx}`}
                          onClick={() => handleSlotClick('q1', idx)}
                          className={`relative h-14 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                            gateId
                              ? 'border-purple-400 bg-slate-800/90 shadow-md group'
                              : 'border-dashed border-slate-700/80 hover:border-purple-400/80 hover:bg-slate-800/40'
                          }`}
                        >
                          {gateId ? (
                            gateId === 'CNOT' ? (
                              <div className="flex flex-col items-center">
                                {/* Target symbol (circle with plus) for CNOT on q1 */}
                                <div className="w-6 h-6 rounded-full border-2 border-purple-400 flex items-center justify-center font-bold text-xs text-purple-300">
                                  ⊕
                                </div>
                                <span className="text-[9px] font-mono text-purple-300 mt-1">Target</span>
                                <button
                                  onClick={(e) => removeGate('q1', idx, e)}
                                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] hidden group-hover:flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm bg-gradient-to-br ${GATES[gateId]?.color || 'from-indigo-500 to-purple-600'}`}>
                                  {GATES[gateId]?.symbol || gateId}
                                </span>
                                <button
                                  onClick={(e) => removeGate('q1', idx, e)}
                                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] hidden group-hover:flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          ) : (
                            <span className="text-[10px] font-mono text-slate-600">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] text-slate-400">
                  Tip: Click a slot to place the active gate (<span className="text-cyan-300 font-bold">{selectedToolGate}</span>). Hover and click '×' to remove.
                </div>
              </div>

              {/* Contextual AI Feedback bar right under canvas */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950">
                      Circuit State Analysis: {quantumState.title}
                    </span>
                    <button
                      onClick={onOpenAITutor}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ask AI Tutor</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {quantumState.explanation}
                  </p>
                  <div className="mt-2 text-xs font-mono font-bold text-indigo-800 bg-white/80 px-2.5 py-1 rounded-lg inline-block border border-indigo-100">
                    |ψ⟩ = {quantumState.stateVectorStr}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live State Panel (Synchronized Live State) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Live State Probabilities */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live State Amplitudes
                </h3>
                {quantumState.isEntangled && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700 animate-pulse">
                    Entangled
                  </span>
                )}
              </div>

              {/* Basis State Probability Bars */}
              <div className="space-y-3">
                {[
                  { state: '00', label: '|00⟩', color: 'bg-indigo-600' },
                  { state: '01', label: '|01⟩', color: 'bg-blue-500' },
                  { state: '10', label: '|10⟩', color: 'bg-purple-600' },
                  { state: '11', label: '|11⟩', color: 'bg-emerald-600' }
                ].map(({ state, label, color }) => {
                  const prob = quantumState.probabilities[state] || 0;
                  const pct = (prob * 100).toFixed(1);
                  return (
                    <div key={state} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-slate-800">{label}</span>
                        <span className="font-semibold text-slate-600">{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Correlation Notice for Bell Pair */}
              {quantumState.circuitType === 'BELL_PAIR' && (
                <div className="mt-4 p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-[11px] text-purple-900 leading-snug">
                  ✨ <strong>Perfect Correlation:</strong> |01⟩ and |10⟩ have 0% probability. Measuring q₀ as 0 guarantees q₁ is 0; measuring q₀ as 1 guarantees q₁ is 1.
                </div>
              )}
            </div>

            {/* Compact Bloch Preview */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold text-slate-700">Qubit 0 State Vector</span>
                <button
                  onClick={() => setActiveTab('bloch')}
                  className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Expand 3D View →
                </button>
              </div>
              <BlochSphere
                theta={quantumState.blochQ0.theta}
                phi={quantumState.blochQ0.phi}
                label="q0"
                interactive={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Matrix Lab Tab */}
      {activeTab === 'matrix' && (
        <MatrixLab
          selectedGateId={selectedToolGate}
          onSelectGate={(gateId) => setSelectedToolGate(gateId)}
        />
      )}

      {/* Bloch Spheres Tab */}
      {activeTab === 'bloch' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>
                <strong>Bloch Sphere Representation:</strong> The surface of a unit sphere represents all possible pure states of a 2-level quantum system.
              </span>
            </div>
            <span className="font-mono font-bold text-indigo-700">|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BlochSphere
              theta={quantumState.blochQ0.theta}
              phi={quantumState.blochQ0.phi}
              label="Qubit 0"
              interactive={true}
            />
            <BlochSphere
              theta={quantumState.blochQ1.theta}
              phi={quantumState.blochQ1.phi}
              label="Qubit 1"
              interactive={true}
            />
          </div>
        </div>
      )}

      {/* Results Tab (Simulated Shots) */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Quantum Measurement Distribution</h3>
              <p className="text-xs text-slate-500">
                1024 Simulated shots on realistic quantum hardware with measurement projection.
              </p>
            </div>
            <button
              onClick={() => setSimulatedShots(generateMeasurementShots(quantumState.probabilities, 1024))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resample 1024 Shots</span>
            </button>
          </div>

          {/* Histogram Bars */}
          <div className="grid grid-cols-4 gap-4 h-64 items-end pt-8 px-6 bg-slate-50 rounded-2xl border border-slate-200/70">
            {['00', '01', '10', '11'].map(state => {
              const count = simulatedShots ? simulatedShots[state] : 0;
              const heightPct = ((count / 1024) * 100).toFixed(1);
              return (
                <div key={state} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-xs font-mono font-bold text-slate-700 mb-1 group-hover:text-indigo-600 transition-colors">
                    {count} shots ({heightPct}%)
                  </span>
                  <div className="w-full max-w-[80px] bg-slate-200 rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-xl transition-all duration-700 shadow-md group-hover:from-indigo-500 group-hover:to-purple-400"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-900 mt-2 px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs">
                    |{state}⟩
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Total Sample Size</span>
              <div className="text-base font-bold text-slate-800 mt-0.5">1,024 Shots</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Quantum State Fidelity</span>
              <div className="text-base font-bold text-emerald-600 mt-0.5">99.8% (Simulated)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Current Pattern</span>
              <div className="text-base font-bold text-indigo-700 mt-0.5">{quantumState.title}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
