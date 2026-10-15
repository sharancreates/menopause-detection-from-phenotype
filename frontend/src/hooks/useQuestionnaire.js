import { useState, useEffect, useMemo, useCallback } from 'react';

const STORAGE_KEY = 'menophenotype_draft_v1';
const TOTAL_ITEMS = 18;

export function useQuestionnaire() {
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.responses && Object.keys(parsed.responses).length > 0) {
          setResponses(parsed.responses);
          if (parsed.currentStep !== undefined) {
            setCurrentStep(parsed.currentStep);
          }
          setIsDraftRestored(true);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved draft from localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Autosave to localStorage on state changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const dataToSave = {
        responses,
        currentStep,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Failed to save questionnaire draft to localStorage:', e);
    }
  }, [responses, currentStep, isInitialized]);

  const setResponse = useCallback((symptomCode, value) => {
    setResponses((prev) => ({
      ...prev,
      [symptomCode]: value,
    }));
  }, []);

  const clearResponse = useCallback((symptomCode) => {
    setResponses((prev) => {
      const next = { ...prev };
      delete next[symptomCode];
      return next;
    });
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(Math.max(0, Math.min(step, 5)));
  }, []);

  const resetDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setResponses({});
    setCurrentStep(0);
    setIsDraftRestored(false);
  }, []);

  const dismissDraftBanner = useCallback(() => {
    setIsDraftRestored(false);
  }, []);

  // Computed metrics
  const answeredCount = useMemo(() => {
    return Object.values(responses).filter((v) => v !== null && v !== undefined).length;
  }, [responses]);

  const completionPercentage = useMemo(() => {
    return Math.round((answeredCount / TOTAL_ITEMS) * 100);
  }, [answeredCount]);

  return {
    responses,
    currentStep,
    isDraftRestored,
    answeredCount,
    totalItems: TOTAL_ITEMS,
    completionPercentage,
    setResponse,
    clearResponse,
    nextStep,
    prevStep,
    goToStep,
    resetDraft,
    dismissDraftBanner,
  };
}
