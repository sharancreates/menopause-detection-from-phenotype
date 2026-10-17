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
        padding: '2rem 1.75rem',
        borderRadius: 'var(--radius-xl)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#FFFFFF',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '0.85rem', width: '100%' }}>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.45rem',
          marginBottom: '0.2rem',
          color: 'var(--text-primary)'
        }}>
          4-Domain Symptom Radar
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Individual phenotype mapping vs. SWAN Cohort Median
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
            {/* User polygon Cascaid Forest Sage gradient */}
            <radialGradient id="userPolygonGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#344E41" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#273A31" stopOpacity="0.22" />
            </radialGradient>

            {/* Benchmark polygon Cascaid Terracotta gradient */}
            <radialGradient id="benchmarkGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C86D51" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#C86D51" stopOpacity="0.04" />
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
                stroke="#EAE3D8"
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
                stroke="#EAE3D8"
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
              fill="#8C867E"
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
            stroke="#C86D51"
            strokeWidth="1.6"
            strokeDasharray="4 4"
            opacity="0.85"
          />

          {/* User Score Polygon */}
          <polygon
            points={userPoints}
            fill="url(#userPolygonGradient)"
            stroke="#344E41"
            strokeWidth="2.4"
            style={{
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
                fill="#C86D51"
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
                  r={isHovered ? '6.5' : '4.5'}
                  fill="#FFFFFF"
                  stroke="#344E41"
                  strokeWidth="2.2"
                  style={{
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
                  fill={isHovered ? 'var(--color-primary)' : 'var(--text-primary)'}
                  fontFamily="var(--font-sans)"
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
              background: '#FFFFFF',
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-card)',
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--radius-full)',
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
            <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
              {(domainScores[hoveredDomain] ?? 0).toFixed(2)}
            </span>{' '}
            <span style={{ color: 'var(--text-muted)' }}>
              (SWAN Cohort Avg: {(benchmarks[hoveredDomain] ?? DEFAULT_BENCHMARKS[hoveredDomain]).toFixed(2)})
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
          gap: '1.5rem',
          marginTop: '0.85rem',
          fontSize: '0.78rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: 'rgba(52, 78, 65, 0.45)',
              border: '1.5px solid #344E41',
            }}
          />
          <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Your Profile</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '14px',
              height: '0',
              borderTop: '2px dashed #C86D51',
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>SWAN Cohort Median</span>
        </div>
      </div>
    </div>
  );
}
