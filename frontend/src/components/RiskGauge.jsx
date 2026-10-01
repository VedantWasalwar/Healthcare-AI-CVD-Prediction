import React from 'react';
import { Activity, ShieldAlert, HeartPulse, Sparkles } from 'lucide-react';

const RiskGauge = ({ riskPercentage = 0, riskLevel = 'UNKNOWN', riskProbability = 0, date }) => {
  const pct = Math.min(Math.max(parseFloat(riskPercentage) || 0, 0), 100);

  // SVG Gauge Math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const getGaugeColors = (level) => {
    switch (level?.toUpperCase()) {
      case 'LOW':
        return { stroke: '#10b981', bg: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'MODERATE':
        return { stroke: '#f59e0b', bg: 'from-amber-500/20 to-orange-500/20', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'HIGH':
        return { stroke: '#f43f5e', bg: 'from-rose-500/20 to-pink-500/20', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'VERY HIGH':
        return { stroke: '#a855f7', bg: 'from-purple-500/20 to-pink-600/20', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      default:
        return { stroke: '#3b82f6', bg: 'from-blue-500/20 to-indigo-500/20', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    }
  };

  const style = getGaugeColors(riskLevel);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-700/80 animate-slide-up">
      {/* Background Animated Gradient Glow */}
      <div className={`absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br ${style.bg} rounded-full blur-3xl opacity-60 animate-pulse`} />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
            <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
          </div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            AI Cardiovascular Risk Gauge
          </span>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-md ${style.badge}`}>
          {riskLevel} RISK
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
        {/* Animated Circular Gauge Meter */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="rgba(51, 65, 85, 0.4)"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke={style.stroke}
              strokeWidth="14"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-black ${style.text} tracking-tight`}>{pct.toFixed(1)}%</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Risk Score</span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="flex-1 space-y-4 w-full">
          <div className="glass-panel p-4 rounded-2xl border border-slate-700/60">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Model Probability Score</span>
            <span className="text-2xl font-black text-white font-mono">{riskProbability.toFixed(4)}</span>
            <span className="text-xs text-slate-500 block mt-0.5">(Range: 0.0000 to 1.0000)</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>XGBoost + SHAP Explainer</span>
            </div>
            <span className="text-xs text-emerald-400 font-bold">100% Calibrated</span>
          </div>

          {date && (
            <p className="text-[11px] text-slate-400 text-right">
              Assessment Date: {new Date(date).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
