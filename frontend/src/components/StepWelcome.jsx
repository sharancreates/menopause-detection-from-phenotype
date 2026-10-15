import React from 'react';

export default function StepWelcome({ onStart, totalSymptoms }) {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Hero Card */}
      <div className="glass-panel" style={{
        padding: '3rem 2.5rem',
        textAlign: 'center',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '30%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.9rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(168, 85, 247, 0.15)',
          color: 'var(--color-primary)',
          fontSize: '0.8rem',
          fontWeight: '700',
          marginBottom: '1.25rem',
          border: '1px solid rgba(168, 85, 247, 0.3)'
        }}>
          Study of Women's Health Across the Nation (SWAN)
        </div>

        <h2 style={{
          fontSize: '2.4rem',
          letterSpacing: '-0.03em',
          marginBottom: '1rem',
          lineHeight: '1.18'
        }}>
          Discover Your Menopause <br />
          <span style={{
            background: 'linear-gradient(135deg, #c084fc 0%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Phenotype Pattern
          </span>
        </h2>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          maxWidth: '620px',
          margin: '0 auto 2rem',
          lineHeight: '1.6'
        }}>
          Menopause is not a single uniform symptom experience. Utilizing unsupervised Gaussian Mixture
          clustering trained on longitudinal cohort data, this self-assessment maps your symptoms
          across 4 clinical domains to identify your unique phenotype.
        </p>

        <button
          onClick={onStart}
          className="btn-primary"
          style={{ fontSize: '1.08rem', padding: '1rem 2.25rem' }}
        >
          Begin Self-Assessment (18 Questions) &rarr;
        </button>
      </div>

      {/* 4 Clinical Domains Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.25rem', borderTop: '3px solid var(--domain-vaso)' }}>
          <span className="domain-badge vasomotor" style={{ marginBottom: '0.65rem' }}>Vasomotor</span>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Thermoregulatory</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Hot flashes, nocturnal night sweats, cold sweats.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderTop: '3px solid var(--domain-psych)' }}>
          <span className="domain-badge psychological" style={{ marginBottom: '0.65rem' }}>Psychological</span>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Affective & Cognitive</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Mood swings, anxiety, brain fog, irritability.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderTop: '3px solid var(--domain-somatic)' }}>
          <span className="domain-badge somatic" style={{ marginBottom: '0.65rem' }}>Somatic</span>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Physical</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Joint stiffness, headaches, vaginal dryness, palpitations.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderTop: '3px solid var(--domain-sleep)' }}>
          <span className="domain-badge sleep" style={{ marginBottom: '0.65rem' }}>Sleep</span>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Rest Continuity</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Sleep onset latency, nocturnal waking, early awakenings.
          </p>
        </div>
      </div>

      {/* Privacy Callout */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.84rem',
        color: 'var(--text-secondary)'
      }}>
        <span style={{ fontSize: '1.2rem' }}>🔒</span>
        <span>
          <strong>100% Client-Side Privacy:</strong> Your answers are never stored in a patient database.
          All draft progress is stored locally in your browser session.
        </span>
      </div>
    </div>
  );
}
