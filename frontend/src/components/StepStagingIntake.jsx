import React from 'react';

const AGE_OPTIONS = [
  { value: '<40', label: 'Under 40', description: 'Early reproductive years / young adult' },
  { value: '40-44', label: '40–44', description: 'Early 40s transition window' },
  { value: '45-49', label: '45–49', description: 'Peak menopausal transition window' },
  { value: '50-54', label: '50–54', description: 'Average spontaneous menopause age (51.4 yrs)' },
  { value: '55+', label: '55 or older', description: 'Mature postmenopausal phase' },
];

const REGULARITY_OPTIONS = [
  {
    value: 'regular',
    label: 'Regular & Predictable',
    description: 'Cycles vary by less than 7 days from month to month',
  },
  {
    value: 'variable',
    label: 'Variable Cycle Lengths',
    description: 'Cycle length varies by 7 or more days between consecutive cycles',
  },
  {
    value: 'skipped',
    label: 'Skipped 2+ Months',
    description: 'Frequent 60+ day gaps or missed multiple consecutive cycles',
  },
];

const TIME_OPTIONS = [
  {
    value: 'within_last_month',
    label: 'Within the last month',
    description: 'Had a period in the past 30 to 60 days',
  },
  {
    value: '2_to_11_months',
    label: '2 to 11 months ago',
    description: 'No menstrual period for 2 to 11 consecutive months',
  },
  {
    value: '12_months_or_more',
    label: '12 or more months ago',
    description: 'No bleeding for a full calendar year or longer',
  },
  {
    value: 'surgical',
    label: 'Surgical Menopause',
    description: 'Prior bilateral oophorectomy (both ovaries removed) or hysterectomy',
  },
];

export default function StepStagingIntake({ responses = {}, onSelect, onNext, onPrev }) {
  const age = responses.age_range || '';
  const regularity = responses.cycle_regularity || '';
  const timeSince = responses.time_since_period || '';

  const isComplete = Boolean(age && regularity && timeSince);

  return (
    <div className="step-card animate-fade-in" style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Step Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div className="status" style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
          <span className="status--circle" />
          <span>CLINICAL REPRODUCTIVE INTAKE • STRAW+10</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
          Cycle & Menopause Staging
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '620px', margin: '0 auto', lineHeight: '1.5' }}>
          To determine your exact menopause transition stage, we evaluate your cycle patterns against the gold-standard <strong>STRAW+10</strong> reproductive aging criteria.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Question 1: Age */}
        <div>
          <label style={{ display: 'block', fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
            1. What is your current age range?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {AGE_OPTIONS.map((opt) => {
              const isSelected = age === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => onSelect('age_range', opt.value)}
                  style={{
                    padding: '0.9rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--color-primary-light)' : '#FFFFFF',
                    color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? '0 2px 10px rgba(52, 78, 65, 0.15)' : 'none',
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.2rem' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)', lineHeight: '1.2' }}>
                    {opt.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2: Cycle Regularity */}
        <div>
          <label style={{ display: 'block', fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
            2. How predictable are your menstrual cycles?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.85rem' }}>
            {REGULARITY_OPTIONS.map((opt) => {
              const isSelected = regularity === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => onSelect('cycle_regularity', opt.value)}
                  style={{
                    padding: '1.1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--color-primary-light)' : '#FFFFFF',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? '0 2px 10px rgba(52, 78, 65, 0.15)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.98rem', color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                      {opt.label}
                    </span>
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: isSelected ? '5px solid var(--color-primary)' : '2px solid var(--border-subtle)',
                      background: '#FFFFFF',
                      display: 'inline-block'
                    }} />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.35' }}>
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 3: Time Since Last Period */}
        <div>
          <label style={{ display: 'block', fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
            3. When did your last menstrual period start?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.85rem' }}>
            {TIME_OPTIONS.map((opt) => {
              const isSelected = timeSince === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => onSelect('time_since_period', opt.value)}
                  style={{
                    padding: '1.1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--color-primary-light)' : '#FFFFFF',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? '0 2px 10px rgba(52, 78, 65, 0.15)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.98rem', color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                      {opt.label}
                    </span>
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: isSelected ? '5px solid var(--color-primary)' : '2px solid var(--border-subtle)',
                      background: '#FFFFFF',
                      display: 'inline-block'
                    }} />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.35' }}>
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div style={{
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <button
          type="button"
          onClick={onPrev}
          className="btn-secondary"
          style={{ padding: '0.65rem 1.4rem', fontSize: '0.9rem' }}
        >
          ← Back to Welcome
        </button>

        <button
          type="button"
          onClick={onNext}
          className="btn-primary"
          style={{
            padding: '0.7rem 1.8rem',
            fontSize: '0.95rem',
            opacity: isComplete ? 1 : 0.65,
          }}
        >
          {isComplete ? 'Continue to Symptom Evaluation →' : 'Skip / Continue →'}
        </button>
      </div>
    </div>
  );
}
