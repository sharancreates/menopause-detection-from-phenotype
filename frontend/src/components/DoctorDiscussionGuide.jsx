import React from 'react';

const DISCUSSION_TOPICS = [
  {
    domain: 'Vasomotor (Hot Flashes & Night Sweats)',
    color: 'var(--domain-vaso)',
    questions: [
      'Am I a candidate for Menopausal Hormone Therapy (MHT/HRT), and what is my personal cardiovascular and metabolic benefit-risk profile?',
      'Are non-hormonal prescription options (e.g., neurokinin 3 receptor antagonists like fezolinetant, or targeted SSRIs/SNRIs) suitable for my frequency?',
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
    domain: 'Somatic (Joints, Headaches & Pelvic Comfort)',
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
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '2rem',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🩺</span>
          <h3 style={{ fontSize: '1.35rem', letterSpacing: '-0.02em', margin: 0 }}>
            Healthcare Provider Discussion Guide
          </h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Evidence-aligned talking points to help you navigate collaborative discussions with your gynecologist or primary care physician.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem',
        }}
      >
        {DISCUSSION_TOPICS.map((topic, idx) => (
          <div
            key={idx}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderLeft: `3px solid ${topic.color}`,
            }}
          >
            <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: '700' }}>
              {topic.domain}
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {topic.questions.map((q, qIdx) => (
                <li
                  key={qIdx}
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.55rem',
                    lineHeight: '1.45',
                  }}
                >
                  <span style={{ color: topic.color, fontSize: '0.85rem' }}>💬</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Clinical Disclaimer */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(168, 85, 247, 0.08)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.85rem',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
        }}
      >
        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⚖️</span>
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>Important Clinical Ethics Disclaimer: </strong>
          This self-assessment tool is designed for educational exploration, symptom reflection, and pattern discovery using unsupervised Gaussian Mixture statistical models from the Study of Women's Health Across the Nation (SWAN). It does not provide medical diagnoses, treatment prescriptions, or prognostic determinations. Always consult a qualified medical professional for health decisions.
        </div>
      </div>
    </div>
  );
}
