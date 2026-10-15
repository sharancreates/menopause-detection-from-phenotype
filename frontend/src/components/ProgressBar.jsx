import React from 'react';

const STEPS = [
  { id: 0, label: 'Overview', domain: null },
  { id: 1, label: 'Vasomotor', domain: 'vasomotor', count: 3 },
  { id: 2, label: 'Psychological', domain: 'psychological', count: 6 },
  { id: 3, label: 'Somatic', domain: 'somatic', count: 6 },
  { id: 4, label: 'Sleep', domain: 'sleep', count: 3 },
  { id: 5, label: 'Review', domain: null },
];

export default function ProgressBar({ currentStep, onStepClick, answeredCount, totalItems, completionPercentage }) {
  return (
    <div className="progress-container" style={{ margin: '1.25rem 0 2rem' }}>
      {/* Top step tab navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        scrollbarWidth: 'none'
      }}>
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isPassed = currentStep > step.id;

          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: isActive
                  ? 'var(--color-primary)'
                  : isPassed
                  ? 'rgba(168, 85, 247, 0.35)'
                  : 'var(--border-subtle)',
                background: isActive
                  ? 'rgba(168, 85, 247, 0.18)'
                  : isPassed
                  ? 'rgba(255, 255, 255, 0.04)'
                  : 'transparent',
                color: isActive ? '#fff' : isPassed ? 'var(--text-secondary)' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: isActive
                  ? 'var(--color-primary)'
                  : isPassed
                  ? 'rgba(168, 85, 247, 0.4)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '0.68rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700'
              }}>
                {isPassed ? '✓' : step.id}
              </span>
              {step.label}
              {step.count && (
                <span style={{ fontSize: '0.7rem', opacity: 0.65 }}>({step.count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress status line */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        marginBottom: '0.4rem'
      }}>
        <span>Assessment Progress</span>
        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
          {answeredCount} of {totalItems} items answered ({completionPercentage}%)
        </span>
      </div>

      {/* Visual progress track */}
      <div style={{
        width: '100%',
        height: '6px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${completionPercentage}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #a855f7, #06b6d4)',
          borderRadius: 'var(--radius-full)',
          transition: 'width 300ms ease-in-out',
          boxShadow: '0 0 12px rgba(168, 85, 247, 0.6)'
        }} />
      </div>
    </div>
  );
}
