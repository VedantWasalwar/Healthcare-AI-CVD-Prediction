import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/apiConfig';
import { Heart, Lock, User, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login/', { username, password });
      if (res.data && res.data.tokens) {
        localStorage.setItem('access_token', res.data.tokens.access);
        localStorage.setItem('refresh_token', res.data.tokens.refresh);
        localStorage.setItem('username', res.data.user?.username || username);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 border border-slate-100">
        
        {/* Left Side: SaaS Healthcare Branding Panel */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-rose-500/20 text-rose-500 rounded-2xl border border-rose-500/30">
                <Heart className="w-8 h-8 fill-rose-500" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">HEARTCARE AI</h1>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cardiovascular Analytics</span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-white mb-3">
              AI-Powered Cardiovascular Disease Risk System
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Clinical decision support platform featuring trained XGBoost ML classification, SHAP feature explainability, and ReportLab A4 medical PDF reports.
            </p>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>XGBoost ML Trained on 70,000 Patient Records</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Explainable AI Risk Drivers with SHAP</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automatic OCR Medical Report Scanning</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>A4 Publication-Quality Medical PDF Downloads</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-400">
            Educational Decision-Support System &bull; Not a Medical Diagnosis
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-slate-900">Welcome Back</h3>
            <p className="text-xs text-slate-500 mt-1">Sign in to your HeartCare AI account</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 mb-5 flex items-center gap-2.5 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Username</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SIGN IN TO DASHBOARD'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-extrabold text-blue-600 hover:underline">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
