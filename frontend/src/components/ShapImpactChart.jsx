import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const ShapImpactChart = ({ shapData = [] }) => {
  if (!shapData || shapData.length === 0) return null;

  const chartData = shapData.map((item) => ({
    name: item.readableFeatureName || item.feature,
    shapValue: parseFloat(item.shap_value) || 0,
    formattedValue: item.formattedValue,
    direction: item.direction,
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">SHAP Feature Contribution Analysis</h3>
        <p className="text-xs text-slate-500 mt-1">
          Exact mathematical impact of each health feature on the XGBoost prediction. Positive values increase risk, while negative values decrease risk.
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={140} />
            <Tooltip
              formatter={(value, name, props) => [
                `${value > 0 ? '+' : ''}${value.toFixed(4)} (Value: ${props.payload.formattedValue})`,
                'SHAP Impact Score',
              ]}
            />
            <ReferenceLine x={0} stroke="#94a3b8" />
            <Bar dataKey="shapValue" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.shapValue > 0 ? '#e11d48' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ShapImpactChart;
