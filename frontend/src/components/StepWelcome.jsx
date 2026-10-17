import React from 'react';

export default function StepWelcome({ onStart, totalSymptoms }) {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Editorial Hero Section */}
      <section className="glass-panel" style={{
        padding: '3.75rem 2.5rem',
        textAlign: 'center',
        marginBottom: '2rem',
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Cascaid Status Pulse Eyebrow */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div className="status">
            <span className="status--circle" />
            <span>SWAN LONGITUDINAL COHORT • ICPSR 32961</span>
          </div>
        </div>

        {/* Editorial Headline with Italic Emphasis */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.4rem)',
          letterSpacing: '-0.025em',
          marginBottom: '1.25rem',
          lineHeight: '1.14',
          color: 'var(--text-primary)'
        }}>
          Your health, guided by what <br />
          <em>you feel most.</em>
        </h1>

        <p style={{
          fontSize: '1.12rem',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 2.25rem',
          lineHeight: '1.65',
          fontWeight: '400'
        }}>
          Menopause is not a uniform symptom experience. Utilizing unsupervised Gaussian Mixture
          pattern-matching trained on the multi-ethnic Study of Women's Health Across the Nation (SWAN),
          this clinical tool maps 18 symptom markers across 4 physiological domains into an actionable
          consultation brief.
        </p>

        {/* Primary Action Button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={onStart}
            className="btn-primary"
            style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}
          >
            Begin Self-Assessment (18 questions, ~3 min) &rarr;
          </button>
        </div>
      </section>

      {/* Cohort Statistical Impact Bar (Cascaid Counter-Section style) */}
      <section className="glass-panel" style={{
        padding: '1.75rem 2rem',
        marginBottom: '2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '1.5rem',
        textAlign: 'center',
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ borderRight: '1px solid var(--border-subtle)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-primary)', lineHeight: 1.1 }}>
            3,302
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
            Multi-Ethnic Cohort
          </div>
        </div>

        <div style={{ borderRight: '1px solid var(--border-subtle)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-primary)', lineHeight: 1.1 }}>
            10+
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
            Annual Clinical Visits
          </div>
        </div>

        <div style={{ borderRight: '1px solid var(--border-subtle)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-accent)', lineHeight: 1.1 }}>
            18
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
            Phenotypic Biomarkers
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-mint)', lineHeight: 1.1 }}>
            4
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
            Latent Trajectories
          </div>
        </div>
      </section>

      {/* Cascaid "Complexity to Clarity" 2-Column Story Blocks */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Block 1: Proactive Defense */}
        <div className="glass-panel" style={{
          padding: '2.25rem 2rem',
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '0.75rem'
          }}>
            PROACTIVE DEFENSE
          </div>
          <h3 style={{ fontSize: '1.65rem', marginBottom: '0.85rem', lineHeight: '1.25' }}>
            What if your body had a <em>check engine light?</em>
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Most hormonal shifts start silently years before severe disruption. MenoPhenotype uncovers early
            co-occurrence patterns across thermoregulatory, affective, physical, and sleep signals — giving
            you clear data to act while it still makes the largest difference.
          </p>
        </div>

        {/* Block 2: Dynamic Offense */}
        <div className="glass-panel" style={{
          padding: '2.25rem 2rem',
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--color-primary)',
            marginBottom: '0.75rem'
          }}>
            DYNAMIC NAVIGATION
          </div>
          <h3 style={{ fontSize: '1.65rem', marginBottom: '0.85rem', lineHeight: '1.25' }}>
            What if your care had an <em>actionable strategy?</em>
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Cascaid turns symptom overload into clinical clarity. Rather than generic advice, obtain a customized
            evidence-based consultation brief with prioritized questions for your physician, normative cohort comparisons,
            and individualized discussion guides.
          </p>
        </div>
      </section>

      {/* 4 Clinical Domains Grid */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.35rem' }}>4 Living Systems</h4>
          <h2 style={{ fontSize: '1.9rem' }}>Comprehensive <em>phenotype domains</em></h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem'
        }}>
          <div className="glass-panel" style={{
            padding: '1.5rem',
            borderTop: '4px solid var(--domain-vaso)',
            background: '#FFFFFF'
          }}>
            <span className="domain-badge vasomotor" style={{ marginBottom: '0.85rem' }}>Vasomotor</span>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Thermoregulatory</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Hot flashes, nocturnal night sweats, sudden cold sweats.
            </p>
          </div>

          <div className="glass-panel" style={{
            padding: '1.5rem',
            borderTop: '4px solid var(--domain-psych)',
            background: '#FFFFFF'
          }}>
            <span className="domain-badge psychological" style={{ marginBottom: '0.85rem' }}>Psychological</span>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Affective & Cognitive</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Mood swings, anxiety, mental fog, heightened irritability.
            </p>
          </div>

          <div className="glass-panel" style={{
            padding: '1.5rem',
            borderTop: '4px solid var(--domain-somatic)',
            background: '#FFFFFF'
          }}>
            <span className="domain-badge somatic" style={{ marginBottom: '0.85rem' }}>Somatic</span>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Physical Vitality</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Joint stiffness, recurrent headaches, muscle aches, fatigue.
            </p>
          </div>

          <div className="glass-panel" style={{
            padding: '1.5rem',
            borderTop: '4px solid var(--domain-sleep)',
            background: '#FFFFFF'
          }}>
            <span className="domain-badge sleep" style={{ marginBottom: '0.85rem' }}>Sleep</span>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Rest Continuity</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Sleep latency, frequent night awakenings, unrefreshed mornings.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Guarantee Banner */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.2rem 1.6rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        marginBottom: '1rem'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          flexShrink: 0,
          border: '1px solid var(--border-subtle)'
        }}>
          🛡️
        </div>
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>100% Client-Side Privacy:</strong> Your symptom responses are never sold or stored on centralized patient tracking databases. Your session state is preserved locally in your browser for seamless clinical brief generation.
        </div>
      </section>
    </div>
  );
}
