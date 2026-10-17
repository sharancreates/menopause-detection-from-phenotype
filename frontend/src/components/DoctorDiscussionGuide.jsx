import React from 'react';

const DISCUSSION_TOPICS = [
  {
    domain: 'Vasomotor (Hot Flashes & Night Sweats)',
    color: 'var(--domain-vaso)',
    questions: [
      'Am I a candidate for Menopausal Hormone Therapy (MHT/HRT), and what is my personal cardiovascular and metabolic benefit-risk profile?',
      'Are non-hormonal prescription options (e.g., neurokinin 3 receptor antagonists like fezolinetant, or targeted SSRIs/SNRIs) suitable for my symptom frequency?',
      'What timing considerations exist regarding initiating therapy within the window of opportunity (under age 60 or within 10 years of menopause onset)?',
    ],
  },
  {
    domain: 'Psychological (Mood & Cognitive Well-being)',
    color: 'var(--domain-psych)',
    questions: [
      'How can we differentiate perimenopausal hormonal mood volatility from primary clinical anxiety or mood disorders?',
      'What evidence-based lifestyle or pharmacological strategies exist to address episodic brain fog and forgetfulness?',
      'Could psychological support, mindfulness, or cognitive behavioral therapy complement hormonal management?',
    ],
  },
  {
    domain: 'Somatic (Joints, Headaches & Physical Comfort)',
    color: 'var(--domain-somatic)',
    questions: [
      'Are my joint stiffness or headaches correlated with estrogen fluctuations, and should baseline bone mineral density (DEXA scan) be evaluated?',
      'Would low-dose localized vaginal estrogen or non-hormonal lubricants be beneficial for urogenital comfort and urinary tract support?',
      'Are cardiac palpitations related to autonomic neurovascular reactivity during climacteric surges?',
    ],
  },
  {
    domain: 'Sleep Continuity & Fatigue',
    color: 'var(--domain-sleep)',
    questions: [
      'Is my nocturnal awakening primarily driven by sub-clinical night sweats, and how can we restore restorative deep sleep architecture?',
      'Would Cognitive Behavioral Therapy for Insomnia (CBT-I) or sleep hygiene protocols provide sustainable non-pharmacological relief?',
    ],
  },
];

export default function DoctorDiscussionGuide() {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '2.25rem 2rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2.5rem',
        background: '#FFFFFF',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.45rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🩺</span>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.75rem',
            letterSpacing: '-0.02em',
            margin: 0,
            color: 'var(--text-primary)'
          }}>
            Clinician Consultation Guide
          </h3>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.55', margin: 0 }}>
          Evidence-aligned talking points to help you navigate collaborative, data-driven discussions with your gynecologist or primary care physician.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem',
        }}
      >
        {DISCUSSION_TOPICS.map((topic, idx) => (
          <div
            key={idx}
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderLeft: `4px solid ${topic.color}`,
            }}
          >
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              color: 'var(--text-primary)',
              marginBottom: '0.85rem',
              textTransform: 'none',
              fontWeight: '500',
              letterSpacing: 'normal'
            }}>
              {topic.domain}
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topic.questions.map((q, qIdx) => (
                <li
                  key={qIdx}
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    lineHeight: '1.55',
                  }}
                >
                  <span style={{ color: topic.color, fontSize: '0.95rem', flexShrink: 0 }}>💬</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: '1.1rem 1.35rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-primary-light)',
          border: '1px solid rgba(52, 78, 65, 0.2)',
          fontSize: '0.84rem',
          color: 'var(--color-primary)',
          lineHeight: '1.55',
        }}
      >
        <strong>Clinical Preparation Tip:</strong> Bring this printable consultation brief along with any active medication lists or recent bloodwork panels to your appointment. Shared decision-making yields optimal individualized care.
      </div>
    </div>
  );
}
