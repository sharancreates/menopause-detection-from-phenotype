/**
 * MenoPhenotype API Service Client
 * Handles communication with backend endpoints (/api/metadata, /api/health, /api/assess).
 */

const FALLBACK_METADATA = {
  total_symptoms: 18,
  domains: {
    vasomotor: ['HOTFLAS0', 'NITESWE0', 'COLDSWE0'],
    psychological: ['FEELBLU0', 'IRRITAB0', 'NRVOUS0', 'FORGET0', 'MOODCHG0', 'FEARFULA0'],
    somatic: ['STIFF0', 'HDACHE0', 'VAGINDR0', 'HARTRAC0', 'DIZZY0', 'LEAKURI0'],
    sleep: ['TRBLSLE0', 'WAKEUP0', 'WAKEARL0'],
  },
  symptoms: [
    {
      id: 'HOTFLAS0',
      name: 'Hot Flashes',
      domain: 'vasomotor',
      question: 'How often have you experienced hot flashes or flushes over the past 2 weeks?',
    },
    {
      id: 'NITESWE0',
      name: 'Night Sweats',
      domain: 'vasomotor',
      question: 'How often have you awakened with night sweats or sweating episodes over the past 2 weeks?',
    },
    {
      id: 'COLDSWE0',
      name: 'Cold Sweats',
      domain: 'vasomotor',
      question: 'How often have you had cold sweats or sudden chills over the past 2 weeks?',
    },
    {
      id: 'FEELBLU0',
      name: 'Feeling Blue / Down',
      domain: 'psychological',
      question: 'How often have you felt down, sad, or blue over the past 2 weeks?',
    },
    {
      id: 'IRRITAB0',
      name: 'Irritability',
      domain: 'psychological',
      question: 'How often have you felt irritable, snappy, or easily annoyed over the past 2 weeks?',
    },
    {
      id: 'NRVOUS0',
      name: 'Nervousness / Anxiety',
      domain: 'psychological',
      question: 'How often have you felt nervous, anxious, or tense over the past 2 weeks?',
    },
    {
      id: 'FORGET0',
      name: 'Forgetfulness / Brain Fog',
      domain: 'psychological',
      question: 'How often have you been forgetful or had difficulty concentrating over the past 2 weeks?',
    },
    {
      id: 'MOODCHG0',
      name: 'Mood Swings',
      domain: 'psychological',
      question: 'How often have you noticed sudden mood swings or shifts in temperament over the past 2 weeks?',
    },
    {
      id: 'FEARFULA0',
      name: 'Fearfulness / Apprehension',
      domain: 'psychological',
      question: 'How often have you felt fearful, afraid, or apprehensive over the past 2 weeks?',
    },
    {
      id: 'STIFF0',
      name: 'Joint / Muscle Stiffness',
      domain: 'somatic',
      question: 'How often have you felt stiffness, soreness, or aching in your joints or neck?',
    },
    {
      id: 'HDACHE0',
      name: 'Headaches',
      domain: 'somatic',
      question: 'How often have you had headaches or migraines over the past 2 weeks?',
    },
    {
      id: 'VAGINDR0',
      name: 'Vaginal Dryness',
      domain: 'somatic',
      question: 'How often have you experienced vaginal dryness, irritation, or soreness?',
    },
    {
      id: 'HARTRAC0',
      name: 'Heart Pounding / Racing',
      domain: 'somatic',
      question: 'How often have you felt your heart pounding, skipping beats, or racing?',
    },
    {
      id: 'DIZZY0',
      name: 'Dizziness / Lightheadedness',
      domain: 'somatic',
      question: 'How often have you felt dizzy, faint, or lightheaded over the past 2 weeks?',
    },
    {
      id: 'LEAKURI0',
      name: 'Involuntary Urine Leakage',
      domain: 'somatic',
      question: 'How often have you experienced involuntary bladder leakage when coughing, laughing, or exercising?',
    },
    {
      id: 'TRBLSLE0',
      name: 'Difficulty Falling Asleep',
      domain: 'sleep',
      question: 'How often have you had trouble falling asleep at bedtime over the past 2 weeks?',
    },
    {
      id: 'WAKEUP0',
      name: 'Waking Up During Night',
      domain: 'sleep',
      question: 'How often have you awakened several times during the night and found it hard to get back to sleep?',
    },
    {
      id: 'WAKEARL0',
      name: 'Waking Up Earlier Than Desired',
      domain: 'sleep',
      question: 'How often have you awakened earlier than you wanted to in the morning?',
    },
  ],
  likert_scale: [
    { value: 0, label: 'Not at all', description: '0 days in past 2 weeks' },
    { value: 1, label: '1-5 days', description: 'Occasional mild episodes' },
    { value: 2, label: '6-8 days', description: 'Roughly every other day' },
    { value: 3, label: '9-13 days', description: 'Frequent, almost daily' },
    { value: 4, label: 'Every day', description: 'Continuous daily occurrences' },
  ],
  phenotypes: {
    'Phenotype A': {
      name: 'Phenotype A (lower burden)',
      tagline: 'Lower symptom burden across all clinical domains',
    },
    'Phenotype B': {
      name: 'Phenotype B (higher, multi-domain burden)',
      tagline: 'Elevated burden across all symptom domains simultaneously',
    },
  },
  disclaimer:
    'This tool provides machine-learning phenotype pattern matching based on the SWAN study cohort. ' +
    'It is strictly for research, educational, and self-reflection purposes and does NOT provide medical diagnosis.',
};

export async function fetchMetadata() {
  try {
    const res = await fetch('/api/metadata');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend metadata endpoint unavailable; using local fallback metadata:', err);
    return FALLBACK_METADATA;
  }
}

export async function fetchHealth() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', models_loaded: false };
  }
}

export async function submitAssessment(responses) {
  const payload = {};
  for (const [key, val] of Object.entries(responses)) {
    if (val !== null && val !== undefined) {
      payload[key] = parseInt(val, 10);
    }
  }

  const res = await fetch('/api/assess', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned error status ${res.status}`);
  }

  return await res.json();
}
