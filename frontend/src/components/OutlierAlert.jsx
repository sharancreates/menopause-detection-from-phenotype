import React from 'react';

export default function OutlierAlert({ isOutlier = false, imputedFeatures = [] }) {
  if (!isOutlier) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            fontSize: '1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          ✓
        </div>
        <div>
          <h4 style={{ fontSize: '0.98rem', color: '#10b981', marginBottom: '0.2rem' }}>
            Standard Cohort Symmetry
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
            Your symptom distribution across vasomotor, psychological, somatic, and sleep domains closely matches the established transition patterns observed in the SWAN cohort study.
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
        background: 'rgba(244, 63, 94, 0.1)',
        border: '1px solid rgba(244, 63, 94, 0.35)',
        boxShadow: '0 4px 20px rgba(244, 63, 94, 0.15)',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.2)',
            color: '#fda4af',
            fontSize: '1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid rgba(244, 63, 94, 0.4)',
          }}
        >
          ⚠️
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: '#fda4af', fontWeight: '700' }}>
              Atypical Multi-Domain Profile Detected
            </h4>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '0.15rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(244, 63, 94, 0.25)',
                color: '#fecdd3',
                border: '1px solid rgba(244, 63, 94, 0.4)',
              }}
            >
              Isolation Forest Consensus
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#fed7aa', marginBottom: '0.75rem', lineHeight: '1.5' }}>
            The statistical anomaly detector flagged an asymmetric symptom combination across domains. For example, experiencing intense thermoregulatory hot flashes alongside completely absent somatic or sleep disruption occurs in fewer than 5% of the SWAN longitudinal study population.
          </p>

          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
            }}
          >
            <strong style={{ color: '#ffffff' }}>Clinical Context:</strong> An atypical pattern reflects natural individual variation in neuroendocrine receptors rather than an alarming condition. We recommend highlighting this symptom asymmetry when consulting your healthcare provider to design tailored, multi-modal care.
          </div>

          {imputedFeatures && imputedFeatures.length > 0 && (
            <div style={{ marginTop: '0.6rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Note: {imputedFeatures.length} missing symptom(s) ({imputedFeatures.join(', ')}) were imputed with median cohort values.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
