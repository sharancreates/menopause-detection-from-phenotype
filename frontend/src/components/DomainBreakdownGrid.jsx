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
    subtitle: 'Nocturnal Rest & Sleep Quality',
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
  if (score < 1.0) return { label: 'Mild', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
  if (score < 2.0) return { label: 'Moderate', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' };
  if (score < 3.0) return { label: 'Elevated', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
  return { label: 'Severe', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' };
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
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.35rem', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Domain Severity Breakdown
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Detailed examination of symptoms, calculated averages, and clinical severity levels.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
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
              ? `+${diffFromSwan.toFixed(2)} above SWAN avg`
              : `${diffFromSwan.toFixed(2)} vs SWAN avg`;

          return (
            <div
              key={domain.key}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                borderTop: `4px solid ${domain.color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className={`domain-badge ${domain.key}`}>
                    {domain.subtitle}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      color: severity.color,
                      background: severity.bg,
                      border: `1px solid ${severity.color}44`,
                    }}
                  >
                    {severity.label} Burden
                  </span>
                </div>

                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  {domain.title}
                </h4>

                {/* Score Summary */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '800', color: domain.color }}>
                    {avgScore.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    / 4.0 max
                  </span>
                </div>

                {/* Progress bar visual */}
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    marginBottom: '0.6rem',
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

                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  {diffText} (SWAN Cohort: {domain.swanBenchmark.toFixed(2)})
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
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.8rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <span>{isExpanded ? 'Hide Symptoms' : 'Drilldown Symptoms'}</span>
                  <span>{isExpanded ? '▲' : '▼'} ({domainSymptoms.length})</span>
                </button>

                {/* Expanded Symptom List */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    {domainSymptoms.map((symptom) => {
                      const val = responses[symptom.id];
                      const hasVal = val !== undefined && val !== null;
                      const scoreNum = hasVal ? Number(val) : 0;

                      return (
                        <div
                          key={symptom.id}
                          style={{
                            padding: '0.55rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                              {symptom.name || symptom.id}
                            </span>
                            <span
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: '700',
                                color: scoreNum >= 3 ? '#f43f5e' : scoreNum >= 2 ? '#f59e0b' : 'var(--text-secondary)',
                              }}
                            >
                              {scoreNum} / 4
                            </span>
                          </div>

                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {hasVal ? LIKERT_LABELS[scoreNum] : 'Not answered (Imputed)'}
                          </div>
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
