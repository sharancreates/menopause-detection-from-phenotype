import React from 'react';

export default function Footer({ disclaimer }) {
  return (
    <footer className="footer no-print" style={{
      marginTop: 'auto',
      padding: '3rem 0 2.5rem',
      borderTop: '1px solid var(--border-subtle)',
      fontSize: '0.82rem',
      color: 'var(--text-muted)',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', marginBottom: '1.5rem', lineHeight: '1.65' }}>
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: '0.5rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '0.78rem'
        }}>
          Clinical Research & Ethics Disclaimer
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {disclaimer ||
            'MenoPhenotype provides unsupervised machine-learning phenotype subtyping grounded in the Study of Women\'s Health Across the Nation (SWAN) multi-ethnic longitudinal cohort (ICPSR 32961). This tool is designed strictly for research, educational, and patient-physician consultation preparation purposes and does NOT provide medical diagnosis or prescribe treatment regimens. Always consult a licensed healthcare professional for clinical decision-making.'}
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1.25rem',
        color: 'var(--text-muted)',
        fontSize: '0.78rem',
        flexWrap: 'wrap'
      }}>
        <span>SWAN Longitudinal Cohort</span>
        <span>&bull;</span>
        <span>Gaussian Mixture Models (k=2)</span>
        <span>&bull;</span>
        <span>Isolation Forest Outlier Consensus</span>
        <span>&bull;</span>
        <span>Cascaid Health Clinical Framework</span>
      </div>
    </footer>
  );
}
