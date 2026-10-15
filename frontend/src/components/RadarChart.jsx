import React, { useState } from 'react';

const DEFAULT_BENCHMARKS = {
  vasomotor: 1.15,
  psychological: 1.45,
  somatic: 1.25,
  sleep: 1.40,
};

const DOMAIN_CONFIG = [
  { key: 'vasomotor', label: 'Vasomotor', color: 'var(--domain-vaso)', angle: -Math.PI / 2 },
  { key: 'psychological', label: 'Psychological', color: 'var(--domain-psych)', angle: 0 },
  { key: 'somatic', label: 'Somatic', color: 'var(--domain-somatic)', angle: Math.PI / 2 },
  { key: 'sleep', label: 'Sleep Continuity', color: 'var(--domain-sleep)', angle: Math.PI },
];

export default function RadarChart({ domainScores = {}, benchmarks = DEFAULT_BENCHMARKS }) {
  const [hoveredDomain, setHoveredDomain] = useState(null);

  const cx = 160;
  const cy = 150;
  const maxRadius = 95;
  const maxScore = 4.0;

  // Grid levels (1.0, 2.0, 3.0, 4.0)
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Helper to convert polar to cartesian coordinates
  const getCoordinates = (value, angle) => {
    const normalized = Math.min(Math.max((value || 0) / maxScore, 0), 1);
    const r = normalized * maxRadius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y };
  };

  // Build polygon points for User
  const userPoints = DOMAIN_CONFIG.map((d) => {
    const val = domainScores[d.key] ?? 0;
    const { x, y } = getCoordinates(val, d.angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Build polygon points for SWAN Benchmark
  const benchmarkPoints = DOMAIN_CONFIG.map((d) => {
    const val = benchmarks[d.key] ?? DEFAULT_BENCHMARKS[d.key];
    const { x, y } = getCoordinates(val, d.angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '0.75rem', width: '100%' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
          4-Domain Symptom Radar
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Comparative burden profile vs. SWAN Cohort Median
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '340px', position: 'relative' }}>
        <svg
          viewBox="0 0 320 310"
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
          role="img"
          aria-label="Radar chart displaying vasomotor, psychological, somatic, and sleep domain symptom scores compared against SWAN population averages"
        >
          <defs>
            {/* User polygon glowing gradient */}
            <radialGradient id="userPolygonGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.25" />
            </radialGradient>

            {/* Benchmark polygon gradient */}
            <radialGradient id="benchmarkGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Background Concentric Grid Rings */}
          {levels.map((lvl, idx) => {
            const r = lvl * maxRadius;
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray={idx === levels.length - 1 ? 'none' : '2,3'}
                strokeWidth="1"
              />
            );
          })}

          {/* Axis lines from center to outer ring */}
          {DOMAIN_CONFIG.map((d) => {
            const { x, y } = getCoordinates(maxScore, d.angle);
            return (
              <line
                key={d.key}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Level scale indicators (0 to 4) on top axis */}
          {levels.map((lvl, idx) => (
            <text
              key={idx}
              x={cx + 4}
              y={cy - lvl * maxRadius + 3}
              fill="rgba(255, 255, 255, 0.35)"
              fontSize="8"
              fontWeight="600"
            >
              {(lvl * 4).toFixed(0)}
            </text>
          ))}

          {/* Benchmark Reference Polygon */}
          <polygon
            points={benchmarkPoints}
            fill="url(#benchmarkGradient)"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            opacity="0.85"
          />

          {/* User Score Polygon */}
          <polygon
            points={userPoints}
            fill="url(#userPolygonGradient)"
            stroke="#c084fc"
            strokeWidth="2.5"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))',
              transition: 'all 400ms ease-out',
            }}
          />

          {/* Benchmark vertices */}
          {DOMAIN_CONFIG.map((d) => {
            const val = benchmarks[d.key] ?? DEFAULT_BENCHMARKS[d.key];
            const { x, y } = getCoordinates(val, d.angle);
            return (
              <circle
                key={`bench-${d.key}`}
                cx={x}
                cy={y}
                r="3"
                fill="#38bdf8"
                opacity="0.75"
              />
            );
          })}

          {/* User interactive vertex circles */}
          {DOMAIN_CONFIG.map((d) => {
            const val = domainScores[d.key] ?? 0;
            const { x, y } = getCoordinates(val, d.angle);
            const isHovered = hoveredDomain === d.key;

            return (
              <g
                key={`user-${d.key}`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredDomain(d.key)}
                onMouseLeave={() => setHoveredDomain(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? '7' : '5'}
                  fill="#ffffff"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 0 8px #a855f7)' : 'none',
                    transition: 'r 200ms ease',
                  }}
                />
              </g>
            );
          })}

          {/* Domain Outer Labels */}
          {DOMAIN_CONFIG.map((d) => {
            const labelRadius = maxRadius + 24;
            const lx = cx + labelRadius * Math.cos(d.angle);
            const ly = cy + labelRadius * Math.sin(d.angle);
            const val = (domainScores[d.key] ?? 0).toFixed(1);
            const isHovered = hoveredDomain === d.key;

            return (
              <g
                key={`lbl-${d.key}`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredDomain(d.key)}
                onMouseLeave={() => setHoveredDomain(null)}
              >
                <text
                  x={lx}
                  y={ly - 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHovered ? '#ffffff' : 'var(--text-secondary)'}
                  fontSize="10"
                  fontWeight={isHovered ? '700' : '600'}
                  style={{ transition: 'fill 200ms ease' }}
                >
                  {d.label}
                </text>
                <text
                  x={lx}
                  y={ly + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={d.color}
                  fontSize="9.5"
                  fontWeight="700"
                >
                  {val} / 4.0
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip when vertex hovered */}
        {hoveredDomain && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(12, 10, 29, 0.95)',
              border: '1px solid var(--color-primary)',
              boxShadow: 'var(--shadow-glow)',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 10,
              animation: 'fadeIn 150ms ease-in-out',
            }}
          >
            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
              {DOMAIN_CONFIG.find((d) => d.key === hoveredDomain)?.label}:
            </span>{' '}
            <span style={{ color: '#c084fc', fontWeight: 'bold' }}>
              {(domainScores[hoveredDomain] ?? 0).toFixed(2)}
            </span>{' '}
            <span style={{ color: 'var(--text-muted)' }}>
              (SWAN Avg: {(benchmarks[hoveredDomain] ?? DEFAULT_BENCHMARKS[hoveredDomain]).toFixed(2)})
            </span>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          marginTop: '0.75rem',
          fontSize: '0.78rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: 'rgba(168, 85, 247, 0.65)',
              border: '1.5px solid #c084fc',
            }}
          />
          <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Your Profile</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span
            style={{
              width: '14px',
              height: '0',
              borderTop: '2px dashed #38bdf8',
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>SWAN Cohort Median</span>
        </div>
      </div>
    </div>
  );
}
