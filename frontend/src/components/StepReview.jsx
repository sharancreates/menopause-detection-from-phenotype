import React from 'react';

const DOMAIN_INFO = [
  { key: 'vasomotor', name: 'Vasomotor Domain', color: 'var(--domain-vaso)', total: 3 },
  { key: 'psychological', name: 'Psychological Domain', color: 'var(--domain-psych)', total: 6 },
  { key: 'somatic', name: 'Somatic Domain', color: 'var(--domain-somatic)', total: 6 },
  { key: 'sleep', name: 'Sleep Continuity Domain', color: 'var(--domain-sleep)', total: 3 },
];

export default function StepReview({ responses, symptoms, onGoToStep, onPrev, onSubmit, isSubmitting, submitError }) {
  const answeredTotal = symptoms.filter((s) => responses[s.id] !== undefined && responses[s.id] !== null).length;
  const unansweredCount = 18 - answeredTotal;

  const age = responses.age_range;
  const regularity = responses.cycle_regularity;
  const timeSince = responses.time_since_period;
  const hasStaging = Boolean(age || regularity || timeSince);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Review Header Card */}
      <div className="glass-panel" style={{
        padding: '2.5rem 2.25rem',
        marginBottom: '2rem',
        textAlign: 'center',
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          border: '1px solid rgba(52, 78, 65, 0.2)'
        }}>
          📋
        </div>

        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2.2rem',
          marginBottom: '0.65rem',
          color: 'var(--text-primary)'
        }}>
          Review Your <em>Clinical Assessment</em>
        </h2>
        <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', lineHeight: '1.6' }}>
          Please review your cycle transition intake and 18 symptom responses across the 4 clinical domains
          before generating your STRAW+10 menopause transition stage and phenotype playbook.
        </p>
      </div>

      {/* Cycle Staging Summary Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          marginBottom: '2rem',
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🩸</span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              Step 1: Cycle & Transition Staging
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {hasStaging
              ? `Age: ${age || 'Not specified'} • Regularity: ${regularity || 'Not specified'} • Last Period: ${timeSince || 'Not specified'}`
              : 'No cycle information specified (optional)'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onGoToStep(1)}
          className="btn-secondary"
          style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
        >
          ✏️ Edit Cycle Answers
        </button>
      </div>

      {/* Domain Breakdown Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
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
                padding: '1.5rem',
                borderLeft: `4px solid ${d.color}`,
                background: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: 'var(--shadow-card)'
              }}
              onClick={() => onGoToStep(idx + 2)}
              title="Click to review or edit this domain"
            >

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span className={`domain-badge ${d.key}`} style={{ fontSize: '0.7rem' }}>
                  {d.name.split(' ')[0]}
                </span>
                <span style={{
                  fontSize: '0.74rem',
                  color: isComplete ? 'var(--color-mint)' : '#B58342',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {isComplete ? 'Complete ✓' : 'Incomplete'}
                </span>
              </div>

              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: '600',
                marginBottom: '0.25rem',
                color: 'var(--text-primary)'
              }}>
                {answeredInDomain} / {d.total}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Items completed &rarr; <span style={{ textDecoration: 'underline' }}>Edit</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unanswered Items Notice */}
      {unansweredCount > 0 && (
        <div style={{
          padding: '1.2rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(181, 131, 66, 0.08)',
          border: '1px solid rgba(181, 131, 66, 0.25)',
          color: '#8A5D20',
          fontSize: '0.88rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.85rem',
          lineHeight: '1.55'
        }}>
          <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
          <div>
            <strong>{unansweredCount} item(s) left unanswered:</strong> Any missing symptom ratings will
            be automatically imputed using median research values from the SWAN longitudinal training cohort.
            You can proceed to analysis now, or click any domain above to complete unanswered items.
          </div>
        </div>
      )}

      {/* Submission Error Alert */}
      {submitError && (
        <div style={{
          padding: '1.2rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(200, 109, 81, 0.1)',
          border: '1px solid rgba(200, 109, 81, 0.3)',
          color: 'var(--color-accent)',
          fontSize: '0.88rem',
          marginBottom: '2rem'
        }}>
          <strong>Analysis Service Error:</strong> {submitError}
        </div>
      )}

      {/* Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '1.75rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <button onClick={onPrev} className="btn-secondary">
          &larr; Back to Questions
        </button>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="btn-primary"
          style={{ padding: '0.95rem 2.5rem', fontSize: '1.05rem' }}
        >
          {isSubmitting ? (
            <>
              <span style={{ animation: 'circle-pulse 1s infinite' }}>⏳</span>
              Inferring Latent Phenotype...
            </>
          ) : (
            'Generate Phenotype Consultation Brief &rarr;'
          )}
        </button>
      </div>
    </div>
  );
}
