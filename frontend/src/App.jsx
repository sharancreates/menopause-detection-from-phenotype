import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import StepWelcome from './components/StepWelcome.jsx';
import StepStagingIntake from './components/StepStagingIntake.jsx';
import StepDomain from './components/StepDomain.jsx';
import StepReview from './components/StepReview.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';
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
    goToStep(6);
  }, [goToStep]);

  // Loading state while fallback or API metadata settles
  if (!metadata) {
    return (
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2.5rem', textAlign: 'center', background: '#FFFFFF' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '1rem', animation: 'circle-pulse 2s infinite' }}>🌱</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Loading Clinical Protocols...
          </h3>
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
            padding: '1rem 1.5rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-primary-light)',
            border: '1px solid rgba(52, 78, 65, 0.25)',
            borderRadius: 'var(--radius-md)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--color-primary)' }}>
            <span style={{ fontSize: '1.2rem' }}>💾</span>
            <span>
              <strong>Session Restored:</strong> Your previous questionnaire draft was recovered ({answeredCount} items completed).
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={dismissDraftBanner}
              className="btn-primary"
              style={{ padding: '0.4rem 0.95rem', fontSize: '0.82rem' }}
            >
              Continue
            </button>
            <button
              onClick={handleReset}
              className="btn-ghost"
              style={{ padding: '0.4rem 0.95rem', fontSize: '0.82rem', color: 'var(--color-primary)' }}
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ minHeight: '600px', marginBottom: '3rem' }}>
        {assessmentResult ? (
          <ResultsDashboard
            assessmentResult={assessmentResult}
            responses={responses}
            symptoms={symptoms}
            onEditAnswers={handleEditAnswers}
            onReset={handleReset}
          />
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
              <StepStagingIntake
                responses={responses}
                onSelect={setResponse}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {currentStep === 2 && (
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

            {currentStep === 3 && (
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

            {currentStep === 4 && (
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

            {currentStep === 5 && (
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

            {currentStep === 6 && (
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
