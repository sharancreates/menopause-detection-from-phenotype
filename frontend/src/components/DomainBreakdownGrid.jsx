import React, { useState } from 'react';

const DOMAIN_METADATA = [
  {
    key: 'vasomotor',
    title: 'Vasomotor Domain',
    subtitle: 'Thermoregulatory Symptoms',
    color: 'var(--domain-vaso)',
    swanBenchmark: 1.15,
    symptomIds: ['HOTFLAS0', 'NITESWE0', 'COLDSWE0'],
  },
  {
    key: 'psychological',
    title: 'Psychological Domain',
    subtitle: 'Affective & Cognitive Well-being',
    color: 'var(--domain-psych)',
    swanBenchmark: 1.45,
    symptomIds: ['FEELBLU0', 'IRRITAB0', 'NRVOUS0', 'FORGET0', 'MOODCHG0', 'FEARFULA0'],
  },
  {
    key: 'somatic',
    title: 'Somatic Domain',
    subtitle: 'Physical & Musculoskeletal Sensations',
    color: 'var(--domain-somatic)',
    swanBenchmark: 1.25,
    symptomIds: ['STIFF0', 'HDACHE0', 'VAGINDR0', 'HARTRAC0', 'DIZZY0', 'LEAKURI0'],
  },
  {
    key: 'sleep',
    title: 'Sleep Continuity Domain',
    subtitle: 'Nocturnal Rest & Sleep Architecture',
    color: 'var(--domain-sleep)',
    swanBenchmark: 1.40,
    symptomIds: ['TRBLSLE0', 'WAKEUP0', 'WAKEARL0'],
  },
];

const LIKERT_LABELS = {
  0: 'Not at all (0 days)',
  1: '1–5 days (Occasional)',
  2: '6–8 days (Every other day)',
  3: '9–13 days (Frequent)',
  4: 'Every day (Daily continuous)',
};

function getSeverityTier(score) {
  if (score < 1.0) return { label: 'Mild', color: 'var(--color-mint)', bg: 'var(--color-mint-light)' };
  if (score < 2.0) return { label: 'Moderate', color: 'var(--color-primary)', bg: 'var(--color-primary-light)' };
  if (score < 3.0) return { label: 'Elevated', color: '#B58342', bg: 'rgba(181, 131, 66, 0.12)' };
  return { label: 'Severe', color: 'var(--color-accent)', bg: 'var(--color-accent-light)' };
}

export default function DomainBreakdownGrid({ responses = {}, symptoms = [] }) {
  const [expandedDomains, setExpandedDomains] = useState({});

  const toggleExpand = (domainKey) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [domainKey]: !prev[domainKey],
    }));
  };

  const symptomMap = symptoms.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.75rem',
          letterSpacing: '-0.02em',
          marginBottom: '0.35rem',
          color: 'var(--text-primary)'
        }}>
          Domain Severity & Symptom Breakdown
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Detailed examination of quantified symptom frequencies compared directly against SWAN longitudinal medians.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {DOMAIN_METADATA.map((domain) => {
          const domainSymptoms = domain.symptomIds.map((id) => symptomMap[id] || { id, name: id });
          const values = domain.symptomIds
            .map((id) => (responses[id] !== undefined && responses[id] !== null ? Number(responses[id]) : null))
            .filter((v) => v !== null);

          const avgScore = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
          const severity = getSeverityTier(avgScore);
          const isExpanded = !!expandedDomains[domain.key];
          const diffFromSwan = avgScore - domain.swanBenchmark;
          const diffText =
            diffFromSwan > 0
              ? `+${diffFromSwan.toFixed(2)} vs SWAN baseline`
              : `${diffFromSwan.toFixed(2)} vs SWAN baseline`;

          return (
            <div
              key={domain.key}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                borderRadius: 'var(--radius-lg)',
                borderTop: `4px solid ${domain.color}`,
                background: '#FFFFFF',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <span className={`domain-badge ${domain.key}`}>
                    {domain.subtitle}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      padding: '0.22rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      color: severity.color,
                      background: severity.bg,
                      border: `1px solid ${severity.color}33`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {severity.label} Burden
                  </span>
                </div>

                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  marginBottom: '0.45rem',
                  color: 'var(--text-primary)',
                  textTransform: 'none',
                  fontWeight: '500',
                  letterSpacing: 'normal'
                }}>
                  {domain.title}
                </h4>

                {/* Score Summary */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    fontWeight: '600',
                    color: domain.color,
                    lineHeight: 1
                  }}>
                    {avgScore.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    / 4.0 max scale
                  </span>
                </div>

                {/* Progress bar visual */}
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#EAE3D8',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    marginBottom: '0.65rem',
                  }}
                >
                  <div
                    style={{
                      width: `${(avgScore / 4.0) * 100}%`,
                      height: '100%',
                      backgroundColor: domain.color,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 400ms ease',
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.35rem' }}>
                  {diffText} (SWAN Cohort Avg: {domain.swanBenchmark.toFixed(2)})
                </div>
              </div>

              {/* Symptom Drill-down Toggle */}
              <div>
                <button
                  onClick={() => toggleExpand(domain.key)}
                  className="btn-ghost"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.82rem',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>{isExpanded ? 'Hide Symptom Items' : 'View Symptom Ratings'}</span>
                  <span>{isExpanded ? '▲' : '▼'} ({domainSymptoms.length})</span>
                </button>

                {/* Expanded Symptom List */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.55rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    {domainSymptoms.map((s) => {
                      const val = responses[s.id];
                      const hasVal = val !== undefined && val !== null;
                      return (
                        <div
                          key={s.id}
                          style={{
                            fontSize: '0.82rem',
                            padding: '0.55rem 0.75rem',
                            background: 'var(--bg-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                            {s.name}
                          </span>
                          <span style={{
                            color: hasVal ? domain.color : 'var(--text-muted)',
                            fontWeight: '600',
                            fontSize: '0.76rem',
                            whiteSpace: 'nowrap',
                          }}>
                            {hasVal ? LIKERT_LABELS[val] || `Score ${val}` : 'Not answered'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
