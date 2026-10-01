import React, { useState, useEffect } from 'react';
import api from '../config/apiConfig';
import { Activity, BarChart3, Award, CheckCircle2, ShieldCheck, FileText, Loader2, Sparkles } from 'lucide-react';

const ModelPerformancePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/prediction/models/performance/');
      if (res.data?.performance) {
        setData(res.data.performance);
      }
    } catch (err) {
      setError("Failed to load model performance metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-500">Loading empirical model evaluation comparison metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-rose-600">
        <p className="font-bold">{error || "Performance metadata unavailable."}</p>
      </div>
    );
  }

  const results = data.evaluation_results || {};
  const modelNames = Object.keys(results);
  const selectedBest = data.selected_best_model || 'XGBoost Classifier';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-slide-up">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-3">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Model Evaluation Dashboard (Section 4, 5 & 21)
          </span>
          <h1 className="text-3xl font-black">Model Comparison & Performance</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Empirical validation metrics across Logistic Regression, Random Forest, SVM, XGBoost, and Deep Learning Neural Net (MLP) trained on 70,000 patient records.
          </p>
        </div>

        <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-4 text-emerald-300 text-xs flex items-center gap-3">
          <Award className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Selected Best Model</span>
            <span className="text-base font-black text-white">{selectedBest}</span>
          </div>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-900">Validated Model Metrics Comparison</h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Split: {data.training_split} ({data.dataset_records} records)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 font-bold rounded-l-xl">Model Architecture</th>
                <th className="py-3.5 px-4 font-bold text-center">Accuracy</th>
                <th className="py-3.5 px-4 font-bold text-center">Precision</th>
                <th className="py-3.5 px-4 font-bold text-center">Recall / Sens</th>
                <th className="py-3.5 px-4 font-bold text-center">Specificity</th>
                <th className="py-3.5 px-4 font-bold text-center">F1 Score</th>
                <th className="py-3.5 px-4 font-bold text-center rounded-r-xl">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {modelNames.map((name, idx) => {
                const m = results[name];
                const isSelected = name === selectedBest;
                return (
                  <tr key={idx} className={`hover:bg-slate-50 transition ${isSelected ? 'bg-blue-50/60 font-bold' : ''}`}>
                    <td className="py-4 px-4 font-extrabold text-slate-900 flex items-center gap-2">
                      {isSelected && <Award className="w-4 h-4 text-emerald-600" />}
                      <span>{name}</span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-slate-900">{(m.Accuracy * 100).toFixed(2)}%</td>
                    <td className="py-4 px-4 text-center font-mono text-slate-700">{m.Precision.toFixed(4)}</td>
                    <td className="py-4 px-4 text-center font-mono text-slate-700">{m.Recall.toFixed(4)}</td>
                    <td className="py-4 px-4 text-center font-mono text-slate-700">{m.Specificity.toFixed(4)}</td>
                    <td className="py-4 px-4 text-center font-mono text-slate-700">{m.F1_Score.toFixed(4)}</td>
                    <td className="py-4 px-4 text-center font-mono text-blue-700 font-extrabold">{m.ROC_AUC.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confusion Matrix Cards Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <h3 className="text-xl font-black text-slate-900">Confusion Matrices Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modelNames.map((name, idx) => {
            const cm = results[name]?.Confusion_Matrix;
            if (!cm) return null;
            return (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <span className="text-xs font-black text-slate-900 block">{name}</span>
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-xl">
                    <span className="text-[10px] text-emerald-800 font-bold block">TN (True Neg)</span>
                    <span className="text-base font-black text-emerald-900">{cm.TN}</span>
                  </div>
                  <div className="bg-rose-100 border border-rose-300 p-3 rounded-xl">
                    <span className="text-[10px] text-rose-800 font-bold block">FP (False Pos)</span>
                    <span className="text-base font-black text-rose-900">{cm.FP}</span>
                  </div>
                  <div className="bg-amber-100 border border-amber-300 p-3 rounded-xl">
                    <span className="text-[10px] text-amber-800 font-bold block">FN (False Neg)</span>
                    <span className="text-base font-black text-amber-900">{cm.FN}</span>
                  </div>
                  <div className="bg-blue-100 border border-blue-300 p-3 rounded-xl">
                    <span className="text-[10px] text-blue-800 font-bold block">TP (True Pos)</span>
                    <span className="text-base font-black text-blue-900">{cm.TP}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModelPerformancePage;
