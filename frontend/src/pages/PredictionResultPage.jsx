import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/apiConfig';
import RiskGauge from '../components/RiskGauge';
import ClinicalComparisonTable from '../components/ClinicalComparisonTable';
import ShapImpactChart from '../components/ShapImpactChart';
import CounterfactualCard from '../components/CounterfactualCard';
import {
  Activity, Download, Lightbulb, ArrowLeft, Loader2, AlertCircle, Sparkles,
  ShieldAlert, CheckCircle2, Info, Eye, Stethoscope, FileText, AlertTriangle
} from 'lucide-react';

const PredictionResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('patient'); // 'patient' vs 'technical'

  const fetchPredictionDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/predictions/${id}/`);
      if (res.data) {
        setPrediction(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load prediction detail record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictionDetail();
  }, [id]);

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const genRes = await api.post('/medical-reports/generate/', { prediction_id: id });
      const reportId = genRes.data?.report_id || genRes.data?.report?.id;

      if (!reportId) {
        throw new Error('Report ID not returned');
      }

      const downloadRes = await api.get(`/medical-reports/${reportId}/download/`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([downloadRes.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `HeartCare_Assessment_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('PDF Report generation failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Loading prediction assessment & transparent AI analysis...</p>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
          <h3 className="font-bold">{error || 'Prediction record not found.'}</h3>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-rose-700 text-white font-bold rounded-xl text-xs"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const riskLevel = prediction.risk_level || 'LOW';
  const riskPct = prediction.risk_percentage || 0;
  const features = prediction.input_features || {};
  const shapList = prediction.shap_explanation || [];
  const counterfactual = prediction.counterfactual_scenario || {};
  const metadata = prediction.model_metadata || {};

  // Separate SHAP factors into Major Contributing vs Protective
  const majorRiskFactors = shapList.filter(item => item.direction === 'increases_risk').slice(0, 5);
  const protectiveFactors = shapList.filter(item => item.direction === 'decreases_risk').slice(0, 3);

  const isHighRisk = riskLevel === 'HIGH' || riskLevel === 'VERY HIGH';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-slide-up">
      
      {/* 1. Header & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* View Mode Toggle: Patient vs Doctor/Technical */}
        <div className="flex items-center bg-slate-200 p-1 rounded-2xl border border-slate-300">
          <button
            onClick={() => setViewMode('patient')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition ${
              viewMode === 'patient'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Patient View
          </button>
          <button
            onClick={() => setViewMode('technical')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition ${
              viewMode === 'technical'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Doctor / Research View
          </button>
        </div>
      </div>

      {/* 2. Main Risk Score Gauge Card */}
      <RiskGauge
        riskPercentage={prediction.risk_percentage}
        riskLevel={prediction.risk_level}
        riskProbability={prediction.risk_probability}
        date={prediction.created_at}
      />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/recommendations', { state: { predictionId: prediction.id, riskLevel: prediction.risk_level, topFactors: prediction.top_risk_factors } })}
          className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow transition flex items-center justify-center gap-2 text-sm"
        >
          <Lightbulb className="w-5 h-5 text-amber-300" />
          <span>VIEW AI RECOMMENDATIONS</span>
        </button>

        <button
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
          className="flex-1 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {pdfLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5 text-blue-400" />
          )}
          <span>DOWNLOAD PDF REPORT</span>
        </button>
      </div>

      {/* PATIENT VIEW CONTENT */}
      {viewMode === 'patient' && (
        <>
          {/* 3. TRANSPARENT AI — "WHY DID I GET THIS RISK?" (Section 32.1 & 32.2) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
                  Transparent AI Explainer (Section 32.1)
                </span>
                <h3 className="text-xl font-black text-slate-900">Why Did the Model Predict This Risk?</h3>
              </div>
            </div>

            {/* Simple Language Explanation */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-sm text-slate-800 leading-relaxed">
              <p className="font-extrabold text-blue-900 mb-1">Patient-Friendly Explanation:</p>
              <p>
                Your estimated risk of <strong>{riskPct.toFixed(1)}% ({riskLevel})</strong> is influenced mainly by your{' '}
                <strong className="text-rose-700 underline decoration-rose-400 decoration-2">
                  {majorRiskFactors.map(f => f.human_name || f.feature).join(', ')}
                </strong>.
                These parameters contributed more strongly to the XGBoost model's prediction than other health inputs.
              </p>
            </div>

            {/* Visual Contribution Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Major Risk Factors */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Major Risk Increasing Factors:
                </h4>
                {majorRiskFactors.map((item, idx) => {
                  const barWidth = Math.min(Math.max((item.importance || 0.1) * 300, 15), 100);
                  return (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
                        <span>{item.human_name || item.feature}</span>
                        <span className="text-rose-600 font-mono">+{item.contribution?.toFixed(4) || item.importance}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Protective Factors */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Lower-Risk / Protective Factors:
                </h4>
                {protectiveFactors.length > 0 ? (
                  protectiveFactors.map((item, idx) => {
                    const barWidth = Math.min(Math.max((item.importance || 0.1) * 300, 15), 100);
                    return (
                      <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                        <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
                          <span>{item.human_name || item.feature}</span>
                          <span className="text-emerald-600 font-mono">{item.contribution?.toFixed(4)}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-700"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 italic">No significant protective factors detected.</p>
                )}
              </div>
            </div>
          </div>

          {/* 4. CLINICAL PARAMETER COMPARISON TABLE */}
          <ClinicalComparisonTable features={features} riskLevel={riskLevel} riskPercentage={riskPct} />

          {/* 5. COUNTERFACTUAL AI SCENARIO (Section 32.5 & 32.25) */}
          <CounterfactualCard counterfactual={counterfactual} />

          {/* 6. ACTIONABLE RESULT CARD & EMERGENCY WARNING (Section 32.8 - 32.11 & 32.27) */}
          <div className={`rounded-3xl p-6 sm:p-8 border shadow-lg space-y-4 ${
            isHighRisk
              ? 'bg-rose-900 text-white border-rose-700'
              : riskLevel === 'MODERATE'
              ? 'bg-amber-900 text-white border-amber-700'
              : 'bg-emerald-900 text-white border-emerald-700'
          }`}>
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-amber-300 shrink-0" />
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                  Actionable Clinical Guidance ({riskLevel} RISK)
                </span>
                <h3 className="text-2xl font-black">
                  {riskLevel === 'HIGH' || riskLevel === 'VERY HIGH'
                    ? 'Timely Professional Medical Evaluation Recommended'
                    : riskLevel === 'MODERATE'
                    ? 'Review Risk Factors & Discuss with Healthcare Provider'
                    : 'Maintain Active Lifestyle & Routine Check-ups'}
                </h3>
              </div>
            </div>

            <div className="text-sm space-y-2 opacity-95 leading-relaxed">
              <p><strong>Status:</strong> Your estimated model risk of <strong>{riskPct.toFixed(1)}%</strong> falls into the <strong>{riskLevel}</strong> category.</p>
              <p><strong>Suggested Next Steps:</strong></p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
                {isHighRisk ? (
                  <>
                    <li>Schedule a comprehensive cardiovascular check-up with a doctor.</li>
                    <li>Review blood pressure, fasting glucose, and lipid panel thresholds.</li>
                    <li>Discuss risk reduction strategies and clinical monitoring.</li>
                  </>
                ) : riskLevel === 'MODERATE' ? (
                  <>
                    <li>Monitor blood pressure and glucose levels periodically.</li>
                    <li>Maintain or increase physical activity to at least 150 mins/week.</li>
                    <li>Review dietary sodium and cholesterol intake with a nutritionist.</li>
                  </>
                ) : (
                  <>
                    <li>Continue regular exercise and balanced nutrition.</li>
                    <li>Avoid tobacco and monitor blood pressure annually.</li>
                    <li>Maintain routine preventive health visits.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Emergency Symptom Warning (Section 32.27) */}
            <div className="bg-rose-950/90 border border-rose-500/50 rounded-2xl p-4 text-xs text-rose-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold uppercase tracking-wider block text-rose-300 mb-1">
                  EMERGENCY WARNING SYMPTOMS
                </span>
                <p>
                  If you experience severe chest pain, severe difficulty breathing, sudden fainting, or numbness/weakness, <strong>seek emergency medical care immediately</strong>. Machine learning risk predictions should never delay emergency evaluation.
                </p>
              </div>
            </div>
          </div>

          {/* 7. "WHAT SHOULD I DO NEXT?" CHECKLIST (Section 32.17) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span>What Should I Do Next?</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="w-5 h-5 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shrink-0">1</span>
                <span>Review your major risk factors (Blood Pressure, BMI, Cholesterol).</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="w-5 h-5 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shrink-0">2</span>
                <span>Review the SHAP feature contribution breakdown above.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="w-5 h-5 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shrink-0">3</span>
                <span>Review the hypothetical counterfactual scenario simulation.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="w-5 h-5 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shrink-0">4</span>
                <span>Discuss relevant findings with a qualified healthcare professional.</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TECHNICAL / RESEARCH VIEW CONTENT (Section 32.18 & 32.19) */}
      {viewMode === 'technical' && (
        <div className="space-y-8">
          {/* Doctor / Researcher Model Metadata Panel */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <Stethoscope className="w-7 h-7 text-blue-400" />
              <div>
                <span className="text-xs font-black text-blue-400 uppercase tracking-widest block">
                  Research & Doctor Audit Metadata (Section 32.19)
                </span>
                <h3 className="text-xl font-black text-white">XGBoost ML Engine & Experiment Specifications</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <span className="text-slate-400 block font-semibold mb-1">Model Architecture</span>
                <span className="font-extrabold text-white text-sm">{metadata.model_name || 'XGBoost Classifier'}</span>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <span className="text-slate-400 block font-semibold mb-1">Model Version</span>
                <span className="font-extrabold text-blue-400 text-sm font-mono">{prediction.model_version || 'XGBoost_v1.0'}</span>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <span className="text-slate-400 block font-semibold mb-1">Dataset Version</span>
                <span className="font-extrabold text-white text-sm">{metadata.dataset_version || '70,000 Patient Records'}</span>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <span className="text-slate-400 block font-semibold mb-1">Calibration Status</span>
                <span className="font-extrabold text-emerald-400 text-sm">{metadata.calibration_status || 'Calibrated'}</span>
              </div>
            </div>

            {/* Verification Metrics Table */}
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 space-y-3">
              <h4 className="font-black text-white text-sm uppercase tracking-wider text-blue-300">
                Validated Performance Metrics:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block font-semibold">ROC-AUC</span>
                  <span className="text-lg font-black text-amber-400 font-mono">0.8007</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block font-semibold">Accuracy</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">73.46%</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block font-semibold">Precision</span>
                  <span className="text-lg font-black text-blue-400 font-mono">0.7553</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block font-semibold">Recall / Sens</span>
                  <span className="text-lg font-black text-purple-400 font-mono">0.6935</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block font-semibold">F1-Score</span>
                  <span className="text-lg font-black text-teal-400 font-mono">0.7231</span>
                </div>
              </div>
            </div>

            {/* Threshold Configuration */}
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-xs space-y-1">
              <span className="font-extrabold text-blue-300 uppercase tracking-wider block mb-1">
                Threshold Parameters (Section 32.12):
              </span>
              <p className="text-slate-300">Low: &lt; 35.0% | Moderate: 35.0% - 64.9% | High: 65.0% - 84.9% | Very High: &gt;= 85.0%</p>
              <p className="text-slate-400 text-[11px]">Selection Method: Youden's J Statistic on 20% validation split. These are project-specific calibrated thresholds.</p>
            </div>
          </div>

          {/* Local SHAP Table */}
          <ShapImpactChart shapData={prediction.shap_explanation} />
        </div>
      )}

    </div>
  );
};

export default PredictionResultPage;
