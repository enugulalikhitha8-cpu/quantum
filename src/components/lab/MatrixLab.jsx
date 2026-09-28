import React, { useState } from 'react';
import { GATES } from '../../utils/quantumEngine';
import { Play, ArrowRight, Sparkles, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export default function MatrixLab({ selectedGateId = 'H', onSelectGate }) {
  const [activeGate, setActiveGate] = useState(selectedGateId || 'H');
  const [inputState, setInputState] = useState('|0⟩'); // '|0⟩' or '|1⟩'
  const [isMultiplying, setIsMultiplying] = useState(false);

  const gateInfo = GATES[activeGate] || GATES.H;

  // Compute transformation for single qubit gates
  let inputVector = inputState === '|0⟩' ? [1, 0] : [0, 1];
  let outputVector = [1, 0];
  let outputNotation = '|0⟩';
  let calculationSteps = [];

  if (activeGate === 'H') {
    if (inputState === '|0⟩') {
      outputVector = [1 / Math.SQRT2, 1 / Math.SQRT2];
      outputNotation = '(|0⟩ + |1⟩)/√2 (Equal Superposition |+⟩)';
      calculationSteps = [
        'Row 1: (1/√2 × 1) + (1/√2 × 0) = 1/√2 ≈ 0.707',
        'Row 2: (1/√2 × 1) + (-1/√2 × 0) = 1/√2 ≈ 0.707'
      ];
    } else {
      outputVector = [1 / Math.SQRT2, -1 / Math.SQRT2];
      outputNotation = '(|0⟩ - |1⟩)/√2 (Phase Superposition |−⟩)';
      calculationSteps = [
        'Row 1: (1/√2 × 0) + (1/√2 × 1) = 1/√2 ≈ 0.707',
        'Row 2: (1/√2 × 0) + (-1/√2 × 1) = -1/√2 ≈ -0.707'
      ];
    }
  } else if (activeGate === 'X') {
    if (inputState === '|0⟩') {
      outputVector = [0, 1];
      outputNotation = '|1⟩ (Excited / Flipped State)';
      calculationSteps = [
        'Row 1: (0 × 1) + (1 × 0) = 0',
        'Row 2: (1 × 1) + (0 × 0) = 1'
      ];
    } else {
      outputVector = [1, 0];
      outputNotation = '|0⟩ (Ground State)';
      calculationSteps = [
        'Row 1: (0 × 0) + (1 × 1) = 1',
        'Row 2: (1 × 0) + (0 × 1) = 0'
      ];
    }
  } else if (activeGate === 'Z') {
    if (inputState === '|0⟩') {
      outputVector = [1, 0];
      outputNotation = '|0⟩ (Unchanged Phase)';
      calculationSteps = [
        'Row 1: (1 × 1) + (0 × 0) = 1',
        'Row 2: (0 × 1) + (-1 × 0) = 0'
      ];
    } else {
      outputVector = [0, -1];
      outputNotation = '-|1⟩ (Phase Inverted by 180°)';
      calculationSteps = [
        'Row 1: (1 × 0) + (0 × 1) = 0',
        'Row 2: (0 × 0) + (-1 × 1) = -1'
      ];
    }
  } else if (activeGate === 'CNOT') {
    outputNotation = 'Entangles 2 qubits: Flips target if control is |1⟩';
    calculationSteps = [
      '4×4 Unitary permutation matrix acting on |q0 q1⟩ basis vector',
      'Transforms basis: |00⟩→|00⟩, |01⟩→|01⟩, |10⟩→|11⟩, |11⟩→|10⟩'
    ];
  }

  const triggerAnimation = () => {
    setIsMultiplying(true);
    setTimeout(() => setIsMultiplying(false), 900);
  };

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-600 text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h3 className="font-bold text-sm text-indigo-950">Visual Matrix Laboratory</h3>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            "Math is introduced visually when the learner is ready." See how unitary matrices transform quantum vectors.
          </p>
        </div>

        {/* Gate selector pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          {['H', 'X', 'Z', 'CNOT'].map((gId) => (
            <button
              key={gId}
              onClick={() => {
                setActiveGate(gId);
                if (onSelectGate) onSelectGate(gId);
                triggerAnimation();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeGate === gId
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {gId} Gate
            </button>
          ))}
        </div>
      </div>

      {/* Main visual pipeline: Input State -> Gate Matrix -> Output State */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              State Vector Transformation: {gateInfo.name} ({gateInfo.symbol})
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">{gateInfo.description}</p>
          </div>

          {activeGate !== 'CNOT' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Initial State:</span>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                <button
                  onClick={() => { setInputState('|0⟩'); triggerAnimation(); }}
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
                    inputState === '|0⟩'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  |0⟩
                </button>
                <button
                  onClick={() => { setInputState('|1⟩'); triggerAnimation(); }}
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
                    inputState === '|1⟩'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  |1⟩
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Visual Transformation Flow Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          {/* Step 1: Input Vector */}
          <div className="lg:col-span-3 flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              1. Input Vector (|ψ_in⟩)
            </span>
            <div className="flex items-center gap-2 my-2">
              <span className="text-sm font-mono font-bold text-slate-700">{inputState} =</span>
              {/* Matrix Vector Bracket */}
              <div className="flex items-center">
                <span className="text-3xl font-light text-slate-400 select-none">[</span>
                <div className="flex flex-col text-center px-2 font-mono font-bold text-slate-800 text-sm gap-2">
                  <span className={inputState === '|0⟩' ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}>
                    {inputVector[0]}
                  </span>
                  <span className={inputState === '|1⟩' ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}>
                    {inputVector[1]}
                  </span>
                </div>
                <span className="text-3xl font-light text-slate-400 select-none">]</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {inputState === '|0⟩' ? '100% Probability |0⟩' : '100% Probability |1⟩'}
            </span>
          </div>

          {/* Multiplication Operator */}
          <div className="lg:col-span-1 flex justify-center text-slate-400 font-bold text-xl">
            ×
          </div>

          {/* Step 2: Gate Unitary Matrix */}
          <div className={`lg:col-span-3 flex flex-col items-center p-4 rounded-xl border transition-all ${
            isMultiplying
              ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200 scale-105'
              : 'bg-indigo-50/40 border-indigo-100'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              2. {gateInfo.name} Matrix ({gateInfo.symbol})
            </span>
            <div className="flex items-center my-2">
              <span className="text-4xl font-light text-indigo-400 select-none">[</span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-3 font-mono font-bold text-slate-900 text-sm text-center">
                {gateInfo.matrix.slice(0, 2).map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <span
                      key={`${rIdx}-${cIdx}`}
                      className="px-2 py-1 rounded bg-white border border-indigo-100 shadow-2xs"
                    >
                      {cell}
                    </span>
                  ))
                )}
              </div>
              <span className="text-4xl font-light text-indigo-400 select-none">]</span>
            </div>
            <span className="text-[10px] text-indigo-600 font-semibold">
              Unitary Operator (U†U = I)
            </span>
          </div>

          {/* Equals Operator */}
          <div className="lg:col-span-1 flex justify-center text-indigo-500">
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </div>

          {/* Step 3: Resulting State */}
          <div className="lg:col-span-3 flex flex-col items-center p-4 rounded-xl bg-purple-50/50 border border-purple-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 mb-2">
              3. Transformed State (|ψ_out⟩)
            </span>
            <div className="flex items-center gap-2 my-2">
              <div className="flex items-center">
                <span className="text-3xl font-light text-purple-400 select-none">[</span>
                <div className="flex flex-col text-center px-2 font-mono font-bold text-purple-900 text-sm gap-2">
                  <span className="text-purple-700 font-extrabold">
                    {outputVector[0] === 0 ? '0' : outputVector[0] > 0 ? (outputVector[0] === 1 ? '1' : '1/√2') : '-1/√2'}
                  </span>
                  <span className="text-purple-700 font-extrabold">
                    {outputVector[1] === 0 ? '0' : outputVector[1] > 0 ? (outputVector[1] === 1 ? '1' : '1/√2') : '-1/√2'}
                  </span>
                </div>
                <span className="text-3xl font-light text-purple-400 select-none">]</span>
              </div>
            </div>
            <div className="text-center px-2 py-1 rounded bg-white border border-purple-100 shadow-2xs text-xs font-mono font-bold text-purple-900">
              {outputNotation}
            </div>
          </div>
        </div>

        {/* Calculation breakdown */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
          <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Step-by-Step Matrix Vector Multiplication:
          </div>
          <div className="font-mono text-slate-600 space-y-1 mt-2 pl-5 list-disc">
            {calculationSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
