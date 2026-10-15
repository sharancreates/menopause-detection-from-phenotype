import React from 'react';

const PHENOTYPE_DETAILS = {
  'Phenotype A': {
    fullName: 'Phenotype A (Lower Burden Profile)',
    badgeLabel: 'Mild / Intermittent Profile',
    badgeColor: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
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
    fullName: 'Phenotype B (Elevated Multi-Domain Profile)',
    badgeLabel: 'Elevated / Multi-Domain Profile',
    badgeColor: '#c084fc',
    badgeBg: 'rgba(168, 85, 247, 0.2)',
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
        padding: '2.25rem 2rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `5px solid ${details.badgeColor}`,
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-25%',
          right: '-10%',
          width: '260px',
          height: '260px',
          background: `radial-gradient(circle, ${details.badgeBg} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            padding: '0.3rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: details.badgeBg,
            color: details.badgeColor,
            border: `1px solid ${details.badgeColor}44`,
          }}
        >
          {details.badgeLabel}
        </span>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          SWAN Unsupervised GMM Clustering
        </span>
      </div>

      <h2 style={{ fontSize: '2rem', letterSpacing: '-0.02em', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {details.fullName}
      </h2>

      <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
        {interpretation || details.summary}
      </p>

      {/* Characteristics List */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.86rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
          Key Clinical Characteristics:
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.45rem' }}>
          {details.characteristics.map((item, idx) => (
            <li
              key={idx}
              style={{
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
              }}
            >
              <span style={{ color: details.badgeColor, fontSize: '0.9rem', lineHeight: '1.3' }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Guidance box */}
      <div
        style={{
          padding: '0.9rem 1.15rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.84rem',
          color: 'var(--text-muted)',
          lineHeight: '1.5',
        }}
      >
        <strong style={{ color: 'var(--text-primary)' }}>Recommended Next Steps: </strong>
        {details.guidance}
      </div>
    </div>
  );
}
