/**
 * STRAW+10 Menopause Staging Engine (Client-side).
 * Mirrors backend clinical evaluation logic for instantaneous wizard guidance,
 * offline resilience, and presentation on results & export reports.
 */

export const STAGING_TIMELINE_STEPS = [
  {
    id: 0,
    key: 'premenopause',
    label: 'Premenopause',
    sub: 'Reproductive Years',
    description: 'Regular menstrual cycles with intact ovarian follicular function.',
  },
  {
    id: 1,
    key: 'early_perimenopause',
    label: 'Early Perimenopause',
    sub: 'Variable Cycles (±7d)',
    description: 'Cycle length differences of 7+ days; fluctuating FSH and estrogen.',
  },
  {
    id: 2,
    key: 'late_perimenopause',
    label: 'Late Perimenopause',
    sub: 'Near Menopause (Skipped 60d+)',
    description: 'Amenorrhea of 60+ days or 2–11 months; peak vasomotor symptom risk.',
  },
  {
    id: 3,
    key: 'postmenopause',
    label: 'Postmenopause',
    sub: '12+ Months Amenorrhea',
    description: 'Permanent cessation of menses; stable low estradiol and elevated FSH.',
  },
];

export const STAGE_DEFINITIONS = {
  premenopause: {
    stage_id: 'premenopause',
    stage_name: 'Premenopause (Reproductive)',
    stage_category: 'Premenopause',
    timeline_step: 0,
    is_near_menopause: false,
    badge_color: 'var(--color-primary)',
    biological_summary:
      'Normal ovulatory reproductive function with regular menstrual cycles. Ovarian follicular reserve remains intact with predictable cyclical estrogen and progesterone production.',
    physician_discussion_points: [
      'Baseline tracking of cycle regularity, cycle length changes, and sleep patterns.',
      'Family history of menopause onset and reproductive aging trajectory.',
      'Cardiovascular health and lifestyle baselines (nutrition, regular weight-bearing exercise).',
    ],
  },
  early_perimenopause: {
    stage_id: 'early_perimenopause',
    stage_name: 'Early Perimenopause',
    stage_category: 'Early Perimenopause',
    timeline_step: 1,
    is_near_menopause: false,
    badge_color: '#4A6B56',
    biological_summary:
      'Early menopausal transition characterized by increasing cycle variability (difference of 7 or more days between consecutive cycles). Ovarian follicle numbers are declining, causing elevated FSH and erratic estrogen swings.',
    physician_discussion_points: [
      'Options for managing emerging vasomotor, sleep, or mood fluctuations.',
      'Contraceptive and family planning needs during irregular cycles.',
      'Non-hormonal and hormonal strategies to stabilize unpredictable cycles.',
      'Baseline screening for thyroid function, bone health, and lipid profile.',
    ],
  },
  late_perimenopause: {
    stage_id: 'late_perimenopause',
    stage_name: 'Late Perimenopause (Near Menopause)',
    stage_category: 'Late Perimenopause',
    timeline_step: 2,
    is_near_menopause: true,
    badge_color: '#D47343',
    biological_summary:
      'Late menopausal transition characterized by prolonged intervals of amenorrhea (skipped cycles of 60+ days or 2 to 11 months without menses). Persistently elevated FSH, frequent anovulatory cycles, and sharp drops in circulating estradiol drive peak vasomotor (hot flashes, night sweats) and somatic symptoms.',
    physician_discussion_points: [
      'Menopausal Hormone Therapy (MHT) indications, safety profile, and non-hormonal alternatives.',
      'Cardioprotective and bone preservation strategies during accelerated bone density loss.',
      'Evidence-based symptom relief for severe hot flashes, night sweats, and brain fog.',
      'Continued contraception until 12 full consecutive months of amenorrhea are reached.',
    ],
  },
  postmenopause: {
    stage_id: 'postmenopause',
    stage_name: 'Postmenopause',
    stage_category: 'Postmenopause',
    timeline_step: 3,
    is_near_menopause: false,
    badge_color: '#554271',
    biological_summary:
      'Complete cessation of ovarian follicular activity confirmed by 12 or more consecutive months of amenorrhea. Circulating estradiol remains at permanent low baseline levels with elevated FSH (>30 mIU/mL).',
    physician_discussion_points: [
      'Long-term bone density preservation and DXA scan screening schedule.',
      'Genitourinary Syndrome of Menopause (GSM) management (vaginal dryness, urinary comfort).',
      'Cardiovascular risk monitoring, blood pressure, and cholesterol management.',
      'Healthy aging strategies including resistance training and balanced nutrition.',
    ],
  },
  surgical: {
    stage_id: 'surgical',
    stage_name: 'Surgical Menopause',
    stage_category: 'Surgical Menopause',
    timeline_step: 3,
    is_near_menopause: false,
    badge_color: '#8A4A5B',
    biological_summary:
      'Abrupt transition resulting from bilateral oophorectomy (removal of both ovaries) and/or hysterectomy. Sudden cessation of ovarian hormones often triggers immediate, more pronounced symptoms.',
    physician_discussion_points: [
      'Urgent discussion regarding early bone loss prevention and cardiovascular risk management.',
      'Hormone therapy options (estrogen monotherapy if hysterectomy; combined estrogen-progestogen if uterus present).',
      'Targeted management of sudden-onset severe hot flashes and genitourinary symptoms.',
    ],
  },
};

export const POI_ALERT_TEXT =
  'CLINICAL ATTENTION ADVISED: You are under age 40 and experiencing skipped cycles or prolonged absence of menses. This presentation suggests potential Primary Ovarian Insufficiency (POI), which warrants timely clinical evaluation, hormone lab assessment (FSH, estradiol, AMH), and bone density monitoring with a qualified gynecologist or reproductive endocrinologist.';

export function evaluateStage(ageRange, cycleRegularity, timeSincePeriod) {
  if (!ageRange && !cycleRegularity && !timeSincePeriod) {
    return null;
  }

  const normPeriod = (timeSincePeriod || '').trim().toLowerCase();
  const normReg = (cycleRegularity || '').trim().toLowerCase();
  const normAge = (ageRange || '').trim().toLowerCase();

  const isUnder40 = ['<40', 'under 40', 'under_40', '< 40'].includes(normAge);

  let stageKey = 'premenopause';

  // 1. Surgical Menopause
  if (['surgical', 'hysterectomy', 'oophorectomy'].includes(normPeriod)) {
    stageKey = 'surgical';
  }
  // 2. Postmenopause (12+ months amenorrhea)
  else if (['12_months_or_more', '12+ months ago', '12+ months'].includes(normPeriod)) {
    stageKey = 'postmenopause';
  }
  // 3. Late Perimenopause / Prolonged Amenorrhea (skipped cycles for 60+ days or 2-11 months)
  else if (
    ['2_to_11_months', '2-11 months ago'].includes(normPeriod) ||
    ['skipped', 'skipped 2+ months'].includes(normReg)
  ) {
    stageKey = 'late_perimenopause';
  }
  // 4. Women under 40 with periods within the last 2 months are in Reproductive Age (Premenopause)
  // Variable cycles in young women are typically PCOS, stress, or lifestyle, NOT perimenopause.
  else if (isUnder40) {
    stageKey = 'premenopause';
  }
  // 5. Women aged 40+ with variable cycle length (differs by >=7 days) -> Early Perimenopause (STRAW -2)
  else if (['variable', 'variable cycle lengths', 'variable by 7+ days'].includes(normReg)) {
    stageKey = 'early_perimenopause';
  }
  // 6. Regular cycle -> Premenopause
  else {
    stageKey = 'premenopause';
  }

  const baseStage = { ...STAGE_DEFINITIONS[stageKey] };
  const hasProlongedAmenorrhea = ['late_perimenopause', 'postmenopause'].includes(stageKey);
  const poiAlert = Boolean(isUnder40 && hasProlongedAmenorrhea);

  // Tailor messaging for young women (<40) with variable cycles
  if (
    isUnder40 &&
    stageKey === 'premenopause' &&
    ['variable', 'variable cycle lengths', 'variable by 7+ days'].includes(normReg)
  ) {
    baseStage.stage_name = 'Premenopause (Reproductive Years)';
    baseStage.biological_summary =
      'You are in your active reproductive years. In women under 40, cycle variability (such as cycle lengths differing by 7 or more days) is very common and is typically driven by non-menopausal physiological factors such as stress, lifestyle, sleep patterns, Polycystic Ovary Syndrome (PCOS), or thyroid fluctuations—not natural menopausal transition or ovarian follicular decline.';
    baseStage.physician_discussion_points = [
      'Evaluate potential non-menopausal causes of cycle variation such as PCOS, thyroid profile, or lifestyle stress.',
      'Track cycle lengths, luteal phase duration, and ovulation markers across 3 consecutive cycles.',
      'Discuss lifestyle, sleep, and nutrition strategies to support hormonal balance and cycle regularity.',
    ];
  }

  return {
    stage_id: baseStage.stage_id,
    stage_name: baseStage.stage_name,
    stage_category: baseStage.stage_category,
    timeline_step: baseStage.timeline_step,
    is_near_menopause: baseStage.is_near_menopause,
    badge_color: baseStage.badge_color,
    poi_alert: poiAlert,
    poi_alert_text: poiAlert ? POI_ALERT_TEXT : null,
    biological_summary: baseStage.biological_summary,
    physician_discussion_points: [...baseStage.physician_discussion_points],
    intake_responses: {
      age_range: ageRange,
      cycle_regularity: cycleRegularity,
      time_since_period: timeSincePeriod,
    },
  };
}

