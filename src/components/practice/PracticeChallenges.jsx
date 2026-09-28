import React, { useState } from 'react';
import { CHALLENGES } from '../../utils/quizData';
import { GATES, calculateCircuitState } from '../../utils/quantumEngine';
import { CheckCircle2, XCircle, RotateCcw, Award, Sparkles, ChevronRight, Play, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PracticeChallenges({ onCompleteChallenge, onNavigateToLab }) {
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [placedGates, setPlacedGates] = useState({
    q0: [null, null],
    q1: [null, null]
  });
  const [activeToolGate, setActiveToolGate] = useState('H');
  const [resultStatus, setResultStatus] = useState(null); // 'success' | 'fail' | null

  const activeChallenge = CHALLENGES[selectedChallengeIdx];

  const handlePlaceGate = (qubitKey, slotIdx) => {
    setPlacedGates(prev => {
      const copy = {
        q0: [...prev.q0],
        q1: [...prev.q1]
      };
      if (copy[qubitKey][slotIdx] === activeToolGate) {
        copy[qubitKey][slotIdx] = null;
        if (activeToolGate === 'CNOT') {
          copy.q0[slotIdx] = null;
          copy.q1[slotIdx] = null;
        }
      } else {
        if (activeToolGate === 'CNOT') {
          copy.q0[slotIdx] = 'CNOT';
          copy.q1[slotIdx] = 'CNOT';
        } else {
          copy[qubitKey][slotIdx] = activeToolGate;
        }
      }
      return copy;
    });
    setResultStatus(null);
  };

  const handleCheckCircuit = () => {
    // Evaluate current state
    const simCircuit = {
      q0: [placedGates.q0[0], placedGates.q0[1], null, null],
      q1: [placedGates.q1[0], placedGates.q1[1], null, null]
    };

    const state = calculateCircuitState(simCircuit);

    let isMatch = false;

    if (activeChallenge.targetState === 'SUPERPOSITION_Q0') {
      isMatch = state.circuitType === 'SUPERPOSITION_Q0';
    } else if (activeChallenge.targetState === 'BIT_FLIP_Q0') {
      isMatch = state.circuitType === 'BIT_FLIP_Q0';
    } else if (activeChallenge.targetState === 'BELL_PAIR') {
      isMatch = state.circuitType === 'BELL_PAIR';
    }

    if (isMatch) {
      setResultStatus('success');
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {}
      if (onCompleteChallenge) {
        onCompleteChallenge(activeChallenge.xp);
      }
    } else {
      setResultStatus('fail');
    }
  };

  const resetChallenge = () => {
    setPlacedGates({
      q0: [null, null],
      q1: [null, null]
    });
    setResultStatus(null);
  };

  return (
    <div className="space-y-6">
      {/* Challenge Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CHALLENGES.map((ch, idx) => {
          const isSelected = selectedChallengeIdx === idx;
          return (
            <button
              key={ch.id}
              onClick={() => {
                setSelectedChallengeIdx(idx);
                resetChallenge();
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-indigo-600 ring-2 ring-indigo-200 shadow-xs'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                <span className={ch.difficulty === 'Beginner' ? 'text-emerald-600' : 'text-purple-600'}>
                  {ch.difficulty}
                </span>
                <span className="text-indigo-600">+{ch.xp} QP</span>
              </div>
              <div className="text-xs font-bold text-slate-900 line-clamp-1">{ch.title}</div>
            </button>
          );
        })}
      </div>

      {/* Main Challenge Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase border border-indigo-100">
              Interactive Challenge
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{activeChallenge.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{activeChallenge.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Target XP:</span>
            <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs">
              +{activeChallenge.xp} QP
            </span>
          </div>
        </div>

        {/* Gate Palette for Challenge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-2">Available Gates:</span>
          {['H', 'X', 'Z', 'CNOT'].map(gId => {
            const gate = GATES[gId];
            const isSelected = activeToolGate === gId;
            return (
              <button
                key={gId}
                onClick={() => setActiveToolGate(gId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className={`w-5 h-5 rounded flex items-center justify-center text-white text-[11px] font-mono bg-gradient-to-br ${gate.color}`}>
                  {gate.symbol}
                </span>
                <span>{gate.name}</span>
              </button>
            );
          })}
        </div>

        {/* Wire Canvas for Challenge */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-inner space-y-8 relative">
          {/* Qubit 0 Line */}
          <div className="relative flex items-center">
            <div className="w-12 font-mono font-bold text-xs text-indigo-300">q₀ |0⟩</div>
            <div className="absolute left-12 right-0 h-0.5 bg-slate-700"></div>

            <div className="grid grid-cols-2 gap-6 flex-1 pl-4 z-10 max-w-sm">
              {[0, 1].map(slotIdx => {
                const gateId = placedGates.q0[slotIdx];
                return (
                  <div
                    key={`q0-ch-${slotIdx}`}
                    onClick={() => handlePlaceGate('q0', slotIdx)}
                    className="h-14 rounded-xl border border-dashed border-slate-600 hover:border-indigo-400 bg-slate-800/80 flex items-center justify-center cursor-pointer transition-all"
                  >
                    {gateId ? (
                      gateId === 'CNOT' ? (
                        <div className="w-4 h-4 rounded-full bg-purple-500 ring-4 ring-purple-500/30"></div>
                      ) : (
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm bg-gradient-to-br ${GATES[gateId]?.color}`}>
                          {GATES[gateId]?.symbol}
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-slate-600 font-mono">+ Place</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vertical CNOT bridge */}
          {placedGates.q0.map((g, idx) => {
            if (g === 'CNOT' && placedGates.q1[idx] === 'CNOT') {
              return (
                <div
                  key={`bridge-${idx}`}
                  className="absolute z-0 w-0.5 bg-purple-400 pointer-events-none"
                  style={{
                    left: `calc(3rem + 1rem + ${idx * 50}% + 25% - 1px)`,
                    top: '1.5rem',
                    bottom: '1.5rem'
                  }}
                />
              );
            }
            return null;
          })}

          {/* Qubit 1 Line */}
          <div className="relative flex items-center">
            <div className="w-12 font-mono font-bold text-xs text-purple-300">q₁ |0⟩</div>
            <div className="absolute left-12 right-0 h-0.5 bg-slate-700"></div>

            <div className="grid grid-cols-2 gap-6 flex-1 pl-4 z-10 max-w-sm">
              {[0, 1].map(slotIdx => {
                const gateId = placedGates.q1[slotIdx];
                return (
                  <div
                    key={`q1-ch-${slotIdx}`}
                    onClick={() => handlePlaceGate('q1', slotIdx)}
                    className="h-14 rounded-xl border border-dashed border-slate-600 hover:border-purple-400 bg-slate-800/80 flex items-center justify-center cursor-pointer transition-all"
                  >
                    {gateId ? (
                      gateId === 'CNOT' ? (
                        <div className="w-6 h-6 rounded-full border-2 border-purple-400 flex items-center justify-center font-bold text-xs text-purple-300">
                          ⊕
                        </div>
                      ) : (
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm bg-gradient-to-br ${GATES[gateId]?.color}`}>
                          {GATES[gateId]?.symbol}
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-slate-600 font-mono">+ Place</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Controls & Validation Feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCheckCircuit}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
            >
              Check Circuit
            </button>
            <button
              onClick={resetChallenge}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Reset Circuit"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            💡 <strong>Hint:</strong> {activeChallenge.hint}
          </div>
        </div>

        {/* Result Callout Banner */}
        {resultStatus === 'success' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-bold text-xs text-emerald-950">
                  🎉 Challenge Completed Successfully!
                </div>
                <div className="text-xs text-emerald-800">
                  You synthesized the exact quantum state. You earned +{activeChallenge.xp} QP!
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (selectedChallengeIdx < CHALLENGES.length - 1) {
                  setSelectedChallengeIdx(prev => prev + 1);
                  resetChallenge();
                }
              }}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer"
            >
              Next Challenge →
            </button>
          </div>
        )}

        {resultStatus === 'fail' && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-rose-600" />
              <div>
                <div className="font-bold text-xs text-rose-950">Circuit does not match goal.</div>
                <div className="text-xs text-rose-800">
                  Double check the gates applied or review the hint above.
                </div>
              </div>
            </div>
            <button
              onClick={resetChallenge}
              className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-700 font-semibold text-xs hover:bg-rose-100 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
