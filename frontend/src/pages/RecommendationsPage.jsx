import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../config/apiConfig';
import { Lightbulb, Heart, ShieldCheck, Activity, Utensils, Stethoscope, ArrowLeft, Loader2 } from 'lucide-react';

const RecommendationsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const predictionId = location.state?.predictionId;

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      try {
        if (predictionId) {
          const res = await api.get(`/recommendations/${predictionId}/`);
          setRecommendations(res.data?.recommendations);
        } else {
          // Fetch latest recommendation
          const dashRes = await api.get('/dashboard/');
          const latestId = dashRes.data?.latest_prediction?.id;
          if (latestId) {
            const res = await api.get(`/recommendations/${latestId}/`);
            setRecommendations(res.data?.recommendations);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [predictionId]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 shadow-xl mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-extrabold">AI Health Guidance Engine</h1>
        </div>
        <p className="text-blue-100 text-sm max-w-2xl">
          Personalized, non-pharmacological cardiovascular risk reduction recommendations based on your unique SHAP risk drivers.
        </p>
      </div>

      {/* Safety Legal Disclaimer */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 mb-8 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Educational Decision-Support Disclaimer:</span>
          This engine provides lifestyle, dietary, and monitoring advice only. It does NOT prescribe medication or medical treatment orders. Always consult a qualified cardiologist or healthcare professional.
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          Generating personalized recommendations...
        </div>
      ) : recommendations ? (
        <div className="space-y-6">
          {/* Lifestyle Modifications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Lifestyle & Activity Guidance</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-700">
              {recommendations.lifestyle?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dietary Modifications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600" />
              <span>Dietary Adjustments</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-700">
              {recommendations.dietary?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Monitoring Guidance */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600" />
              <span>Monitoring & Clinical Follow-up</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-700">
              {recommendations.monitoring?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No recommendation data available for this assessment.
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
