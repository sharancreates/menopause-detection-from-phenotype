import React from 'react';

export default function ConfidenceGauge({ confidence = 0.85, phenotype = 'Phenotype' }) {
  // Clamp confidence between 0.0 and 1.0
  const normalizedConf = Math.min(Math.max(confidence, 0), 1);
  const percentage = Math.round(normalizedConf * 100);

  // SVG geometry for semi-circle arc (radius 60, stroke width 12)
  const cx = 90;
  const cy = 80;
  const r = 58;
  const arcLength = Math.PI * r; // ~182.2
  const progressLength = arcLength * normalizedConf;

  // Status tiers
  let statusText = 'High Posterior Certainty';
  let strokeColor = 'var(--color-mint)';
  let badgeBg = 'var(--color-mint-light)';
  let textColor = 'var(--color-primary)';

  if (normalizedConf < 0.70) {
    statusText = 'Borderline Posterior Certainty';
    strokeColor = '#B58342';
    badgeBg = 'rgba(181, 131, 66, 0.12)';
    textColor = '#B58342';
  } else if (normalizedConf < 0.85) {
    statusText = 'Moderate Posterior Certainty';
    strokeColor = 'var(--color-primary)';
    badgeBg = 'var(--color-primary-light)';
    textColor = 'var(--color-primary)';
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '2rem 1.75rem',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: '#FFFFFF',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <div style={{ marginBottom: '0.65rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.45rem',
          marginBottom: '0.2rem',
          color: 'var(--text-primary)'
        }}>
          Model Confidence
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          GMM Posterior Assignment Probability
        </p>
      </div>

      <div style={{ position: 'relative', width: '180px', height: '100px', margin: '0.5rem 0' }}>
        <svg
          viewBox="0 0 180 95"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          role="img"
          aria-label={`Confidence gauge indicating ${percentage}% posterior probability`}
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#344E41" />
              <stop offset="100%" stopColor={strokeColor} />
            </linearGradient>
          </defs>

          {/* Background track arc */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="#EAE3D8"
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* Dynamic filled arc */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="11"
            strokeDasharray={`${progressLength} ${arcLength}`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* Center Percentage Display */}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="var(--text-primary)"
            fontFamily="var(--font-serif)"
            fontSize="28"
            fontWeight="600"
            letterSpacing="-0.02em"
          >
            {percentage}%
          </text>
        </svg>
      </div>

      {/* Status Pill Badge */}
      <span
        style={{
          fontSize: '0.74rem',
          fontWeight: '600',
          padding: '0.3rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          background: badgeBg,
          color: textColor,
          border: `1px solid ${textColor}33`,
          letterSpacing: '0.5px'
        }}
      >
        {statusText}
      </span>
    </div>
  );
}
