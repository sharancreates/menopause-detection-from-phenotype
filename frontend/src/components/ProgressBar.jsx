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
    <div className="progress-container" style={{ margin: '1.25rem 0 2.25rem' }}>
      {/* Top Step Tab Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.6rem',
        overflowX: 'auto',
        paddingBottom: '0.85rem',
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
                gap: '0.45rem',
                padding: '0.5rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: isActive
                  ? 'var(--color-primary)'
                  : isPassed
                  ? 'rgba(52, 78, 65, 0.3)'
                  : 'var(--border-subtle)',
                background: isActive
                  ? 'var(--color-primary)'
                  : isPassed
                  ? 'var(--bg-subtle)'
                  : '#FFFFFF',
                color: isActive ? '#FFFFFF' : isPassed ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '0.84rem',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 2px 8px rgba(52, 78, 65, 0.18)' : 'var(--shadow-sm)'
              }}
            >
              <span style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: isActive
                  ? 'rgba(255, 255, 255, 0.25)'
                  : isPassed
                  ? 'var(--color-primary)'
                  : 'var(--bg-subtle)',
                color: isActive || isPassed ? '#FFFFFF' : 'var(--text-muted)',
                fontSize: '0.68rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700'
              }}>
                {isPassed ? '✓' : step.id}
              </span>
              <span>{step.label}</span>
              {step.count && (
                <span style={{
                  fontSize: '0.72rem',
                  opacity: isActive ? 0.85 : 0.65,
                  fontWeight: '400'
                }}>
                  ({step.count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Status Line */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        marginBottom: '0.5rem'
      }}>
        <span style={{ fontWeight: '500' }}>Clinical Assessment Progress</span>
        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
          {answeredCount} of {totalItems} items completed ({completionPercentage}%)
        </span>
      </div>

      {/* Visual Progress Track */}
      <div style={{
        width: '100%',
        height: '6px',
        backgroundColor: '#EAE3D8',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${completionPercentage}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #344E41, #5BAE86)',
          borderRadius: 'var(--radius-full)',
          transition: 'width 300ms ease-in-out'
        }} />
      </div>
    </div>
  );
}
