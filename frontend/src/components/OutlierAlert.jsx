import React from 'react';

export default function OutlierAlert({ isOutlier = false, imputedFeatures = [] }) {
  if (!isOutlier) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.1rem',
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--color-mint-light)',
            color: 'var(--color-primary)',
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid rgba(91, 174, 134, 0.3)',
          }}
        >
          ✓
        </div>
        <div>
          <h4 style={{ fontSize: '0.92rem', color: 'var(--color-primary)', marginBottom: '0.15rem' }}>
            Standard Cohort Symmetry Verified
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
            Your symptom distribution across vasomotor, psychological, somatic, and sleep domains conforms closely to established trajectory patterns observed in the SWAN longitudinal cohort.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-panel animate-fade-in"
      style={{
        padding: '1.5rem 1.75rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-accent-light)',
        border: '1px solid rgba(200, 109, 81, 0.35)',
        boxShadow: '0 4px 20px rgba(200, 109, 81, 0.08)',
        marginBottom: '2rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.1rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(200, 109, 81, 0.2)',
            color: 'var(--color-accent)',
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid rgba(200, 109, 81, 0.4)',
          }}
        >
          ⚠️
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-accent)', fontWeight: '700', margin: 0 }}>
              Atypical Multi-Domain Profile Detected
            </h4>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '600',
                padding: '0.18rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                background: '#FFFFFF',
                color: 'var(--color-accent)',
                border: '1px solid rgba(200, 109, 81, 0.3)',
              }}
            >
              Isolation Forest Consensus
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.55' }}>
            The statistical anomaly detector identified an asymmetric symptom pattern across domains. Experiencing severe thermoregulatory sensations with near-absent physical or rest disruption occurs in fewer than 5% of the SWAN longitudinal study population.
          </p>

          <div
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: '#FFFFFF',
              border: '1px solid rgba(200, 109, 81, 0.25)',
              fontSize: '0.82rem',
              color: 'var(--text-primary)',
            }}
          >
            <strong>Clinical Consideration:</strong> Atypical configurations may reflect isolated endocrine, thyroid, or medication-related cross-talk. Prioritize discussing these specific domain differentials during your clinician consultation.
          </div>
        </div>
      </div>
    </div>
  );
}
