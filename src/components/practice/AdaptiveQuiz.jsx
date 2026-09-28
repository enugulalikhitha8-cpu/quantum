import React, { useState } from 'react';
import { QUIZ_QUESTIONS, INITIAL_MASTERY } from '../../utils/quizData';
import {
  Sparkles,
  Bot,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Cpu,
  TrendingUp,
  Brain,
  HelpCircle,
  Compass
} from 'lucide-react';

export default function AdaptiveQuiz({ onNavigateToLab, onOpenAITutor, onCompleteQuiz }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userHistory, setUserHistory] = useState({}); // { [qId]: { selectedId, isCorrect, attempts } }
  const [mastery, setMastery] = useState(INITIAL_MASTERY);
  const [showAnalysisScreen, setShowAnalysisScreen] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIdx];
  const selectedOption = currentQ.options.find(opt => opt.id === selectedOptionId);

  const handleSelectOption = (optId) => {
    if (hasSubmitted && selectedOption?.isCorrect) return; // already correct
    setSelectedOptionId(optId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId) return;
    setHasSubmitted(true);

    const isCorrect = selectedOption.isCorrect;
    const qId = currentQ.id;

    // Update history
    setUserHistory(prev => ({
      ...prev,
      [qId]: {
        selectedId: selectedOptionId,
        isCorrect,
        attempts: (prev[qId]?.attempts || 0) + 1
      }
    }));

    // Dynamically adjust mastery based on answer
    setMastery(prev => {
      const cat = currentQ.category;
      const currentVal = prev[cat] || 60;
      const delta = isCorrect ? +8 : -6;
      return {
        ...prev,
        [cat]: Math.min(100, Math.max(15, currentVal + delta))
      };
    });
  };

  const handleRetryQuestion = () => {
    setHasSubmitted(false);
    setSelectedOptionId(null);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setHasSubmitted(false);
      setSelectedOptionId(null);
    } else {
      setShowAnalysisScreen(true);
    }
  };

  // Misconception detection counts
  const totalAnswered = Object.keys(userHistory).length;
  const incorrectQuestions = Object.entries(userHistory).filter(([_, data]) => !data.isCorrect);

  return (
    <div className="space-y-6">
      {/* Quiz Dashboard Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-xl bg-purple-100 text-purple-700">
                <Brain className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">AI-Powered Adaptive Quiz System</h2>
            </div>
            <p className="text-xs text-slate-500">
              Not just a score: our diagnostic engine analyzes your specific misconceptions, explains the quantum intuition, and adapts practice.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAnalysisScreen(!showAnalysisScreen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold transition-colors cursor-pointer border border-purple-200/70"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{showAnalysisScreen ? 'Return to Questions' : 'View AI Diagnostics'}</span>
            </button>
          </div>
        </div>

        {/* Top Status & Concept Mastery Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
          {[
            { key: 'qubits', label: 'Qubits', icon: '✓', val: mastery.qubits, color: 'emerald' },
            { key: 'superposition', label: 'Superposition', icon: '✓', val: mastery.superposition, color: 'indigo' },
            { key: 'gates', label: 'Quantum Gates', icon: '◐', val: mastery.gates, color: 'amber' },
            { key: 'measurement', label: 'Measurement', icon: '✓', val: mastery.measurement, color: 'blue' },
            { key: 'entanglement', label: 'Entanglement', icon: '○', val: mastery.entanglement, color: 'purple' },
          ].map(item => (
            <div key={item.key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700 flex items-center gap-1">
                  <span className="font-bold text-indigo-600">{item.icon}</span>
                  {item.label}
                </span>
                <span className="font-mono text-slate-500 text-[11px]">{item.val}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    item.val > 75 ? 'bg-emerald-500' : item.val > 45 ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Experience: Either Questions Flow OR AI Analysis Screen */}
      {!showAnalysisScreen ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Question Card (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative">
              {/* Question progress pill */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                  Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length} • {currentQ.topic}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Loop: Question → Answer → Misconception Analysis → Retry
                </span>
              </div>

              {/* Prompt */}
              <h3 className="text-lg font-bold text-slate-900 leading-snug mb-4">
                {currentQ.prompt}
              </h3>

              {/* Circuit Display if question is circuit-based */}
              {currentQ.circuitDisplay && (
                <div className="my-5 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-center gap-4 shadow-inner">
                  <span className="font-mono font-bold text-cyan-400 text-sm">{currentQ.circuitDisplay.qubit} |0⟩ ───</span>
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 font-mono font-bold text-sm shadow-md">
                      H
                    </span>
                    <span className="font-mono text-slate-400">───</span>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 font-mono font-bold text-xs text-slate-300">
                      Measure ∿
                    </span>
                    <span className="font-mono text-cyan-400">─── ?</span>
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="space-y-3 my-6">
                {currentQ.options.map(option => {
                  const isSelected = selectedOptionId === option.id;
                  let optionStyles = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80';

                  if (isSelected && !hasSubmitted) {
                    optionStyles = 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-200';
                  } else if (hasSubmitted) {
                    if (isSelected && option.isCorrect) {
                      optionStyles = 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-200';
                    } else if (isSelected && !option.isCorrect) {
                      optionStyles = 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-200';
                    } else if (option.isCorrect) {
                      optionStyles = 'border-emerald-300 bg-emerald-50/40';
                    }
                  }

                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`p-4 rounded-2xl border text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${optionStyles}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {option.id}
                        </span>
                        <span className="text-slate-800">{option.label}</span>
                      </div>

                      {hasSubmitted && isSelected && (
                        <span>
                          {option.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={onOpenAITutor}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>Ask AI Tutor for a clue</span>
                </button>

                <div className="flex items-center gap-2">
                  {!hasSubmitted ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={!selectedOptionId}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <>
                      {!selectedOption?.isCorrect && (
                        <button
                          onClick={handleRetryQuestion}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Try Again</span>
                        </button>
                      )}
                      <button
                        onClick={handleNextQuestion}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        <span>{currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View AI Analysis'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mistake Diagnostic & AI Explanation Card (Appears after submission) */}
            {hasSubmitted && selectedOption && (
              <div className={`p-6 rounded-3xl border shadow-xs transition-all duration-300 ${
                selectedOption.isCorrect
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60 border-rose-200'
              }`}>
                {!selectedOption.isCorrect ? (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs shrink-0">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-rose-950">
                          ✕ Let's understand the mistake.
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          The Fullerenes AI diagnostic engine identified the root misconception behind your choice.
                        </p>
                      </div>
                    </div>

                    {/* Misconception Badge */}
                    {selectedOption.misconception && (
                      <div className="p-3 rounded-2xl bg-white border border-rose-200/90 shadow-2xs space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Misconception Detected:
                        </div>
                        <div className="text-xs font-semibold text-slate-800">
                          {selectedOption.misconception}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium pt-1">
                          Concept to Review: <span className="font-semibold text-indigo-700">{selectedOption.conceptToReview}</span>
                        </div>
                      </div>
                    )}

                    {/* AI Explanation speech bubble */}
                    <div className="p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-2xs">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        <span className="text-xs font-bold text-indigo-950">AI Tutor Explanation:</span>
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                        {selectedOption.aiFeedback}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {selectedOption.suggestedAction && (
                        <button
                          onClick={() => {
                            if (selectedOption.suggestedAction.tab === 'lab') {
                              onNavigateToLab(selectedOption.suggestedAction.preset);
                            } else {
                              onOpenAITutor();
                            }
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                        >
                          <Cpu className="w-3.5 h-3.5" />
                          <span>{selectedOption.suggestedAction.label}</span>
                        </button>
                      )}
                      <button
                        onClick={handleRetryQuestion}
                        className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                      </button>
                      <button
                        onClick={onOpenAITutor}
                        className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200/70 cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Deep Dive with AI</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-emerald-950">
                          ✓ Correct! Concept Mastered
                        </h4>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Your reasoning aligns with standard quantum mechanics principles.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/90 border border-emerald-100 shadow-2xs text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {selectedOption.aiFeedback}
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <button
                        onClick={handleNextQuestion}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        <span>Continue Learning</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Recommendation & Adaptive Insights (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Recommended for you card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recommended For You
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  Adaptive AI
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/70 border border-indigo-100">
                <h4 className="text-sm font-bold text-indigo-950">
                  Practice: Hadamard Gate & Superposition
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Focus on how the H gate creates non-deterministic 50/50 measurement probabilities, contrasting with the Pauli-X bit flip.
                </p>
                <button
                  onClick={() => onNavigateToLab('superposition')}
                  className="mt-3 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer text-center block"
                >
                  Start Guided Practice Lab →
                </button>
              </div>

              {/* Learning Philosophy loop box */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                  The Fullerenes Adaptive Loop:
                </div>
                <div className="flex flex-col gap-1 text-[11px] font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[9px]">1</span>
                    <span>Solve real quantum puzzles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[9px]">2</span>
                    <span>AI pinpoints exact misconceptions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[9px]">3</span>
                    <span>Test and visualize in Quantum Lab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[9px]">4</span>
                    <span>Reach certified quantum mastery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contextual AI Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-bold text-slate-800">Need Instant Clarification?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                The AI Tutor is synced with Question {currentQuestionIdx + 1}. Ask anything about gates or probabilities.
              </p>
              <button
                onClick={onOpenAITutor}
                className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200/70 transition-colors cursor-pointer text-center"
              >
                Summon AI Tutor
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* AI Learning Analysis Screen */
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
                Comprehensive Diagnostic Report
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                YOUR AI LEARNING ANALYSIS
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Synthesized from your interactive sessions, quiz selections, and quantum circuit trials.
              </p>
            </div>
            <button
              onClick={() => setShowAnalysisScreen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              Back to Quiz
            </button>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strong Concepts */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Strong Concepts (Mastered)</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span><strong>Qubit basics:</strong> Clear comprehension of |0⟩ and |1⟩ state vector coordinates.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span><strong>Measurement Collapse:</strong> Strong intuition regarding projective measurement and the Born Rule.</span>
                </li>
              </ul>
            </div>

            {/* Needs Attention */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Needs Attention (Misconceptions Detected)</span>
              </div>
              <ul className="space-y-2 text-xs text-amber-950 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span><strong>Hadamard Gate vs Pauli-X:</strong> Occasional tendency to treat H as a bit flip rather than an equal superposition rotator.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span><strong>Bell Pair Entanglement:</strong> Believing entangled outcomes remain independent coin flips rather than 100% correlated states.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* AI Recommendation Speech Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100 flex items-start gap-4">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-indigo-950">AI Personalized Recommendation:</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                "You are showing remarkable intuition with state vectors and measurement collapse! However, your selections indicate you are occasionally confusing the distinct roles of the <strong>Pauli-X</strong> and <strong>Hadamard (H)</strong> gates. Before diving deeper into multi-qubit entanglement, I recommend running the interactive comparison in the Quantum Lab."
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => onNavigateToLab('superposition')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Practice X vs H in Lab →
                </button>
                <button
                  onClick={() => onNavigateToLab('bell_pair')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Explore Bell Pair Entanglement →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
