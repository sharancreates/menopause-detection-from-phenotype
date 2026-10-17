import React from 'react';

export default function Navbar({ healthStatus, onResetDraft, answeredCount }) {
  const isHealthy = healthStatus?.status === 'healthy';

  return (
    <header className="navbar glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.75rem',
      margin: '1.25rem 0 1.5rem',
      borderRadius: 'var(--radius-lg)',
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-card)'
    }}>
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontFamily: 'var(--font-serif)',
          fontSize: '1.25rem',
          fontWeight: '500',
          boxShadow: '0 2px 8px rgba(52, 78, 65, 0.2)'
        }}>
          C
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: '700',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)'
            }}>
              CASCAID
            </span>
            <span style={{ color: 'var(--border-card)', fontSize: '0.85rem' }}>•</span>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em'
            }}>
              MenoPhenotype
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: '600',
              padding: '0.18rem 0.55rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              border: '1px solid rgba(52, 78, 65, 0.2)',
              letterSpacing: '0.04em'
            }}>
              SWAN COHORT
            </span>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '1px' }}>
            Unsupervised Subtyping & Clinical Consultation Brief
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
        {/* Backend Health Badge with Cascaid status pulse */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.78rem',
          fontWeight: '500',
          color: isHealthy ? 'var(--color-primary)' : '#B58342',
          background: isHealthy ? 'var(--color-primary-light)' : 'rgba(181, 131, 66, 0.1)',
          padding: '0.38rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          border: `1px solid ${isHealthy ? 'rgba(52, 78, 65, 0.2)' : 'rgba(181, 131, 66, 0.3)'}`
        }}>
          <span className="status--circle" style={{
            backgroundColor: isHealthy ? 'var(--color-mint)' : '#B58342',
            marginRight: '8px'
          }} />
          {isHealthy ? 'Model Engine Ready' : 'Connecting Engine...'}
        </div>

        {answeredCount > 0 && (
          <button
            onClick={onResetDraft}
            className="btn-ghost"
            title="Clear all responses and restart assessment"
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}
          >
            Clear Draft
          </button>
        )}
      </div>
    </header>
  );
}
