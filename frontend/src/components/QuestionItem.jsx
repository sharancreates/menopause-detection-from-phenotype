import React from 'react';
import LikertCard from './LikertCard.jsx';

export default function QuestionItem({ symptom, index, totalInDomain, likertScale, currentValue, onSelect }) {
  return (
    <div className="glass-panel" style={{
      padding: '1.75rem',
      marginBottom: '1.5rem',
      background: '#FFFFFF',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      transition: 'border-color var(--transition-normal)'
    }}>
      {/* Header with question counter and domain tag */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.85rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className={`domain-badge ${symptom.domain}`}>
            {symptom.domain}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Question {index + 1} of {totalInDomain}
          </span>
        </div>

        {currentValue !== undefined && currentValue !== null && (
          <span style={{
            fontSize: '0.78rem',
            color: 'var(--color-primary)',
            background: 'var(--color-primary-light)',
            padding: '0.22rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: '600',
            border: '1px solid rgba(52, 78, 65, 0.2)'
          }}>
            Selected: {likertScale[currentValue]?.label} ({currentValue})
          </span>
        )}
      </div>

      {/* Symptom title & clinical question prompt */}
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.35rem',
        marginBottom: '0.4rem',
        color: 'var(--text-primary)',
        fontWeight: '500'
      }}>
        {symptom.name}
      </h3>
      <p style={{
        fontSize: '0.94rem',
        color: 'var(--text-secondary)',
        marginBottom: '1.35rem',
        lineHeight: '1.55'
      }}>
        {symptom.question}
      </p>

      {/* Likert Scale 0-4 Option Cards */}
      <div
        role="radiogroup"
        aria-label={symptom.name}
        style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}
      >
        {likertScale.map((opt) => (
          <LikertCard
            key={opt.value}
            option={opt}
            isSelected={currentValue === opt.value}
            onSelect={(val) => onSelect(symptom.id, val)}
          />
        ))}
      </div>
    </div>
  );
}
