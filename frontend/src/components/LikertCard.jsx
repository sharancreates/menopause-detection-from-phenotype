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
        padding: '0.95rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all var(--transition-normal)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        border: '1.5px solid',
        borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-subtle)',
        background: isSelected ? 'var(--color-primary-light)' : '#FFFFFF',
        boxShadow: isSelected ? 'var(--shadow-selected)' : 'var(--shadow-sm)',
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
        marginBottom: '0.5rem',
        background: isSelected
          ? 'var(--color-primary)'
          : 'var(--bg-subtle)',
        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
        transition: 'all var(--transition-fast)'
      }}>
        {value}
      </div>

      {/* Label */}
      <span style={{
        fontSize: '0.9rem',
        fontWeight: isSelected ? '700' : '600',
        color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)',
        marginBottom: '0.25rem',
        letterSpacing: '-0.01em'
      }}>
        {label}
      </span>

      {/* Description / Frequency */}
      <span style={{
        fontSize: '0.74rem',
        color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)',
        lineHeight: '1.3'
      }}>
        {description}
      </span>

      {/* Indicator Dot when selected */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '9px',
          right: '9px',
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
        }} />
      )}
    </div>
  );
}
