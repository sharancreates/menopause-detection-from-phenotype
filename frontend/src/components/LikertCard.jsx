import React from 'react';

export default function LikertCard({ option, isSelected, onSelect }) {
  const { value, label, description } = option;

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(value)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onSelect(value);
        }
      }}
      style={{
        flex: '1 1 0',
        minWidth: '130px',
        padding: '0.85rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all var(--transition-normal)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        border: '1px solid',
        borderColor: isSelected ? 'var(--border-selected)' : 'var(--border-subtle)',
        background: isSelected ? 'var(--bg-card-selected)' : 'var(--bg-card)',
        boxShadow: isSelected ? 'var(--shadow-selected)' : 'none',
        transform: isSelected ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Number Badge */}
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.82rem',
        fontWeight: '700',
        marginBottom: '0.45rem',
        background: isSelected
          ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))'
          : 'rgba(255, 255, 255, 0.08)',
        color: '#fff',
        boxShadow: isSelected ? '0 0 10px rgba(168, 85, 247, 0.6)' : 'none',
        transition: 'all var(--transition-fast)'
      }}>
        {value}
      </div>

      {/* Label */}
      <span style={{
        fontSize: '0.88rem',
        fontWeight: isSelected ? '700' : '600',
        color: isSelected ? '#fff' : 'var(--text-primary)',
        marginBottom: '0.2rem',
      }}>
        {label}
      </span>

      {/* Description / Frequency */}
      <span style={{
        fontSize: '0.72rem',
        color: isSelected ? 'var(--text-secondary)' : 'var(--text-muted)',
        lineHeight: '1.25'
      }}>
        {description}
      </span>

      {/* Indicator Dot when selected */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          boxShadow: '0 0 6px var(--color-primary)'
        }} />
      )}
    </div>
  );
}
