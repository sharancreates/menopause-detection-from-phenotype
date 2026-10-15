import React from 'react';

const DOMAIN_INFO = [
  { key: 'vasomotor', name: 'Vasomotor Domain', color: 'var(--domain-vaso)', total: 3 },
  { key: 'psychological', name: 'Psychological Domain', color: 'var(--domain-psych)', total: 6 },
  { key: 'somatic', name: 'Somatic Domain', color: 'var(--domain-somatic)', total: 6 },
  { key: 'sleep', name: 'Sleep Continuity Domain', color: 'var(--domain-sleep)', total: 3 },
];

export default function StepReview({ responses, symptoms, onGoToStep, onPrev, onSubmit, isSubmitting, submitError }) {
  const answeredTotal = Object.values(responses).filter((v) => v !== null && v !== undefined).length;
  const unansweredCount = 18 - answeredTotal;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Review Header Card */}
      <div className="glass-panel" style={{
        padding: '2rem 2.5rem',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(168, 85, 247, 0.15)',
          color: 'var(--color-primary)',
          fontSize: '1.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          border: '1px solid rgba(168, 85, 247, 0.3)'
        }}>
          📋
        </div>

        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          Assessment Summary & Review
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
          Please verify your symptom frequencies before running the machine learning clustering model.
        </p>
      </div>

      {/* Domain Breakdown Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {DOMAIN_INFO.map((d, idx) => {
          const domainSymptoms = symptoms.filter((s) => s.domain === d.key);
          const answeredInDomain = domainSymptoms.filter(
            (s) => responses[s.id] !== undefined && responses[s.id] !== null
          ).length;
          const isComplete = answeredInDomain === d.total;

          return (
            <div
              key={d.key}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderLeft: `3px solid ${d.color}`,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onClick={() => onGoToStep(idx + 1)}
              title="Click to review or edit this domain"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className={`domain-badge ${d.key}`} style={{ fontSize: '0.68rem' }}>
                  {d.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.75rem', color: isComplete ? '#10b981' : '#f59e0b', fontWeight: '600' }}>
                  {isComplete ? 'Complete' : 'Incomplete'}
                </span>
              </div>

              <div style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.2rem' }}>
                {answeredInDomain} / {d.total}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Items Answered &rarr; Edit
              </div>
            </div>
          );
        })}
      </div>

      {/* Unanswered Items Notice */}
      {unansweredCount > 0 && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          color: '#fbbf24',
          fontSize: '0.86rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.1rem' }}>ℹ️</span>
          <div>
            <strong>{unansweredCount} item(s) left unanswered:</strong> Any missing symptoms will be
            automatically imputed with the median training values from the SWAN research cohort.
            You may still submit for pattern matching now, or click any domain above to complete them.
          </div>
        </div>
      )}

      {/* Submission Error Alert */}
      {submitError && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          color: '#fda4af',
          fontSize: '0.86rem',
          marginBottom: '1.5rem'
        }}>
          <strong>Submission Error:</strong> {submitError}
        </div>
      )}

      {/* Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <button onClick={onPrev} className="btn-secondary">
          &larr; Back to Questions
        </button>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="btn-primary"
          style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}
        >
          {isSubmitting ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
              Analyzing Phenotype Patterns...
            </>
          ) : (
            'Submit for Phenotype Analysis &rarr;'
          )}
        </button>
      </div>
    </div>
  );
}
