// Quantum Simulation & Helper Engine for Fullerenes Prototype

export const GATES = {
  H: {
    id: 'H',
    name: 'Hadamard',
    symbol: 'H',
    color: 'from-indigo-500 to-blue-600',
    borderColor: 'border-indigo-400',
    description: 'Creates equal superposition from basis states',
    matrix: [
      ['1/√2', '1/√2'],
      ['1/√2', '-1/√2']
    ],
    numericMatrix: [
      [1 / Math.SQRT2, 1 / Math.SQRT2],
      [1 / Math.SQRT2, -1 / Math.SQRT2]
    ]
  },
  X: {
    id: 'X',
    name: 'Pauli-X (NOT)',
    symbol: 'X',
    color: 'from-amber-500 to-rose-500',
    borderColor: 'border-amber-400',
    description: 'Bit flip gate: swaps |0⟩ and |1⟩',
    matrix: [
      ['0', '1'],
      ['1', '0']
    ],
    numericMatrix: [
      [0, 1],
      [1, 0]
    ]
  },
  Z: {
    id: 'Z',
    name: 'Pauli-Z (Phase)',
    symbol: 'Z',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-400',
    description: 'Phase flip gate: inverts phase of |1⟩ to -|1⟩',
    matrix: [
      ['1', '0'],
      ['0', '-1']
    ],
    numericMatrix: [
      [1, 0],
      [0, -1]
    ]
  },
  CNOT: {
    id: 'CNOT',
    name: 'Controlled-NOT',
    symbol: 'CX',
    color: 'from-purple-600 to-indigo-700',
    borderColor: 'border-purple-400',
    description: 'Entangles two qubits: flips target if control is |1⟩',
    isTwoQubit: true,
    matrix: [
      ['1', '0', '0', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '0', '1'],
      ['0', '0', '1', '0']
    ],
    numericMatrix: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 1, 0]
    ]
  },
  MEASURE: {
    id: 'MEASURE',
    name: 'Measurement',
    symbol: '∿',
    color: 'from-slate-700 to-slate-900',
    borderColor: 'border-slate-500',
    description: 'Collapses quantum state into classical bit 0 or 1'
  }
};

/**
 * Calculates simulated state for a 2-qubit circuit with placed gates.
 * Wires: q0 and q1. Each wire has slots [0, 1, 2, 3].
 */
export function calculateCircuitState(circuit) {
  // circuit: { q0: [gateId or null, ...], q1: [gateId or null, ...] }
  // default ground state: |00⟩
  // Returns: { probabilities: { '00': p00, '01': p01, '10': p10, '11': p11 }, stateVectorStr, blochQ0, blochQ1, isEntangled, detectedPattern }

  const q0Gates = circuit.q0.filter(Boolean);
  const q1Gates = circuit.q1.filter(Boolean);

  // Pattern detection
  const hasHOnQ0 = circuit.q0.some(g => g === 'H');
  const hasCNOT = circuit.q0.some((g, idx) => g === 'CNOT' || circuit.q1[idx] === 'CNOT');
  const hasXOnQ0 = circuit.q0.some(g => g === 'X');
  const hasXOnQ1 = circuit.q1.some(g => g === 'X');

  // Check Bell state: H on q0 followed by CNOT
  let isBellPair = false;
  const hIdx = circuit.q0.indexOf('H');
  const cnotIdx = circuit.q0.indexOf('CNOT') !== -1 ? circuit.q0.indexOf('CNOT') : circuit.q1.indexOf('CNOT');

  if (hIdx !== -1 && cnotIdx > hIdx) {
    isBellPair = true;
  }

  if (isBellPair) {
    return {
      probabilities: { '00': 0.50, '01': 0.0, '10': 0.0, '11': 0.50 },
      stateVectorStr: '(|00⟩ + |11⟩) / √2',
      ketCoefficients: { '00': '1/√2', '01': '0', '10': '0', '11': '1/√2' },
      blochQ0: { theta: Math.PI / 2, phi: 0, x: 1, y: 0, z: 0 },
      blochQ1: { theta: Math.PI / 2, phi: 0, x: 1, y: 0, z: 0 },
      isEntangled: true,
      circuitType: 'BELL_PAIR',
      title: 'Bell State |Φ⁺⟩ (Maximally Entangled)',
      explanation: 'Qubit 0 and Qubit 1 are perfectly correlated. Measuring one immediately dictates the other with 100% correlation.'
    };
  }

  // Pure superposition on q0, q1 in |0⟩
  if (hasHOnQ0 && !hasCNOT && q1Gates.length === 0) {
    return {
      probabilities: { '00': 0.50, '01': 0.0, '10': 0.50, '11': 0.0 },
      stateVectorStr: '(|00⟩ + |10⟩) / √2 = (|+⟩ ⊗ |0⟩)',
      ketCoefficients: { '00': '1/√2', '01': '0', '10': '1/√2', '11': '0' },
      blochQ0: { theta: Math.PI / 2, phi: 0, x: 1, y: 0, z: 0 },
      blochQ1: { theta: 0, phi: 0, x: 0, y: 0, z: 1 },
      isEntangled: false,
      circuitType: 'SUPERPOSITION_Q0',
      title: 'Superposition State on Qubit 0',
      explanation: 'Qubit 0 is in equal superposition |+⟩, while Qubit 1 remains in ground state |0⟩.'
    };
  }

  // Bit flip X on q0
  if (hasXOnQ0 && !hasHOnQ0 && !hasCNOT && q1Gates.length === 0) {
    return {
      probabilities: { '00': 0.0, '01': 0.0, '10': 1.0, '11': 0.0 },
      stateVectorStr: '|10⟩',
      ketCoefficients: { '00': '0', '01': '0', '10': '1', '11': '0' },
      blochQ0: { theta: Math.PI, phi: 0, x: 0, y: 0, z: -1 },
      blochQ1: { theta: 0, phi: 0, x: 0, y: 0, z: 1 },
      isEntangled: false,
      circuitType: 'BIT_FLIP_Q0',
      title: 'Definite Inverted State |10⟩',
      explanation: 'Pauli-X inverted Qubit 0 from |0⟩ to |1⟩. Measurement is 100% deterministic.'
    };
  }

  // X then H on q0: results in |−⟩ = (|0⟩ - |1⟩)/√2
  if (circuit.q0[0] === 'X' && circuit.q0[1] === 'H' && !hasCNOT) {
    return {
      probabilities: { '00': 0.50, '01': 0.0, '10': 0.50, '11': 0.0 },
      stateVectorStr: '(|00⟩ - |10⟩) / √2 = (|−⟩ ⊗ |0⟩)',
      ketCoefficients: { '00': '1/√2', '01': '0', '10': '-1/√2', '11': '0' },
      blochQ0: { theta: Math.PI / 2, phi: Math.PI, x: -1, y: 0, z: 0 },
      blochQ1: { theta: 0, phi: 0, x: 0, y: 0, z: 1 },
      isEntangled: false,
      circuitType: 'MINUS_STATE_Q0',
      title: 'Minus Superposition State |−⟩',
      explanation: 'Applying X then H introduces a 180° relative phase shift (−1) on the |1⟩ component.'
    };
  }

  // Both in superposition: H on q0 and H on q1
  if (hasHOnQ0 && circuit.q1.some(g => g === 'H') && !hasCNOT) {
    return {
      probabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
      stateVectorStr: '(|00⟩ + |01⟩ + |10⟩ + |11⟩) / 2',
      ketCoefficients: { '00': '1/2', '01': '1/2', '10': '1/2', '11': '1/2' },
      blochQ0: { theta: Math.PI / 2, phi: 0, x: 1, y: 0, z: 0 },
      blochQ1: { theta: Math.PI / 2, phi: 0, x: 1, y: 0, z: 0 },
      isEntangled: false,
      circuitType: 'DUAL_SUPERPOSITION',
      title: 'Independent 2-Qubit Superposition',
      explanation: 'Each qubit is independently in superposition. All 4 basis combinations have equal 25% probability.'
    };
  }

  // Default Ground state: |00⟩
  return {
    probabilities: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 },
    stateVectorStr: '|00⟩',
    ketCoefficients: { '00': '1', '01': '0', '10': '0', '11': '0' },
    blochQ0: { theta: 0, phi: 0, x: 0, y: 0, z: 1 },
    blochQ1: { theta: 0, phi: 0, x: 0, y: 0, z: 1 },
    isEntangled: false,
    circuitType: 'GROUND_STATE',
    title: 'Ground State |00⟩',
    explanation: 'Both qubits start initialized in classical ground state |0⟩. Deterministic measurement.'
  };
}

/**
 * Generate simulated measurement shots for a given probability distribution
 */
export function generateMeasurementShots(probabilities, totalShots = 1024) {
  const counts = { '00': 0, '01': 0, '10': 0, '11': 0 };
  
  for (let i = 0; i < totalShots; i++) {
    const r = Math.random();
    let cumulative = 0;
    for (const [state, prob] of Object.entries(probabilities)) {
      cumulative += prob;
      if (r <= cumulative) {
        counts[state]++;
        break;
      }
    }
  }

  return counts;
}

export const PRESET_CIRCUITS = [
  {
    id: 'bell_pair',
    title: 'Bell State (|Φ⁺⟩)',
    subtitle: 'Maximal 2-Qubit Entanglement',
    description: 'H on q0 followed by CNOT from q0 to q1',
    circuit: {
      q0: ['H', 'CNOT', null, 'MEASURE'],
      q1: [null, 'CNOT', null, 'MEASURE']
    }
  },
  {
    id: 'superposition',
    title: 'Single-Qubit Superposition',
    subtitle: '50/50 Probability Split',
    description: 'H on q0 creates |+⟩ state',
    circuit: {
      q0: ['H', null, null, 'MEASURE'],
      q1: [null, null, null, null]
    }
  },
  {
    id: 'bit_flip',
    title: 'Pauli-X Bit Flip',
    subtitle: 'Deterministic |0⟩ → |1⟩',
    description: 'X gate swaps ground state to excited state',
    circuit: {
      q0: ['X', null, null, 'MEASURE'],
      q1: [null, null, null, null]
    }
  },
  {
    id: 'phase_flip',
    title: 'Phase Inversion (|−⟩)',
    subtitle: 'Pauli-X followed by Hadamard',
    description: 'Produces equal superposition with negative phase',
    circuit: {
      q0: ['X', 'H', null, 'MEASURE'],
      q1: [null, null, null, null]
    }
  }
];
