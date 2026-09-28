import React, { useState } from 'react';
import { Compass, RotateCw } from 'lucide-react';

export default function BlochSphere({
  theta = 0,
  phi = 0,
  label = 'Qubit 0',
  interactive = false,
  onAngleChange = null
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Radius and center of the 2D projection
  const r = 85;
  const cx = 110;
  const cy = 110;

  // 3D to 2D isometric/orthographic projection
  // theta: angle from Z axis (0 to PI)
  // phi: angle in XY plane from X axis (0 to 2*PI)
  // 3D coordinates:
  // x_3d = sin(theta) * cos(phi)
  // y_3d = sin(theta) * sin(phi)
  // z_3d = cos(theta)

  // Isometric projection onto 2D plane:
  // projection angle ~ 25 degrees tilt
  const tilt = 0.42;
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);

  const x3d = sinTheta * cosPhi;
  const y3d = sinTheta * sinPhi;
  const z3d = cosTheta;

  // Projected 2D coords
  const px = cx + r * (x3d * 0.88 - y3d * 0.48);
  const py = cy - r * (z3d * 0.92 - y3d * tilt * 0.35);

  const prob0 = Math.pow(Math.cos(theta / 2), 2);
  const prob1 = Math.pow(Math.sin(theta / 2), 2);

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-transparent to-purple-50/30 pointer-events-none" />

      {/* Header */}
      <div className="w-full flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-800">{label} Bloch Sphere</span>
        </div>
        <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-semibold">
          θ: {(theta * (180 / Math.PI)).toFixed(0)}°
        </span>
      </div>

      {/* SVG Canvas for Bloch Sphere */}
      <div className="relative w-[220px] h-[220px] my-1 flex items-center justify-center">
        <svg
          viewBox="0 0 220 220"
          className="w-full h-full transition-transform duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <defs>
            {/* Radial gradient for sphere body */}
            <radialGradient id={`sphere-grad-${label}`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#eef2ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.25" />
            </radialGradient>

            {/* Glowing marker filter */}
            <filter id={`glow-${label}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sphere circle outline */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill={`url(#sphere-grad-${label})`}
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Equator Ellipse (XY Plane) */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={r}
            ry={r * 0.32}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.8"
          />

          {/* Prime Meridian Ellipse (XZ Plane) */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={r * 0.32}
            ry={r}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.6"
          />

          {/* Axes */}
          {/* Z-Axis (Vertical) */}
          <line
            x1={cx}
            y1={cy + r + 8}
            x2={cx}
            y2={cy - r - 12}
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <polygon
            points={`${cx},${cy - r - 14} ${cx - 4},${cy - r - 8} ${cx + 4},${cy - r - 8}`}
            fill="#64748b"
          />

          {/* X-Axis (Diagonal forward left-down) */}
          <line
            x1={cx}
            y1={cy}
            x2={cx - r * 0.72}
            y2={cy + r * 0.45}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Y-Axis (Diagonal right-up) */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + r * 0.85}
            y2={cy + r * 0.12}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Basis State Labels */}
          {/* |0⟩ at North pole */}
          <g className="cursor-pointer" onClick={() => onAngleChange && onAngleChange(0, 0)}>
            <rect x={cx - 16} y={cy - r - 26} width="32" height="16" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
            <text
              x={cx}
              y={cy - r - 14}
              textAnchor="middle"
              className="text-[11px] font-mono font-bold fill-indigo-700"
            >
              |0⟩
            </text>
          </g>

          {/* |1⟩ at South pole */}
          <g className="cursor-pointer" onClick={() => onAngleChange && onAngleChange(Math.PI, 0)}>
            <rect x={cx - 16} y={cy + r + 10} width="32" height="16" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
            <text
              x={cx}
              y={cy + r + 22}
              textAnchor="middle"
              className="text-[11px] font-mono font-bold fill-indigo-700"
            >
              |1⟩
            </text>
          </g>

          {/* |+⟩ along +X axis */}
          <text
            x={cx - r * 0.76}
            y={cy + r * 0.52}
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-slate-500"
          >
            |+⟩
          </text>

          {/* |−⟩ along -X axis */}
          <text
            x={cx + r * 0.72}
            y={cy - r * 0.35}
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-slate-500"
          >
            |−⟩
          </text>

          {/* Projection dashed line to equator */}
          <line
            x1={px}
            y1={py}
            x2={px}
            y2={cy + (py - cy) * 0.25}
            stroke="#a5b4fc"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* State Vector Arrow */}
          <line
            x1={cx}
            y1={cy}
            x2={px}
            y2={py}
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Origin center point */}
          <circle cx={cx} cy={cy} r="3" fill="#64748b" />

          {/* Tip of State Vector */}
          <circle
            cx={px}
            cy={py}
            r="6"
            fill="#4f46e5"
            stroke="#ffffff"
            strokeWidth="2"
            filter={`url(#glow-${label})`}
            className="transition-all duration-300 animate-pulse"
          />
        </svg>
      </div>

      {/* Probabilities preview */}
      <div className="w-full mt-2 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="p-1.5 rounded-lg bg-indigo-50/70 border border-indigo-100">
          <div className="text-[10px] text-indigo-600 font-semibold uppercase">P(|0⟩)</div>
          <div className="font-mono font-bold text-slate-800">{(prob0 * 100).toFixed(1)}%</div>
        </div>
        <div className="p-1.5 rounded-lg bg-purple-50/70 border border-purple-100">
          <div className="text-[10px] text-purple-600 font-semibold uppercase">P(|1⟩)</div>
          <div className="font-mono font-bold text-slate-800">{(prob1 * 100).toFixed(1)}%</div>
        </div>
      </div>

      {/* Interactive preset quick buttons if interactive */}
      {interactive && onAngleChange && (
        <div className="w-full mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
          <span className="text-[10px] font-semibold text-slate-400">Presets:</span>
          <div className="flex gap-1">
            <button
              onClick={() => onAngleChange(0, 0)}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 text-[11px] font-mono font-semibold text-slate-700 hover:text-indigo-600 cursor-pointer"
            >
              |0⟩
            </button>
            <button
              onClick={() => onAngleChange(Math.PI, 0)}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 text-[11px] font-mono font-semibold text-slate-700 hover:text-indigo-600 cursor-pointer"
            >
              |1⟩
            </button>
            <button
              onClick={() => onAngleChange(Math.PI / 2, 0)}
              className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-[11px] font-mono font-semibold text-indigo-700 cursor-pointer"
            >
              |+⟩
            </button>
            <button
              onClick={() => onAngleChange(Math.PI / 2, Math.PI)}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 text-[11px] font-mono font-semibold text-slate-700 hover:text-indigo-600 cursor-pointer"
            >
              |−⟩
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
