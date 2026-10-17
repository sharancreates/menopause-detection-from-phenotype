import React from 'react';
import QuestionItem from './QuestionItem.jsx';

const DOMAIN_METADATA = {
  vasomotor: {
    title: 'Vasomotor Domain',
    subtitle: 'Thermoregulatory Symptoms',
    description: 'Hot flashes and nocturnal night sweats represent the hallmark neurovascular signals of the menopausal transition.',
    colorVar: 'var(--domain-vaso)',
  },
  psychological: {
    title: 'Psychological Domain',
    subtitle: 'Affective & Cognitive Well-being',
    description: 'Hormonal fluctuations interact with neurotransmitter pathways, influencing emotional resilience, mood stability, and recall.',
    colorVar: 'var(--domain-psych)',
  },
  somatic: {
    title: 'Somatic Domain',
    subtitle: 'Physical & Musculoskeletal Sensations',
    description: 'Estrogen receptors located throughout joint tissue, vascular pathways, and tissues influence systemic physical comfort.',
    colorVar: 'var(--domain-somatic)',
  },
  sleep: {
    title: 'Sleep Continuity Domain',
    subtitle: 'Nocturnal Rest & Sleep Architecture',
    description: 'Disrupted sleep architecture during the climacteric transition directly impacts daytime vitality, recovery, and cognitive stamina.',
    colorVar: 'var(--domain-sleep)',
  },
};

export default function StepDomain({ domainKey, symptoms, likertScale, responses, onSelect, onNext, onPrev }) {
  const meta = DOMAIN_METADATA[domainKey] || {
    title: `${domainKey} Domain`,
    subtitle: 'Clinical Subsystem',
    description: '',
    colorVar: 'var(--color-primary)',
  };

  const domainSymptoms = symptoms.filter((s) => s.domain === domainKey);
  const answeredInDomain = domainSymptoms.filter(
    (s) => responses[s.id] !== undefined && responses[s.id] !== null
  ).length;
  const isComplete = answeredInDomain === domainSymptoms.length;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Domain Title Header */}
      <div className="glass-panel" style={{
        padding: '2rem 2.25rem',
        marginBottom: '2rem',
        borderLeft: `5px solid ${meta.colorVar}`,
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <span className={`domain-badge ${domainKey}`} style={{ marginBottom: '0.65rem' }}>
            {meta.subtitle}
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.9rem',
            marginBottom: '0.45rem',
            color: 'var(--text-primary)'
          }}>
            {meta.title}
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '620px', lineHeight: '1.55' }}>
            {meta.description}
          </p>
        </div>

        {/* Completion badge */}
        <div style={{
          textAlign: 'right',
          background: 'var(--bg-subtle)',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: meta.colorVar,
            lineHeight: 1
          }}>
            {answeredInDomain} / {domainSymptoms.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '3px' }}>
            {isComplete ? 'Domain Complete ✓' : 'Items Answered'}
          </div>
        </div>
      </div>

      {/* List of Symptoms */}
      <div style={{ marginBottom: '2rem' }}>
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
        padding: '1.25rem 0',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={onPrev}
          className="btn-secondary"
        >
          &larr; Previous Domain
        </button>

        <button
          onClick={onNext}
          className="btn-primary"
        >
          {domainKey === 'sleep' ? 'Review All Responses &rarr;' : 'Continue to Next Domain &rarr;'}
        </button>
      </div>
    </div>
  );
}
