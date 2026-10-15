import React from 'react';

export default function Navbar({ healthStatus, onResetDraft, answeredCount }) {
  const isHealthy = healthStatus?.status === 'healthy';

  return (
    <header className="navbar glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.9rem 1.5rem',
      margin: '1rem 0 1.5rem',
      borderRadius: 'var(--radius-lg)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#fff'
        }}>
          M
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            MenoPhenotype
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '700',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(168, 85, 247, 0.18)',
              color: 'var(--color-primary)',
              border: '1px solid rgba(168, 85, 247, 0.3)'
            }}>
              SWAN AI
            </span>
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Phenotype Pattern Matching & Self-Assessment
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Backend Health Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.78rem',
          color: isHealthy ? '#10b981' : '#f59e0b',
          background: isHealthy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isHealthy ? '#10b981' : '#f59e0b',
            boxShadow: isHealthy ? '0 0 8px #10b981' : 'none'
          }} />
          {isHealthy ? 'Model Engine Ready' : 'Connecting Engine...'}
        </div>

        {answeredCount > 0 && (
          <button
            onClick={onResetDraft}
            className="btn-ghost"
            title="Clear all answers and restart"
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}
          >
            Clear Draft
          </button>
        )}
      </div>
    </header>
  );
}
