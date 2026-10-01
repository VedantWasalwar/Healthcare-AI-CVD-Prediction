import React from 'react';
import { Sparkles, TrendingDown, ArrowRight, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

const CounterfactualCard = ({ counterfactual }) => {
  if (!counterfactual || !counterfactual.changed_variables || counterfactual.changed_variables.length === 0) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 mb-8 text-center text-xs text-emerald-800">
        <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
        <p className="font-bold">Your key lifestyle and physiological parameters are operating within optimal bounds.</p>
        <p className="text-slate-500 mt-1">No major hypothetical parameter changes were required for this model scenario.</p>
      </div>
    );
  }

  const currentPct = counterfactual.current_risk_percentage || 0;
  const hypoPct = counterfactual.hypothetical_risk_percentage || 0;
  const deltaPct = counterfactual.risk_delta_percentage || 0;
  const hypoLevel = counterfactual.hypothetical_risk_level || 'LOW';

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md mb-8 space-y-6">
      {/* Header Banner */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl shadow">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <span className="text-xs font-black text-emerald-600 uppercase tracking-widest block">
            Counterfactual AI Simulation (Section 32.5)
          </span>
          <h3 className="text-xl font-black text-slate-900">What Could Change the Prediction?</h3>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        This hypothetical model scenario demonstrates how modifying actionable lifestyle and clinical variables could impact the XGBoost model's predicted risk score. Immutable variables (Age, Gender) remain strictly constant.
      </p>

      {/* Current vs Hypothetical Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Risk */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Current Assessment Risk
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-400">{currentPct.toFixed(1)}%</span>
          </div>
          <span className="text-xs font-semibold text-slate-400 mt-2 block">Actual Model Prediction</span>
        </div>

        {/* Arrow Divider */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <TrendingDown className="w-8 h-8 text-emerald-600 mb-1 animate-bounce" />
          <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
            Potential Model Reduction
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1">-{deltaPct.toFixed(1)}%</span>
        </div>

        {/* Hypothetical Risk */}
        <div className="bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-800 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Hypothetical Model Scenario
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-300">{hypoPct.toFixed(1)}%</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700">
              {hypoLevel}
            </span>
          </div>
          <span className="text-xs font-semibold text-emerald-200/80 mt-2 block">Simulated Model Output</span>
        </div>
      </div>

      {/* Changed Variables Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
              <th className="py-3 px-4 font-bold rounded-l-xl">Actionable Variable</th>
              <th className="py-3 px-4 font-bold">Current Assessment</th>
              <th className="py-3 px-4 font-bold">Hypothetical Target</th>
              <th className="py-3 px-4 font-bold rounded-r-xl">Model Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {counterfactual.changed_variables.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 font-bold text-slate-900">{item.variable}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-600">{item.current}</td>
                <td className="py-3.5 px-4 font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  {item.hypothetical}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {item.direction}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mandatory Safety Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold">Hypothetical Model Scenario Disclaimer:</strong> This simulation illustrates how specific parameter adjustments relate to model predictions. This is <em>not a medical prescription</em> or guaranteed clinical outcome. Always discuss meaningful health and lifestyle changes with a qualified healthcare professional.
        </p>
      </div>
    </div>
  );
};

export default CounterfactualCard;
