import React from 'react';

const PHENOTYPE_DETAILS = {
  'Phenotype A': {
    fullName: 'Phenotype A (Lower Burden Trajectory)',
    badgeLabel: 'Mild / Intermittent Profile',
    badgeColor: 'var(--color-primary)',
    badgeBg: 'var(--color-primary-light)',
    summary:
      'Lower overall symptom burden across all 4 clinical domains. Symptoms, when present, tend to be isolated and episodic rather than compounding.',
    characteristics: [
      'Mild or occasional thermoregulatory sensations (hot flashes, night sweats)',
      'Preserved sleep architecture and nocturnal continuity',
      'Stable affective mood with minimal cognitive brain fog',
      'Infrequent musculoskeletal or pelvic discomfort',
    ],
    guidance:
      'Focus on lifestyle optimization, stress resilience, calcium/vitamin D intake, and regular physical exercise to maintain healthy transition equilibrium.',
  },
  'Phenotype B': {
    fullName: 'Phenotype B (Elevated Multi-Domain Trajectory)',
    badgeLabel: 'Elevated / Multi-Domain Profile',
    badgeColor: 'var(--color-accent)',
    badgeBg: 'var(--color-accent-light)',
    summary:
      'Elevated multi-domain symptom burden. Features concurrent challenges spanning vasomotor neurovascular signals, psychological fluctuations, musculoskeletal aching, and disrupted nocturnal rest.',
    characteristics: [
      'Frequent or intense vasomotor flushing and nocturnal night sweats',
      'Compounding sleep fragmentation and early morning awakening',
      'Heightened mood volatility, irritability, and episodes of forgetfulness',
      'Notable somatic stiffness, joint aches, or urogenital dryness',
    ],
    guidance:
      'Holistic, multi-modal clinical support is recommended. Discuss evidence-based hormonal and non-hormonal therapeutic options, sleep therapies (CBT-I), and targeted nutritional adjustments with your physician.',
  },
};

export default function PhenotypeCard({ phenotype = 'Phenotype A', interpretation }) {
  // Normalize phenotype key
  const isPhenoB = phenotype.includes('B');
  const key = isPhenoB ? 'Phenotype B' : 'Phenotype A';
  const details = PHENOTYPE_DETAILS[key];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '2.5rem 2.25rem',
        borderRadius: 'var(--radius-xl)',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `6px solid ${details.badgeColor}`,
        background: '#FFFFFF',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <span
          style={{
            fontSize: '0.76rem',
            fontWeight: '700',
            padding: '0.35rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: details.badgeBg,
            color: details.badgeColor,
            border: `1px solid ${details.badgeColor}33`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {details.badgeLabel}
        </span>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          SWAN GMM Subtyping
        </span>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '2.2rem',
        letterSpacing: '-0.02em',
        marginBottom: '0.75rem',
        color: 'var(--text-primary)',
        lineHeight: '1.2'
      }}>
        {details.fullName}
      </h2>

      <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: '1.75rem' }}>
        {interpretation || details.summary}
      </p>

      {/* Characteristics List */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h4 style={{
          fontSize: '0.78rem',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.85rem'
        }}>
          Key Clinical Characteristics
        </h4>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {details.characteristics.map((char, idx) => (
            <li
              key={idx}
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                lineHeight: '1.5',
              }}
            >
              <span style={{ color: details.badgeColor, fontWeight: 'bold' }}>&rarr;</span>
              <span>{char}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Next Steps */}
      <div
        style={{
          padding: '1.1rem 1.35rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h4 style={{ fontSize: '0.76rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.35rem' }}>
          Consultation Guidance
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.55', margin: 0 }}>
          {details.guidance}
        </p>
      </div>
    </div>
  );
}
