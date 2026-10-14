'''
MenoPhenotype self-assessment scoring function.
Loads the fitted preprocessing pipeline, GMM clustering model, and outlier detectors,
and assigns a phenotype + confidence to a new set of symptom answers.
Run from the same directory as the artifacts/ folder this project produced.
'''

import json
import numpy as np, pandas as pd
from pathlib import Path
import joblib
from meno_preproc import Winsorizer

ART = Path('artifacts')
qmeta = json.load(open(ART / 'quality_meta.json'))
SYMP_COLS = qmeta['SYMP_COLS']; HORM_COLS = qmeta['HORM_COLS']; ANTHRO = ['BMI0', 'WHR']
pre = joblib.load(ART / 'baseline_preprocessor.joblib')
gmm = joblib.load(ART / 'tuned_models.joblib')['GMM']
outliers = joblib.load(ART / 'outlier_models.joblib')
profiles = json.load(open(ART / 'phenotype_profiles.json'))


def assess(symptom_answers: dict) -> dict:
    """symptom_answers: {symptom_column: 0-4}. Returns phenotype, confidence, atypical flag."""
    row = {c: symptom_answers.get(c, np.nan) for c in SYMP_COLS}
    row.update({'cesd_mean': np.nan, 'SPORTS0': np.nan, 'AGE0': np.nan})
    row.update({c: np.nan for c in HORM_COLS}); row.update({c: np.nan for c in ANTHRO})
    X_scaled = pre.transform(pd.DataFrame([row]))[SYMP_COLS]
    proba = gmm.predict_proba(X_scaled)[0]
    cluster = int(np.argmax(proba))
    atypical = (outliers['isolation_forest'].predict(X_scaled)[0] == -1) and \
               (outliers['lof'].predict(X_scaled)[0] == -1)
    phen_key = 'Phenotype A (lower burden)' if cluster == 0 else 'Phenotype B (higher, multi-domain burden)'
    return {'cluster': cluster, 'phenotype': phen_key, 'confidence': round(float(proba.max()), 3),
            'atypical_flag': bool(atypical)}


if __name__ == '__main__':
    example = {c: 2 for c in SYMP_COLS}
    print(assess(example))
