import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import StepWelcome from './components/StepWelcome.jsx';
import StepDomain from './components/StepDomain.jsx';
import StepReview from './components/StepReview.jsx';
import { useQuestionnaire } from './hooks/useQuestionnaire.js';
import { fetchMetadata, fetchHealth, submitAssessment } from './services/api.js';

export default function App() {
  const {
    responses,
    currentStep,
    isDraftRestored,
    answeredCount,
    totalItems,
    completionPercentage,
    setResponse,
    nextStep,
    prevStep,
    goToStep,
    resetDraft,
    dismissDraftBanner,
  } = useQuestionnaire();

  const [metadata, setMetadata] = useState(null);
  const [healthStatus, setHealthStatus] = useState({ status: 'checking', models_loaded: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // Initialize metadata and backend health check
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const [meta, health] = await Promise.all([
        fetchMetadata(),
        fetchHealth(),
      ]);
      if (isMounted) {
        setMetadata(meta);
        setHealthStatus(health);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleReset = useCallback(() => {
    setAssessmentResult(null);
    setSubmitError(null);
    resetDraft();
  }, [resetDraft]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitAssessment(responses);
      setAssessmentResult(result);
    } catch (err) {
      console.error('Assessment submission failed:', err);
      setSubmitError(err.message || 'Failed to submit assessment to prediction service.');
    } finally {
      setIsSubmitting(false);
    }
  }, [responses]);

  const handleEditAnswers = useCallback(() => {
    setAssessmentResult(null);
    goToStep(5);
  }, [goToStep]);

  // Loading state while fallback or API metadata settles
  if (!metadata) {
    return (
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1.5s linear infinite' }}>⏳</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Loading Clinical Protocols...</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Preparing SWAN phenotype symptom domains</p>
        </div>
      </div>
    );
  }

  const symptoms = metadata.symptoms || [];
  const likertScale = metadata.likert_scale || [];

  return (
    <div className="app-container">
      <Navbar
        healthStatus={healthStatus}
        onResetDraft={handleReset}
        answeredCount={answeredCount}
      />

      {/* Draft Restored Banner */}
      {isDraftRestored && !assessmentResult && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            padding: '0.9rem 1.4rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 'var(--radius-md)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem' }}>
            <span style={{ fontSize: '1.2rem' }}>💾</span>
            <span>
              <strong>Draft Restored:</strong> Your previous questionnaire session was recovered ({answeredCount} items answered).
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={dismissDraftBanner}
              className="btn-primary"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
            >
              Continue
            </button>
            <button
              onClick={handleReset}
              className="btn-ghost"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ minHeight: '600px', marginBottom: '3rem' }}>
        {assessmentResult ? (
          /* Preliminary Assessment Result Card (Bridge to Phase 4 Visual Dashboard) */
          <div className="glass-panel animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto', padding: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
                  color: 'var(--color-primary)',
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                ✨
              </div>

              <span
                className="domain-badge"
                style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: 'var(--color-primary)',
                  fontSize: '0.85rem',
                  padding: '0.4rem 1rem',
                  marginBottom: '1rem',
                  display: 'inline-block',
                }}
              >
                Cluster Classification
              </span>

              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>
                {assessmentResult.phenotype}
              </h2>

              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
                {assessmentResult.interpretation ||
                  (assessmentResult.phenotype === 'Phenotype A'
                    ? 'Lower overall symptom burden across vasomotor, psychological, and somatic domains.'
                    : 'Elevated multi-domain symptom burden requiring holistic lifestyle and clinical support.')}
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              {/* Confidence Metric */}
              <div
                style={{
                  padding: '1.25rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Model Confidence
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                  {Math.round((assessmentResult.confidence || 0) * 100)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  Softmax posterior probability
                </div>
              </div>

              {/* Outlier Detection */}
              <div
                style={{
                  padding: '1.25rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Anomaly Detection
                </div>
                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: assessmentResult.is_outlier ? '#f43f5e' : '#10b981',
                  }}
                >
                  {assessmentResult.is_outlier ? '⚠️ Atypical Profile' : '✓ Typical SWAN Pattern'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  {assessmentResult.is_outlier
                    ? 'Isolation Forest flagged rare symptom combination'
                    : 'Consistent with SWAN cohort distribution'}
                </div>
              </div>

              {/* Imputation Summary */}
              <div
                style={{
                  padding: '1.25rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Imputed Symptoms
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {assessmentResult.imputed_features ? assessmentResult.imputed_features.length : 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  {assessmentResult.imputed_features && assessmentResult.imputed_features.length > 0
                    ? `${assessmentResult.imputed_features.join(', ')} (Cohort median)`
                    : 'Complete 18/18 response profile'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <button onClick={handleEditAnswers} className="btn-secondary">
                ✏️ Edit Responses
              </button>
              <button onClick={handleReset} className="btn-primary">
                🔄 Start New Assessment
              </button>
            </div>
          </div>
        ) : (
          /* Step Flow */
          <>
            <ProgressBar
              currentStep={currentStep}
              onStepClick={goToStep}
              answeredCount={answeredCount}
              totalItems={totalItems}
              completionPercentage={completionPercentage}
            />

            {currentStep === 0 && (
              <StepWelcome
                onStart={() => goToStep(1)}
                totalSymptoms={totalItems}
              />
            )}

            {currentStep === 1 && (
              <StepDomain
                domainKey="vasomotor"
                symptoms={symptoms}
                likertScale={likertScale}
                responses={responses}
                onSelect={setResponse}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {currentStep === 2 && (
              <StepDomain
                domainKey="psychological"
                symptoms={symptoms}
                likertScale={likertScale}
                responses={responses}
                onSelect={setResponse}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {currentStep === 3 && (
              <StepDomain
                domainKey="somatic"
                symptoms={symptoms}
                likertScale={likertScale}
                responses={responses}
                onSelect={setResponse}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {currentStep === 4 && (
              <StepDomain
                domainKey="sleep"
                symptoms={symptoms}
                likertScale={likertScale}
                responses={responses}
                onSelect={setResponse}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {currentStep === 5 && (
              <StepReview
                responses={responses}
                symptoms={symptoms}
                onGoToStep={goToStep}
                onPrev={prevStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
