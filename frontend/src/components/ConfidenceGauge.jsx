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
  let strokeColor = '#10b981';
  let glowColor = 'rgba(16, 185, 129, 0.4)';

  if (normalizedConf < 0.70) {
    statusText = 'Borderline Posterior Certainty';
    strokeColor = '#f59e0b';
    glowColor = 'rgba(245, 158, 11, 0.4)';
  } else if (normalizedConf < 0.85) {
    statusText = 'Moderate Posterior Certainty';
    strokeColor = '#06b6d4';
    glowColor = 'rgba(6, 182, 212, 0.4)';
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
          Model Confidence
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          GMM Posterior Cluster Probability
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
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor={strokeColor} />
            </linearGradient>
          </defs>

          {/* Background track arc (180 degrees) */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Dynamic filled arc */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeDasharray={`${progressLength} ${arcLength}`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />

          {/* Center Percentage Display */}
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="26"
            fontWeight="800"
            letterSpacing="-0.03em"
          >
            {percentage}%
          </text>
        </svg>
      </div>

      <div
        style={{
          display: 'inline-block',
          fontSize: '0.78rem',
          fontWeight: '700',
          color: strokeColor,
          background: `${glowColor}`,
          padding: '0.25rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '0.65rem',
          border: `1px solid ${strokeColor}44`,
        }}
      >
        {statusText}
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '240px', lineHeight: '1.4' }}>
        Reflects statistical certainty that your symptom phenotype matches {phenotype}.
      </p>
    </div>
  );
}
