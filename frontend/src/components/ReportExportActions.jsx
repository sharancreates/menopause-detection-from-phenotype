import React from 'react';

export default function ReportExportActions({ assessmentResult, responses = {}, symptoms = [] }) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const timestamp = new Date().toISOString();
    const dateFormatted = timestamp.slice(0, 10);

    const exportPayload = {
      assessment_id: `meno-${Date.now()}`,
      timestamp,
      model_metadata: {
        dataset: "Study of Women's Health Across the Nation (SWAN)",
        algorithm: 'Gaussian Mixture Model (k=2) with Isolation Forest outlier verification',
      },
      assessment_results: {
        phenotype: assessmentResult?.phenotype || 'Unknown',
        confidence: assessmentResult?.confidence || null,
        is_outlier: assessmentResult?.is_outlier || false,
        outlier_score: assessmentResult?.outlier_score || null,
        imputed_features: assessmentResult?.imputed_features || [],
      },
      symptom_responses: responses,
      disclaimer:
        assessmentResult?.disclaimer ||
        "This tool provides machine-learning phenotype pattern matching based on the SWAN study cohort. It is strictly for research, educational, and self-reflection purposes and does NOT provide medical diagnosis.",
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `menophenotype_assessment_${dateFormatted}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      className="glass-panel no-print"
      style={{
        padding: '1.75rem 2rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}
    >
      <div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
          Clinical Report & Data Export
        </h4>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          Save a print-ready clinical consultation brief or download your raw JSON assessment file.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
        <button
          onClick={handlePrint}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.4rem' }}
          title="Open browser print dialog to print or save as PDF"
        >
          <span>🖨️</span>
          <span>Print / Save as PDF</span>
        </button>

        <button
          onClick={handleDownloadJSON}
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.4rem' }}
          title="Download complete structured assessment record in JSON format"
        >
          <span>💾</span>
          <span>Export Data (JSON)</span>
        </button>
      </div>
    </div>
  );
}
