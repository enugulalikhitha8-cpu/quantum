import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function AITutorModal({
  isOpen,
  onClose,
  activeContext = 'lab', // 'lab' | 'quiz' | 'lesson' | 'general'
  contextDetails = null, // e.g. current circuit pattern or quiz question
  onLoadPreset
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello Alex! I'm your quantum tutor at Fullerenes. I'm actively observing your circuit canvas, quiz responses, and state vector simulations. How can I help you understand this quantum phenomenon?",
      time: 'Just now',
      suggestedChips: [
        'Why did H create superposition?',
        'Why are the qubits correlated?',
        'Show me the matrix math',
        'Give me a challenge'
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Contextual initial message based on active context
  useEffect(() => {
    if (activeContext === 'lab') {
      const circuitTitle = contextDetails?.circuitTitle || 'Current Circuit';
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'ai',
          text: `I notice you're working on: **${circuitTitle}**. Ask me why this circuit evolves into this probability distribution, or test edge cases!`,
          time: 'Just now',
          suggestedChips: [
            'Explain the Bell Pair correlation',
            'Why did H create superposition?',
            'What happens if I place X before H?',
            'Show me the math'
          ]
        }
      ]);
    }
  }, [activeContext]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Context-aware smart response generator
    setTimeout(() => {
      let aiResponseText = '';
      let nextChips = [];

      const lower = query.toLowerCase();

      if (lower.includes('h create superposition') || lower.includes('hadamard')) {
        aiResponseText = `The **Hadamard (H)** gate creates superposition by applying a 45° rotation followed by a reflection on the Bloch sphere.\n\nMathematically, it transforms the computational basis:\n• |0⟩ ➔ (|0⟩ + |1⟩)/√2 = |+⟩\n• |1⟩ ➔ (|0⟩ - |1⟩)/√2 = |−⟩\n\nBecause the amplitude for |0⟩ and |1⟩ is identical (1/√2), squaring them according to the Born Rule yields:\n|1/√2|² = 1/2 = **50% probability each!**`;
        nextChips = ['Show me the matrix math', 'What happens if I apply H twice?', 'Why are qubits correlated?'];
      } else if (lower.includes('correlated') || lower.includes('bell') || lower.includes('entangle')) {
        aiResponseText = `In a Bell state like **(|00⟩ + |11⟩)/√2**, the two qubits share a joint non-separable state.\n\nNotice that the terms |01⟩ and |10⟩ have ZERO amplitude! That means:\n1. If qubit 0 collapses to 0, qubit 1 MUST be 0.\n2. If qubit 0 collapses to 1, qubit 1 MUST be 1.\n\nEven though each qubit individually looks like a 50/50 random coin flip, their outcomes match with 100% fidelity.`;
        nextChips = ['Why did H create superposition?', 'Give me a challenge', 'Can entanglement transmit signals faster than light?'];
      } else if (lower.includes('math') || lower.includes('matrix')) {
        aiResponseText = `Here is the Unitary Matrix formulation:\n\n**Hadamard Gate:**\nH = (1/√2) * [[ 1,  1 ],\n                 [ 1, -1 ]]\n\nApplying H to |0⟩ = [1, 0]ᵀ:\n(1/√2) * [[ 1,  1 ], [ 1, -1 ]] * [1, 0]ᵀ = [ 1/√2, 1/√2 ]ᵀ\n\nNotice the rows dictate the linear combination of amplitudes! You can also click the **Matrix Lab** tab to see this multiplied dynamically.`;
        nextChips = ['What about the CNOT matrix?', 'Why is matrix order important?', 'Analyze my current circuit'];
      } else if (lower.includes('challenge')) {
        aiResponseText = `Here is a quantum challenge for you:\n\n**Goal: Produce the |−⟩ state!**\nHow can you transform the ground state |0⟩ into (|0⟩ - |1⟩)/√2?\n\n*Hint: You will need both the Pauli-X gate and the Hadamard gate, but order matters!*`;
        nextChips = ['I placed X then H', 'Why does order matter?', 'Check in Lab'];
      } else if (lower.includes('order') || lower.includes('x before h') || lower.includes('commute')) {
        aiResponseText = `Great question! In quantum computing, gates are matrices, and **matrices do NOT commute** (A × B ≠ B × A).\n\n• Circuit 1: |0⟩ ➔ [X] ➔ |1⟩ ➔ [H] ➔ **(|0⟩ - |1⟩)/√2 = |−⟩**\n• Circuit 2: |0⟩ ➔ [H] ➔ (|+⟩) ➔ [X] ➔ **(|1⟩ + |0⟩)/√2 = |+⟩**\n\nNotice that X before H adds a 180° negative phase to |1⟩. That minus sign causes destructive quantum interference in algorithms!`;
        nextChips = ['Show me the matrix math', 'Explain Bell pair correlation', 'Give me a challenge'];
      } else if (lower.includes('wrong') || lower.includes('misconception') || lower.includes('quiz')) {
        aiResponseText = `In the adaptive quiz, the most frequent misconception is confusing the **Pauli-X** gate with the **Hadamard (H)** gate.\n\n• **X gate** is a deterministic bit-flip: it swaps 0 and 1 with 100% certainty (like a classical NOT gate).\n• **H gate** creates a true quantum superposition: it creates a 50/50 probabilistic blend of 0 and 1.`;
        nextChips = ['Why did H create superposition?', 'Show me the math', 'Open Practice'];
      } else {
        aiResponseText = `That's an insightful quantum question! At Fullerenes, we visualize how abstract mathematics translates into physical probabilities.\n\nEvery quantum state is a normalized unit vector in Hilbert space. Applying gates corresponds to rotating that vector on the Bloch sphere, changing the likelihood of what classical detector records during measurement.`;
        nextChips = ['Why did H create superposition?', 'Why are qubits correlated?', 'Show me the matrix math'];
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiResponseText,
          time: 'Just now',
          suggestedChips: nextChips
        }
      ]);
      setIsTyping(false);
    }, 650);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[620px] h-[580px] bg-white rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm">Fullerenes AI Tutor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-[10px] text-indigo-100 font-medium flex items-center gap-1">
              <span>Context:</span>
              <span className="underline decoration-indigo-300 uppercase font-semibold">
                {activeContext}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white font-medium rounded-br-xs shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs whitespace-pre-line'
              }`}
            >
              {msg.text}
            </div>

            {/* Suggested Chips for AI response */}
            {msg.suggestedChips && msg.suggestedChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                {msg.suggestedChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 transition-colors cursor-pointer text-left"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200/80 max-w-[120px] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about gates, math, entanglement, or your circuit..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-xs cursor-pointer transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
