import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/apiConfig';
import OfflineBanner from '../components/OfflineBanner';
import { Activity, AlertCircle, Loader2, Heart, Scale, Stethoscope, Droplet } from 'lucide-react';

const HealthInputPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: 55,
    gender: 2, // 1: Female, 2: Male
    height: 168,
    weight: 80,
    ap_hi: 145,
    ap_lo: 90,
    cholesterol: 2, // 1: Normal, 2: Above Normal, 3: High
    gluc: 1, // 1: Normal, 2: Above Normal, 3: High
    smoke: 1, // 0: No, 1: Yes
    alco: 0, // 0: No, 1: Yes
    active: 1, // 0: No, 1: Yes
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.ap_lo >= formData.ap_hi) {
      setError('Diastolic Blood Pressure (ap_lo) must be strictly less than Systolic Blood Pressure (ap_hi).');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/predict/', formData);
      if (res.data && res.data.prediction_id) {
        navigate(`/prediction/${res.data.prediction_id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to submit health prediction data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Patient Health Risk Assessment</h1>
            <p className="text-xs text-slate-500">
              Input patient clinical parameters matching the 12 XGBoost dataset features.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Demographics */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <UserIcon className="w-4 h-4" /> Demographics & Physical Body
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  name="age"
                  min="18"
                  max="120"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Biological Sex</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  <option value={2}>Male</option>
                  <option value={1}>Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  min="100"
                  max="220"
                  required
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  min="30"
                  max="250"
                  required
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Vitals & Blood Pressure */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4" /> Blood Pressure Vitals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Systolic Blood Pressure (ap_hi mmHg)</label>
                <input
                  type="number"
                  name="ap_hi"
                  min="70"
                  max="240"
                  required
                  value={formData.ap_hi}
                  onChange={handleChange}
                  placeholder="e.g. 145"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Diastolic Blood Pressure (ap_lo mmHg)</label>
                <input
                  type="number"
                  name="ap_lo"
                  min="40"
                  max="160"
                  required
                  value={formData.ap_lo}
                  onChange={handleChange}
                  placeholder="e.g. 90"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Lab Metrics & Lifestyle */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Droplet className="w-4 h-4" /> Lab Metrics & Lifestyle Habits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Serum Cholesterol</label>
                <select
                  name="cholesterol"
                  value={formData.cholesterol}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  <option value={1}>1: Normal (&lt; 200 mg/dL)</option>
                  <option value={2}>2: Above Normal (200-239 mg/dL)</option>
                  <option value={3}>3: Well Above Normal (≥ 240 mg/dL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fasting Glucose</label>
                <select
                  name="gluc"
                  value={formData.gluc}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  <option value={1}>1: Normal (&lt; 100 mg/dL)</option>
                  <option value={2}>2: Above Normal (100-125 mg/dL)</option>
                  <option value={3}>3: Well Above Normal (≥ 126 mg/dL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Smoking Habit</label>
                <select
                  name="smoke"
                  value={formData.smoke}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  <option value={0}>No (Non-Smoker)</option>
                  <option value={1}>Yes (Active Smoker)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alcohol Consumption</label>
                <select
                  name="alco"
                  value={formData.alco}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  <option value={0}>No / Rare</option>
                  <option value={1}>Regular Intake</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Physical Activity</label>
                <select
                  name="active"
                  value={formData.active}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  <option value={1}>Active (Regular Exercise)</option>
                  <option value={0}>Sedentary (No Regular Exercise)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-base transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running XGBoost Model & SHAP Engine...</span>
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                <span>ANALYZE CARDIOVASCULAR RISK</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default HealthInputPage;
