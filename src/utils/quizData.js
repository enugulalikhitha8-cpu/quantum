// Adaptive Quiz Data and Misconception Knowledge Base for Fullerenes

export const INITIAL_MASTERY = {
  qubits: 90,
  superposition: 70,
  gates: 50,
  measurement: 80,
  entanglement: 20
};

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    category: 'gates',
    topic: 'Hadamard & Superposition',
    title: 'Question 1: Superposition Gate Selection',
    prompt: 'A single qubit starts in the ground state |0⟩. Which quantum gate must you apply to transform it into an equal superposition of |0⟩ and |1⟩?',
    type: 'gate_selection',
    options: [
      {
        id: 'X',
        label: 'X Gate (Pauli-X)',
        isCorrect: false,
        misconception: 'Confusing the Pauli-X bit-flip gate with the Hadamard superposition gate.',
        conceptToReview: 'Quantum Gates → Superposition vs Inversion',
        aiFeedback: `You selected the X gate.

The X gate performs a deterministic bit-flip, moving |0⟩ directly to |1⟩. It does NOT create a superposition.

To create an equal superposition, the H (Hadamard) gate is used.

Think of it this way:
• |0⟩ ─── [ X ] ─── |1⟩  (Classical-style flip, 100% chance of 1)
• |0⟩ ─── [ H ] ─── (|0⟩ + |1⟩)/√2  (Equal superposition, 50% 0 / 50% 1)

Want to see this live in the Quantum Lab?`,
        suggestedAction: {
          label: 'Visualize in Quantum Lab',
          tab: 'lab',
          preset: 'superposition'
        }
      },
      {
        id: 'H',
        label: 'H Gate (Hadamard)',
        isCorrect: true,
        conceptToReview: 'Superposition Creation',
        aiFeedback: `Spot on! 

The Hadamard (H) gate maps the basis state |0⟩ to the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2. 

Geometrically on the Bloch sphere, it rotates the state vector from the North Pole (|0⟩) directly down to the equator along the +X axis. Both outcomes now share a 50% probability upon measurement.`
      },
      {
        id: 'Z',
        label: 'Z Gate (Pauli-Z)',
        isCorrect: false,
        misconception: 'Assuming the Pauli-Z gate changes state probabilities from ground state |0⟩.',
        conceptToReview: 'Phase Gates vs Amplitude Rotation',
        aiFeedback: `You selected the Z gate.

Applying the Z gate to |0⟩ actually leaves it completely unchanged because Z|0⟩ = +1|0⟩! 

The Pauli-Z gate only flips the phase of the |1⟩ component (Z|1⟩ = -|1⟩). Since the qubit started in |0⟩, it stays in |0⟩ with 0% superposition. You need the Hadamard (H) gate to rotate into superposition.`,
        suggestedAction: {
          label: 'Inspect Z Gate in Matrix Lab',
          tab: 'lab',
          subtab: 'matrix'
        }
      },
      {
        id: 'CNOT',
        label: 'CNOT (Controlled-NOT)',
        isCorrect: false,
        misconception: 'Attempting to use a 2-qubit entangling gate on an isolated single qubit.',
        conceptToReview: 'Single-Qubit vs Multi-Qubit Gates',
        aiFeedback: `You selected CNOT.

CNOT is a 2-qubit entangling gate that requires both a control qubit and a target qubit. 

On an isolated single qubit in |0⟩, CNOT cannot even be applied. Single-qubit superposition requires the 1-qubit Hadamard (H) gate.`,
        suggestedAction: {
          label: 'Review Gate Fundamentals',
          tab: 'learn',
          topic: 'gates'
        }
      }
    ]
  },
  {
    id: 'q2',
    category: 'superposition',
    topic: 'Circuit Prediction',
    title: 'Question 2: Predicting Circuit Outcomes',
    prompt: 'Look at the following circuit. What probability distribution should you expect when measuring qubit q0?',
    circuitDisplay: {
      qubit: 'q0',
      gates: ['H', 'MEASURE']
    },
    type: 'circuit_prediction',
    options: [
      {
        id: 'opt_a',
        label: 'Definite outcome: 100% chance of |1⟩',
        isCorrect: false,
        misconception: 'Expecting a definite classical deterministic outcome from a superposition state.',
        conceptToReview: 'Born Rule & Quantum Measurement Probability',
        aiFeedback: `You expected a definite outcome of |1⟩.

You correctly recognized that the H gate alters the state away from |0⟩, but H does NOT flip it to |1⟩ (that would be the Pauli-X gate). 

Because H produces equal superposition (|0⟩ + |1⟩)/√2, the Born Rule states:
• P(|0⟩) = |1/√2|² = 50%
• P(|1⟩) = |1/√2|² = 50%

Measurement results will be probabilistic, not deterministic.`,
        suggestedAction: {
          label: 'Run 100 Trials in Superposition Lesson',
          tab: 'learn',
          topic: 'superposition'
        }
      },
      {
        id: 'opt_b',
        label: 'Equal probability: 50% chance of |0⟩ and 50% chance of |1⟩',
        isCorrect: true,
        conceptToReview: 'Quantum Measurement',
        aiFeedback: `Excellent deduction!

The Hadamard gate placed q0 into the |+⟩ superposition state. Upon measurement, the quantum wavefunction collapses probabilistically: exactly 50% chance of detecting 0, and 50% chance of detecting 1.`
      },
      {
        id: 'opt_c',
        label: '100% chance of |0⟩ because the initial state dominates',
        isCorrect: false,
        misconception: 'Overlooking the transformation enacted by the Hadamard gate.',
        conceptToReview: 'Quantum State Evolution',
        aiFeedback: `You selected 100% chance of |0⟩.

While the qubit did start in |0⟩, passing through the Hadamard gate fundamentally transformed its state vector. The original basis state is no longer preserved; it was superposed into (|0⟩ + |1⟩)/√2.`,
        suggestedAction: {
          label: 'Watch Step-by-Step Circuit',
          tab: 'lab',
          preset: 'superposition'
        }
      },
      {
        id: 'opt_d',
        label: 'The qubit is destroyed and output is completely undefined',
        isCorrect: false,
        misconception: 'Confusing quantum measurement collapse with physical qubit destruction.',
        conceptToReview: 'Wavefunction Collapse',
        aiFeedback: `You selected undefined output.

Measurement does not destroy the qubit or create random noise. In quantum mechanics, measurement projects the superposition onto one of the measurement basis states (|0⟩ or |1⟩) according to exact mathematical probability amplitudes.`,
        suggestedAction: {
          label: 'Read Measurement Lesson',
          tab: 'learn',
          topic: 'measurement'
        }
      }
    ]
  },
  {
    id: 'q3',
    category: 'entanglement',
    topic: 'Bell Pair Correlations',
    title: 'Question 3: Bell Pair Measurement Correlation',
    prompt: 'You have created the Bell State (|00⟩ + |11⟩)/√2 across qubits q0 and q1. If you measure q0 and observe |1⟩, what will q1 yield if measured immediately after?',
    type: 'entanglement_logic',
    options: [
      {
        id: 'opt_a',
        label: 'Always |1⟩ with 100% certainty',
        isCorrect: true,
        conceptToReview: 'Quantum Entanglement & Instantaneous Correlation',
        aiFeedback: `Brilliant! 

This is the quintessential power of quantum entanglement. 

In the state (|00⟩ + |11⟩)/√2, only two configurations exist in the superposition: |00⟩ and |11⟩. The cross-states |01⟩ and |10⟩ have ZERO amplitude. 

The instant q0 is measured as 1, the two-qubit wavefunction collapses into |11⟩, guaranteeing that q1 MUST measure 1.`
      },
      {
        id: 'opt_b',
        label: '50% chance of |0⟩, 50% chance of |1⟩ (independent coin flip)',
        isCorrect: false,
        misconception: 'Treating entangled qubits as independent random classical variables.',
        conceptToReview: 'Non-separability of Entangled States',
        aiFeedback: `You selected 50% chance of 0 and 50% chance of 1.

This is the most common misconception in quantum computing! 

Prior to measurement, q1 does have an equal chance of being 0 or 1. However, because q0 and q1 are ENTANGLED in the Bell state (|00⟩ + |11⟩)/√2, they cannot be described independently. 

Measuring q0 as |1⟩ eliminates the |00⟩ branch entirely. The whole state instantly collapses to |11⟩, making q1 100% determined to be |1⟩!`,
        suggestedAction: {
          label: 'Run Entanglement Correlation Lab',
          tab: 'learn',
          topic: 'entanglement'
        }
      },
      {
        id: 'opt_c',
        label: 'Always |0⟩ because entanglement inverts outcomes',
        isCorrect: false,
        misconception: 'Confusing the |Φ⁺⟩ Bell state with an anti-correlated singlet state |Ψ⁻⟩.',
        conceptToReview: 'Bell State Types',
        aiFeedback: `You selected always |0⟩.

While some entangled states (like the singlet state (|01⟩ - |10⟩)/√2) exhibit opposite anti-correlation, the standard Bell pair (|00⟩ + |11⟩)/√2 has identical matching correlation. When q0 is 1, q1 is also 1.`,
        suggestedAction: {
          label: 'Examine Bell Pair Results',
          tab: 'lab',
          preset: 'bell_pair'
        }
      },
      {
        id: 'opt_d',
        label: 'It depends on how far apart the two qubits are located',
        isCorrect: false,
        misconception: 'Believing quantum entanglement correlation decays with physical distance.',
        conceptToReview: 'Quantum Non-Locality',
        aiFeedback: `You selected that it depends on physical distance.

Remarkably, quantum entanglement does not depend on spatial separation! Even if q0 were in New York and q1 were on Mars, measuring q0 as |1⟩ correlates instantly with q1. (Einstein famously called this "spooky action at a distance").`,
        suggestedAction: {
          label: 'Deep Dive with AI Tutor',
          tab: 'tutor',
          prompt: 'Why does entanglement not depend on distance?'
        }
      }
    ]
  },
  {
    id: 'q4',
    category: 'measurement',
    topic: 'Wavefunction Collapse',
    title: 'Question 4: State Post-Measurement',
    prompt: 'A qubit is in equal superposition (|0⟩ + |1⟩)/√2. You measure it and register |0⟩. What state is the qubit in immediately after this measurement?',
    type: 'conceptual',
    options: [
      {
        id: 'opt_a',
        label: 'It remains in equal superposition (|0⟩ + |1⟩)/√2',
        isCorrect: false,
        misconception: 'Assuming measurement is a non-invasive read that leaves superposition intact.',
        conceptToReview: 'Measurement Collapse (Observer Effect)',
        aiFeedback: `You selected that it remains in equal superposition.

In quantum mechanics, measurement is inherently destructive to superpositions! 

When you measure and obtain |0⟩, the wavefunction undergoes projective collapse. The |1⟩ component vanishes, leaving the qubit strictly in the definite state |0⟩. Any immediate repeated measurement will yield |0⟩ with 100% probability.`,
        suggestedAction: {
          label: 'Test Measurement Collapse in Lesson',
          tab: 'learn',
          topic: 'qubits'
        }
      },
      {
        id: 'opt_b',
        label: 'In the definite basis state |0⟩',
        isCorrect: true,
        conceptToReview: 'Wavefunction Collapse',
        aiFeedback: `Exactly right! 

Measurement causes the wavefunction to collapse onto the observed eigenstate. The superposition is eradicated, and subsequent measurements will consistently yield |0⟩ unless another rotation gate is applied.`
      },
      {
        id: 'opt_c',
        label: 'It continuously oscillates back and forth between |0⟩ and |1⟩',
        isCorrect: false,
        misconception: 'Confusing quantum superpositions with high-frequency time oscillation.',
        conceptToReview: 'Stationary Basis States',
        aiFeedback: `You selected continuous oscillation.

Quantum superposition is not a fast oscillation between 0 and 1; it is a static probability amplitude state. Once collapsed to |0⟩, it remains stationary in that ground state until acted upon by an external Hamiltonian or gate.`,
        suggestedAction: {
          label: 'Explore Bloch Sphere Stationary Poles',
          tab: 'lab',
          subtab: 'bloch'
        }
      },
      {
        id: 'opt_d',
        label: 'The qubit enters a vacuum state with zero energy',
        isCorrect: false,
        misconception: 'Equating the |0⟩ basis state with an empty vacuum state.',
        conceptToReview: 'Computational Basis Definitions',
        aiFeedback: `You selected vacuum state.

|0⟩ and |1⟩ are orthogonal computational basis states of a physical two-level quantum system (such as spin-up and spin-down). The |0⟩ state is the stable ground state, not empty space.`,
        suggestedAction: {
          label: 'Review Qubit Basics',
          tab: 'learn',
          topic: 'qubits'
        }
      }
    ]
  },
  {
    id: 'q5',
    category: 'gates',
    topic: 'Gate Order & Non-Commutativity',
    title: 'Question 5: Order of Quantum Operations',
    prompt: 'Consider two circuits: Circuit A applies [X] then [H] to |0⟩. Circuit B applies [H] then [X] to |0⟩. Do both circuits produce the identical quantum state?',
    type: 'circuit_comparison',
    options: [
      {
        id: 'opt_a',
        label: 'Yes, quantum gate order never matters because matrix math commutes',
        isCorrect: false,
        misconception: 'Assuming quantum gate matrices commute like ordinary numbers.',
        conceptToReview: 'Matrix Multiplication & Non-Commutativity',
        aiFeedback: `You selected that gate order never matters.

In quantum mechanics, quantum gates are represented by unitary matrices, and matrix multiplication is fundamentally NON-COMMUTATIVE (A × B ≠ B × A)!

Let's test the math:
• Circuit A: |0⟩ ── [ X ] ── |1⟩ ── [ H ] ── (|0⟩ - |1⟩)/√2 = |−⟩
• Circuit B: |0⟩ ── [ H ] ── (|0⟩ + |1⟩)/√2 ── [ X ] ── (|1⟩ + |0⟩)/√2 = |+⟩

Notice the minus sign in Circuit A! They differ by a relative phase factor.`,
        suggestedAction: {
          label: 'Check Matrix Multiplication in Lab',
          tab: 'lab',
          subtab: 'matrix'
        }
      },
      {
        id: 'opt_b',
        label: 'No: Circuit A yields |−⟩ = (|0⟩ - |1⟩)/√2 whereas Circuit B yields |+⟩ = (|0⟩ + |1⟩)/√2',
        isCorrect: true,
        conceptToReview: 'Quantum Phase & Gate Sequence',
        aiFeedback: `Outstanding quantum insight!

You correctly identified that applying X before H inverts the phase, resulting in the |−⟩ state. While both states have identical 50/50 measurement probabilities, their internal quantum phases are 180° apart on opposite sides of the Bloch sphere equator!`
      },
      {
        id: 'opt_c',
        label: 'Yes, because both result in 50% |0⟩ and 50% |1⟩ so the states are physically identical',
        isCorrect: false,
        misconception: 'Confusing identical measurement probabilities with identical quantum states.',
        conceptToReview: 'Relative Phase & Bloch Sphere Orientation',
        aiFeedback: `You selected that they are physically identical because both have 50/50 probabilities.

This is a subtle and crucial distinction:
While both |+⟩ and |−⟩ yield 50% 0 and 50% 1 when measured in the computational Z-basis, they are NOT the same quantum state! 

They differ by a relative phase of π (180°). If you apply another H gate:
• H|+⟩ returns to |0⟩
• H|−⟩ returns to |1⟩!
Quantum phase dictates quantum interference.`,
        suggestedAction: {
          label: 'Compare |+⟩ vs |−⟩ on Bloch Sphere',
          tab: 'lab',
          subtab: 'bloch'
        }
      },
      {
        id: 'opt_d',
        label: 'No, because applying X after H cancels the circuit and resets to |0⟩',
        isCorrect: false,
        misconception: 'Assuming the Pauli-X gate acts as an "undo" operation for the Hadamard gate.',
        conceptToReview: 'Self-Inverse Unitary Gates',
        aiFeedback: `You selected that X cancels H.

The gate that undoes H is H itself (because H × H = Identity I). The Pauli-X gate simply swaps the amplitudes of |0⟩ and |1⟩. Since H|0⟩ has equal amplitudes for both, applying X swaps them into (|1⟩ + |0⟩)/√2, which remains |+⟩.`,
        suggestedAction: {
          label: 'Test H on H in Quantum Lab',
          tab: 'lab',
          preset: 'superposition'
        }
      }
    ]
  }
];

export const CHALLENGES = [
  {
    id: 'ch1',
    title: 'Challenge 1: Create an Equal Superposition',
    difficulty: 'Beginner',
    targetState: 'SUPERPOSITION_Q0',
    description: 'Starting from ground state |0⟩, place the single correct gate onto Qubit 0 so that measurement yields a 50% chance of |0⟩ and 50% chance of |1⟩.',
    hint: 'Look for the Hadamard gate that splits the state vector between |0⟩ and |1⟩.',
    requiredGates: ['H'],
    targetProbs: { '00': 0.5, '10': 0.5 },
    xp: 150
  },
  {
    id: 'ch2',
    title: 'Challenge 2: Deterministic Bit Inversion',
    difficulty: 'Beginner',
    targetState: 'BIT_FLIP_Q0',
    description: 'Starting with |0⟩ on Qubit 0, invert the state so that measurement yields |1⟩ with 100% certainty.',
    hint: 'Use the quantum equivalent of a classical NOT gate: the Pauli-X gate.',
    requiredGates: ['X'],
    targetProbs: { '10': 1.0 },
    xp: 150
  },
  {
    id: 'ch3',
    title: 'Challenge 3: Synthesize a Bell State (|Φ⁺⟩)',
    difficulty: 'Intermediate',
    targetState: 'BELL_PAIR',
    description: 'Entangle Qubit 0 and Qubit 1 so that their measurement outcomes are 100% correlated (|00⟩ or |11⟩), with zero probability of |01⟩ or |10⟩.',
    hint: 'First put Qubit 0 into superposition with H, then connect Qubit 0 and Qubit 1 using CNOT.',
    requiredGates: ['H', 'CNOT'],
    targetProbs: { '00': 0.5, '11': 0.5 },
    xp: 300
  }
];
