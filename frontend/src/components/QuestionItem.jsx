import React from 'react';
import LikertCard from './LikertCard.jsx';

export default function QuestionItem({ symptom, index, totalInDomain, likertScale, currentValue, onSelect }) {
  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      marginBottom: '1.25rem',
      transition: 'border-color var(--transition-normal)'
    }}>
      {/* Header with question counter and domain tag */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className={`domain-badge ${symptom.domain}`}>
            {symptom.domain}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Item {index + 1} of {totalInDomain}
          </span>
        </div>

        {currentValue !== undefined && currentValue !== null && (
          <span style={{
            fontSize: '0.78rem',
            color: 'var(--color-primary)',
            background: 'rgba(168, 85, 247, 0.12)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: '600'
          }}>
            Selected: {likertScale[currentValue]?.label} ({currentValue})
          </span>
        )}
      </div>

      {/* Symptom title & clinical question prompt */}
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem', fontWeight: '700' }}>
        {symptom.name}
      </h3>
      <p style={{
        fontSize: '0.92rem',
        color: 'var(--text-secondary)',
        marginBottom: '1.25rem',
        lineHeight: '1.45'
      }}>
        {symptom.question}
      </p>

      {/* Likert Scale 0-4 Option Cards */}
      <div
        role="radiogroup"
        aria-label={symptom.name}
        style={{
          display: 'flex',
          gap: '0.65rem',
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
