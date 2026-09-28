# Fullerenes — Quantum Learning Lab

> A modern, interactive web prototype for an AI-powered Quantum Computing Learning Platform.

Built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🌟 Core Philosophy

```
LEARN ➔ SEE ➔ BUILD ➔ RUN ➔ UNDERSTAND ➔ AI EXPLAINS ➔ PERSONALIZED PRACTICE
```

Quantum computing is notoriously difficult when taught through abstract linear algebra alone or disconnected circuit tools. **Fullerenes** introduces the concept of **One Circuit → Multiple Synchronized Views**:

1. **Circuit View**: Interactive quantum wire canvas with chronological time steps ($t_1 \to t_4$).
2. **Matrix Lab**: Unitary matrices ($H, X, Z, \text{CNOT}$) and animated vector transformations ($U|\psi\rangle$).
3. **Bloch Sphere**: Interactive 3D projected spheres tracking state vector angles ($\theta, \phi$) on the unit sphere.
4. **Probability & Measurement View**: Real-time Born Rule distribution and simulated multi-shot histograms (1024 shots).
5. **Context-Aware AI Tutor**: Intelligent guidance synchronized with active circuits, questions, and diagnosed misconceptions.

---

## 🚀 Key Modules & Features

### 1. Main Dashboard
- **Your Quantum Journey**: Progressive path covering *Qubits → Superposition → Gates → Measurement → Entanglement*.
- **Continue Learning Hero Card**: Live course completion tracker (78%), quick triggers for Quantum Lab and AI Tutor.
- **Adaptive Learning Insights**: Diagnostic overview highlighting strong concepts and topics needing targeted practice.
- **Interactive Multi-View Showcase**: Live preview of the 5 synchronized perspectives of a Bell Pair.

### 2. Visual Learning Modules (`Learn`)
- **Understanding Qubits**: Interactive $\theta$-angle slider, dynamic $P(|0\rangle) = \cos^2(\theta/2)$ and $P(|1\rangle) = \sin^2(\theta/2)$ probability bars, and interactive measurement wavefunction collapse tester.
- **Superposition**: Visual transformation pipeline: $|0\rangle \to [H] \to ( |0\rangle + |1\rangle ) / \sqrt{2} \to \text{Measure (100 trials)}$.
- **Fundamental Gates**: Visual intuition for Hadamard ($H$), Pauli-X ($X$), Pauli-Z ($Z$), and Controlled-NOT ($\text{CNOT}$).
- **Measurement & Collapse**: Understanding projective measurement and the Born Rule.
- **Entanglement ("Create your first Bell Pair")**:
  $$q_0 \text{ ─── [ H ] ─── [ }\bullet\text{ ] ─── Measure}$$
  $$q_1 \text{ ───────────────── [ X ] ─── Measure}$$
  Features animated shot execution demonstrating 100% correlation with zero cross-state occurrence ($|01\rangle$ and $|10\rangle$).

### 3. Centerpiece Quantum Lab (`Quantum Lab`)
- **Interactive Circuit Grid**: 2-qubit canvas with drag-and-click gate placement.
- **Real-Time Live State Panel**: Synchronized basis state probabilities, dynamic Bloch sphere coordinates, and Bell correlation badges.
- **Simulation Execution**: Animated photon pulse traversing through gates with step-by-step progress.
- **Matrix Lab Tab**: Step-by-step matrix multiplication breakdown ($M \times |\psi_{\text{in}}\rangle = |\psi_{\text{out}}\rangle$).
- **Shot Results Tab**: 1,024 shots simulation with histogram bars, measurement statistics, and fidelity indicators.

### 4. AI-Powered Adaptive Quiz System (`Practice & AI`)
- **Diagnostic Engine**: Not just a score! Operates on the loop:
  `Question ➔ Answer ➔ Misconception Analysis ➔ AI Explanation ➔ Targeted Practice ➔ Live Retry`
- **Misconception Detection**: Specifically catches and explains common pitfalls (e.g., confusing Pauli-X bit flip with Hadamard superposition, assuming entangled qubits are independent coin flips).
- **Circuit-Based Questions**: Predicts outcomes of live circuit diagrams.
- **AI Learning Analysis Report**: Comprehensive diagnostic card identifying strengths, areas needing attention, and customized next activities.
- **Interactive Circuit Challenges**: Sandboxed challenges with instant validation and celebration animations.

### 5. Context-Aware AI Tutor (`Floating Assistant`)
- Accessible anywhere via floating trigger button or in-page cards.
- Synchronized with active circuits, lessons, and quiz questions.
- Pre-populated smart prompt chips (`"Why did H create superposition?"`, `"Why are qubits correlated?"`, `"Show me the matrix math"`, `"Give me a challenge"`).

---

## 💻 Running Locally

### Development Server
```bash
npm install
npm run dev
```
Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your browser.

### Production Build
```bash
npm run build
npm run preview
```
