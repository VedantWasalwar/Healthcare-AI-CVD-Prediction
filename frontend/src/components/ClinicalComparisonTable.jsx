import React from 'react';
import { evaluateAllFeatures } from '../utils/clinicalRanges';
import { CheckCircle2, AlertTriangle, ShieldAlert, Info, Sparkles, Activity } from 'lucide-react';

const ClinicalComparisonTable = ({ features, riskLevel = 'MODERATE', riskPercentage = 0 }) => {
  const evaluatedItems = evaluateAllFeatures(features);

  if (!evaluatedItems || evaluatedItems.length === 0) {
    return null;
  }

  const highRiskItems = evaluatedItems.filter(item => item.status === 'HIGH RISK' || item.status === 'ELEVATED');
  const normalItems = evaluatedItems.filter(item => item.status === 'NORMAL');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'NORMAL':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'ELEVATED':
      case 'MODERATE RISK':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'HIGH RISK':
        return <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Direct AI Health Condition Summary Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-lg transition-all duration-500 ${
        riskLevel === 'HIGH' || riskLevel === 'VERY HIGH'
          ? 'bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 text-white border-rose-500/30'
          : riskLevel === 'MODERATE'
          ? 'bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 text-white border-amber-500/30'
          : 'bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white border-emerald-500/30'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
              AI Health Condition Assessment
            </span>
            <h2 className="text-2xl font-black">
              {riskLevel === 'HIGH' || riskLevel === 'VERY HIGH'
                ? 'Elevated Cardiovascular Risk Detected'
                : riskLevel === 'MODERATE'
                ? 'Moderate Risk Profile — Lifestyle Attention Advised'
                : 'Optimal Cardiovascular Health Profile'}
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed max-w-3xl mb-4">
          Based on our XGBoost ML model trained on 70,000 patient records, your overall risk score is{' '}
          <strong className="text-amber-300 font-extrabold text-base underline decoration-rose-500 decoration-4">
            {parseFloat(riskPercentage).toFixed(1)}% ({riskLevel})
          </strong>.
          {highRiskItems.length > 0 ? (
            <span>
              {' '}There are <strong className="text-rose-400 font-black">{highRiskItems.length} critical parameter(s)</strong> highlighted with a <span className="border-b-4 border-rose-500 font-extrabold px-1 bg-rose-950/60 rounded">dark red underline</span> below that require clinical attention.
            </span>
          ) : (
            <span> All key vital parameters are operating within standard clinical reference bounds.</span>
          )}
        </p>

        {highRiskItems.length > 0 && (
          <div className="bg-slate-900/80 border border-rose-500/40 rounded-2xl p-4 text-xs text-rose-200 flex items-start gap-2.5 backdrop-blur-md">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold uppercase tracking-wider block text-rose-300 mb-1">
                Attention Areas (Dark Underline Highlighted):
              </span>
              <div className="flex flex-wrap gap-2">
                {highRiskItems.map((item, idx) => (
                  <span key={idx} className="bg-rose-950/90 text-rose-200 border-b-4 border-rose-600 font-extrabold px-2 py-1 rounded">
                    ⚠️ {item.name}: {item.value} ({item.status})
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clinical Parameter Comparison Table with Dark Line Highlights */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md overflow-hidden">
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>Clinical Parameter Comparison Table</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Parameters exceeding standard reference bounds are marked with a <strong className="text-rose-600 border-b-4 border-rose-600 font-black">THICK DARK UNDERLINE</strong> for rapid patient identification.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 font-bold rounded-l-xl">Health Parameter</th>
                <th className="py-3.5 px-4 font-bold">Patient Value</th>
                <th className="py-3.5 px-4 font-bold">Normal Reference Range</th>
                <th className="py-3.5 px-4 font-bold">Clinical Status</th>
                <th className="py-3.5 px-4 font-bold rounded-r-xl">Medical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {evaluatedItems.map((item, idx) => {
                const isHighRisk = item.status === 'HIGH RISK' || item.status === 'ELEVATED';
                return (
                  <tr
                    key={idx}
                    className={`transition-all duration-300 ${
                      isHighRisk
                        ? 'bg-rose-50/70 hover:bg-rose-100/70'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {isHighRisk ? (
                        <span className="border-b-4 border-rose-600 font-black tracking-wide text-rose-950 px-1 py-0.5 bg-rose-200/60 rounded">
                          {item.name}
                        </span>
                      ) : (
                        <span>{item.name}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {isHighRisk ? (
                        <span className="border-b-4 border-rose-600 font-black text-rose-900 bg-rose-200/80 px-2 py-0.5 rounded">
                          {item.value}
                        </span>
                      ) : (
                        <span className="font-extrabold text-slate-800">{item.value}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">{item.range}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                          isHighRisk
                            ? 'border-b-4 border-rose-600 bg-rose-600 text-white shadow-sm'
                            : item.badge
                        }`}
                      >
                        {getStatusIcon(item.status)}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs">{item.explanation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClinicalComparisonTable;
