import React from 'react';
import QuestionItem from './QuestionItem.jsx';

const DOMAIN_METADATA = {
  vasomotor: {
    title: 'Vasomotor Domain',
    subtitle: 'Thermoregulatory Symptoms',
    description: 'Hot flashes and night sweats represent the hallmark neurovascular signals of the menopausal transition.',
    colorVar: 'var(--domain-vaso)',
  },
  psychological: {
    title: 'Psychological Domain',
    subtitle: 'Affective & Cognitive Well-being',
    description: 'Hormonal fluctuations interact with neurotransmitter pathways, influencing mood stability and cognitive recall.',
    colorVar: 'var(--domain-psych)',
  },
  somatic: {
    title: 'Somatic Domain',
    subtitle: 'Physical & Musculoskeletal Sensations',
    description: 'Estrogen receptors located throughout joint tissue, vascular walls, and pelvic organs influence physical comfort.',
    colorVar: 'var(--domain-somatic)',
  },
  sleep: {
    title: 'Sleep Continuity Domain',
    subtitle: 'Nocturnal Rest & Sleep Quality',
    description: 'Disrupted sleep architecture during the climacteric transition directly impacts daytime energy and resilience.',
    colorVar: 'var(--domain-sleep)',
  },
};

export default function StepDomain({ domainKey, symptoms, likertScale, responses, onSelect, onNext, onPrev }) {
  const meta = DOMAIN_METADATA[domainKey] || {
    title: `${domainKey} Domain`,
    description: '',
    colorVar: 'var(--color-primary)',
  };

  const domainSymptoms = symptoms.filter((s) => s.domain === domainKey);
  const answeredInDomain = domainSymptoms.filter(
    (s) => responses[s.id] !== undefined && responses[s.id] !== null
  ).length;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Domain Title Header */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        marginBottom: '1.5rem',
        borderLeft: `4px solid ${meta.colorVar}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span className={`domain-badge ${domainKey}`} style={{ marginBottom: '0.45rem' }}>
            {meta.subtitle}
          </span>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>
            {meta.title}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '580px' }}>
            {meta.description}
          </p>
        </div>

        {/* Completion badge */}
        <div style={{
          textAlign: 'right',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '0.6rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', color: meta.colorVar }}>
            {answeredInDomain} / {domainSymptoms.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Domain Answered
          </div>
        </div>
      </div>

      {/* List of Symptoms */}
      <div>
        {domainSymptoms.map((symptom, idx) => (
          <QuestionItem
            key={symptom.id}
            symptom={symptom}
            index={idx}
            totalInDomain={domainSymptoms.length}
            likertScale={likertScale}
            currentValue={responses[symptom.id]}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <button onClick={onPrev} className="btn-secondary">
          &larr; Previous Step
        </button>

        <button onClick={onNext} className="btn-primary">
          Continue to Next Domain &rarr;
        </button>
      </div>
    </div>
  );
}
