import React from 'react';
import { STAGING_TIMELINE_STEPS } from '../utils/staging.js';

export default function MenopauseStageBanner({ staging }) {
  if (!staging) return null;

  const {
    stage_id = 'early_perimenopause',
    stage_name = 'Early Perimenopause',
    timeline_step = 1,
    is_near_menopause = false,
    poi_alert = false,
    poi_alert_text = null,
    biological_summary = '',
    physician_discussion_points = [],
    intake_responses = {},
  } = staging;

  const isSurgical = stage_id === 'surgical';

  return (
    <div
      className="glass-panel animate-fade-in"
      style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '2.25rem 2.5rem',
        marginBottom: '2.5rem',
        border: '1px solid rgba(52, 78, 65, 0.2)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Top Tag & Main Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <div className="status" style={{ marginBottom: '0.65rem' }}>
            <span className="status--circle" />
            <span>CLINICAL TRANSITION STAGE • STRAW+10 GOLD STANDARD</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.1rem',
                margin: 0,
                color: 'var(--text-primary)',
              }}
            >
              Current Phase:{' '}
              <span style={{ color: 'var(--color-primary)' }}>
                {stage_name}
              </span>
            </h2>
            {is_near_menopause && (
              <span
                style={{
                  background: '#FDF0E9',
                  color: '#D47343',
                  border: '1px solid #F0BFA8',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                🔥 NEAR MENOPAUSE
              </span>
            )}
            {isSurgical && (
              <span
                style={{
                  background: '#F5ECF0',
                  color: '#8A4A5B',
                  border: '1px solid #DDB8C4',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  letterSpacing: '0.02em',
                }}
              >
                SURGICAL ONSET
              </span>
            )}
          </div>
        </div>

        {/* User Cycle Metadata Pill */}
        {intake_responses?.age_range && (
          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            Age: <strong>{intake_responses.age_range}</strong> • Cycle:{' '}
            <strong>{intake_responses.cycle_regularity || 'Not specified'}</strong>
          </div>
        )}
      </div>

      {/* POI Alert Banner (if applicable) */}
      {poi_alert && (
        <div
          style={{
            background: '#FEF3F2',
            border: '1px solid #FECDCA',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '1.6rem', lineHeight: '1' }}>⚠️</span>
          <div>
            <h4 style={{ margin: '0 0 0.35rem', color: '#B42318', fontSize: '0.98rem', fontWeight: '700' }}>
              Primary Ovarian Insufficiency (POI) Clinical Notice
            </h4>
            <p style={{ margin: 0, color: '#912018', fontSize: '0.88rem', lineHeight: '1.5' }}>
              {poi_alert_text}
            </p>
          </div>
        </div>
      )}

      {/* Visual Transition Timeline / Proximity Gauge */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Reproductive Transition Spectrum
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: '600' }}>
            Position {timeline_step + 1} of 4
          </span>
        </div>

        {/* Timeline Stepper Track */}
        <div style={{ position: 'relative', padding: '0.5rem 0' }}>
          {/* Background Connecting Bar */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '5%',
              right: '5%',
              height: '4px',
              background: 'var(--border-subtle)',
              zIndex: 0,
            }}
          />

          {/* Active Fill Bar */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '5%',
              width: `${(timeline_step / 3) * 90}%`,
              height: '4px',
              background: 'var(--color-primary)',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 1,
            }}
          />

          {/* 4 Interactive Steps */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
            }}
          >
            {STAGING_TIMELINE_STEPS.map((step) => {
              const isCurrent = timeline_step === step.id;
              const isPast = timeline_step > step.id;

              return (
                <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Step Circle Marker */}
                  <div
                    style={{
                      width: isCurrent ? '40px' : '32px',
                      height: isCurrent ? '40px' : '32px',
                      borderRadius: '50%',
                      background: isCurrent ? 'var(--color-primary)' : isPast ? '#FFFFFF' : '#FFFFFF',
                      border: isCurrent
                        ? '4px solid #DCE6E0'
                        : isPast
                        ? '3px solid var(--color-primary)'
                        : '2px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCurrent ? '#FFFFFF' : isPast ? 'var(--color-primary)' : 'var(--text-muted)',
                      fontSize: isCurrent ? '1rem' : '0.85rem',
                      fontWeight: '700',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(52, 78, 65, 0.18)' : 'none',
                      transition: 'all 0.3s ease',
                      marginBottom: '0.65rem',
                    }}
                  >
                    {isPast ? '✓' : step.id + 1}
                  </div>

                  {/* Step Title */}
                  <div
                    style={{
                      fontSize: isCurrent ? '0.92rem' : '0.82rem',
                      fontWeight: isCurrent ? '700' : '600',
                      color: isCurrent ? 'var(--color-primary)' : isPast ? 'var(--text-primary)' : 'var(--text-muted)',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {step.label}
                  </div>

                  {/* Step Subtitle */}
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                      maxWidth: '160px',
                      lineHeight: '1.25',
                    }}
                  >
                    {step.sub}
                  </div>

                  {/* Current Active Indicator Pill */}
                  {isCurrent && (
                    <span
                      style={{
                        marginTop: '0.5rem',
                        fontSize: '0.72rem',
                        background: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: '700',
                        letterSpacing: '0.03em',
                        border: '1px solid rgba(52, 78, 65, 0.3)',
                      }}
                    >
                      YOU ARE HERE
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Column Clinical Insight Card: Biological Dynamics + Doctor Talking Points */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          paddingTop: '1.75rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {/* Left Column: Biological Hormonal State */}
        <div style={{ background: 'var(--bg-subtle)', padding: '1.35rem 1.6rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🧬</span>
            <h4 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              Biological Hormone Dynamics
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            {biological_summary}
          </p>
        </div>

        {/* Right Column: Doctor Consultation Focus */}
        <div style={{ background: 'var(--color-primary-light)', padding: '1.35rem 1.6rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(52, 78, 65, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🩺</span>
            <h4 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-primary)' }}>
              Key Clinical Discussion Points
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: '1.55' }}>
            {physician_discussion_points.map((pt, idx) => (
              <li key={idx} style={{ marginBottom: '0.35rem' }}>
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
