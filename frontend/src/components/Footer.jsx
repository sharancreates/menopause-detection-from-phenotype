import React from 'react';

export default function Footer({ disclaimer }) {
  return (
    <footer style={{
      marginTop: 'auto',
      paddingTop: '2.5rem',
      borderTop: '1px solid var(--border-subtle)',
      fontSize: '0.82rem',
      color: 'var(--text-muted)',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '1.25rem', lineHeight: '1.6' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '500' }}>
          Clinical Ethics & Medical Disclaimer
        </p>
        <p style={{ fontSize: '0.78rem' }}>
          {disclaimer ||
            'This tool provides machine-learning phenotype pattern matching based on the Study of Women\'s Health Across the Nation (SWAN) research cohort. It is strictly for educational, research, and self-reflection purposes and does NOT provide medical diagnosis or treatment advice. Consult a healthcare professional for clinical concerns.'}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', color: 'var(--text-muted)' }}>
        <span>SWAN Multi-Ethnic Longitudinal Study</span>
        <span>&bull;</span>
        <span>Gaussian Mixture Models (k=2)</span>
        <span>&bull;</span>
        <span>Dual Consensus Outlier Detection</span>
      </div>
    </footer>
  );
}
