import React, { useMemo } from 'react';
import PhenotypeCard from './PhenotypeCard.jsx';
import RadarChart from './RadarChart.jsx';
import ConfidenceGauge from './ConfidenceGauge.jsx';
import OutlierAlert from './OutlierAlert.jsx';
import DomainBreakdownGrid from './DomainBreakdownGrid.jsx';
import DoctorDiscussionGuide from './DoctorDiscussionGuide.jsx';
import ReportExportActions from './ReportExportActions.jsx';

const DOMAIN_MAP = {
  vasomotor: ['HOTFLAS0', 'NITESWE0', 'COLDSWE0'],
  psychological: ['FEELBLU0', 'IRRITAB0', 'NRVOUS0', 'FORGET0', 'MOODCHG0', 'FEARFULA0'],
  somatic: ['STIFF0', 'HDACHE0', 'VAGINDR0', 'HARTRAC0', 'DIZZY0', 'LEAKURI0'],
  sleep: ['TRBLSLE0', 'WAKEUP0', 'WAKEARL0'],
};

export default function ResultsDashboard({
  assessmentResult,
  responses = {},
  symptoms = [],
  onEditAnswers,
  onReset,
}) {
  // Compute mean domain scores (0.0 to 4.0 scale)
  const domainScores = useMemo(() => {
    const scores = {};
    for (const [domainKey, itemKeys] of Object.entries(DOMAIN_MAP)) {
      const vals = itemKeys
        .map((k) => (responses[k] !== undefined && responses[k] !== null ? Number(responses[k]) : null))
        .filter((v) => v !== null);

      if (vals.length > 0) {
        scores[domainKey] = vals.reduce((a, b) => a + b, 0) / vals.length;
      } else {
        scores[domainKey] = 0;
      }
    }
    return scores;
  }, [responses]);

  if (!assessmentResult) {
    return null;
  }

  const {
    phenotype = 'Phenotype A',
    confidence = 0.85,
    is_outlier = false,
    imputed_features = [],
    interpretation,
  } = assessmentResult;

  const currentDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="animate-fade-in results-dashboard-root" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Print-only Institutional Header */}
      <div className="print-header print-only" style={{ display: 'none', marginBottom: '1.5rem', borderBottom: '2px solid #333', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#111', margin: 0 }}>MenoPhenotype Clinical Consultation Brief</h1>
            <p style={{ fontSize: '0.9rem', color: '#555', margin: '0.2rem 0 0' }}>
              Study of Women's Health Across the Nation (SWAN) Phenotype Analysis
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#666' }}>
            <div><strong>Date:</strong> {currentDate}</div>
            <div><strong>Cohort Baseline:</strong> SWAN Longitudinal Study</div>
          </div>
        </div>
      </div>

      {/* Export Actions Bar */}
      <ReportExportActions
        assessmentResult={assessmentResult}
        responses={responses}
        symptoms={symptoms}
      />

      {/* Dashboard Top Header (Hidden on Print) */}
      <div
        className="glass-panel no-print"
        style={{
          padding: '1.5rem 2rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-primary)',
              display: 'block',
              marginBottom: '0.2rem',
            }}
          >
            Clinical Pattern Discovery
          </span>
          <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em', margin: 0 }}>
            Personalized Phenotype Analysis
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={onEditAnswers} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            ✏️ Edit Answers
          </button>
          <button onClick={onReset} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            🔄 Start Fresh
          </button>
        </div>
      </div>

      {/* Outlier Alert Banner */}
      <OutlierAlert isOutlier={is_outlier} imputedFeatures={imputed_features} />

      {/* Top 2-Column Grid: Phenotype Card + Confidence & Radar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Left Column: Phenotype Hero Card */}
        <PhenotypeCard phenotype={phenotype} interpretation={interpretation} />

        {/* Right Column: Confidence Gauge + Radar Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ConfidenceGauge confidence={confidence} phenotype={phenotype} />
          <RadarChart domainScores={domainScores} />
        </div>
      </div>

      {/* 4-Domain Breakdown Grid with Symptom Drilldowns */}
      <DomainBreakdownGrid responses={responses} symptoms={symptoms} />

      {/* Healthcare Provider Discussion Guide */}
      <DoctorDiscussionGuide />
    </div>
  );
}
