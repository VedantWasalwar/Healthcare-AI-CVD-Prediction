import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../config/apiConfig';
import { User, LogOut, CheckCircle2, XCircle, Database, Cpu, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await api.get('/dashboard/');
        setServerOnline(true);
      } catch (err) {
        setServerOnline(false);
      }
    };
    checkServer();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md mb-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{username}</h1>
            <p className="text-xs text-slate-500 font-semibold">Authenticated Patient Account</p>
          </div>
        </div>

        {/* System Metadata Grid */}
        <h3 className="text-sm font-bold text-slate-900 mb-3">System Health & Metadata</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ServerIcon className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Django REST API Server</span>
                <span className="text-xs font-mono font-bold text-slate-700">{API_BASE_URL}</span>
              </div>
            </div>
            {serverOnline ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Online
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                <XCircle className="w-3.5 h-3.5" /> Offline
              </span>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-purple-600" />
              <div>
                <span className="text-xs font-semibold text-slate-400 block">ML Classifier & SHAP</span>
                <span className="text-xs font-bold text-slate-700">XGBoost TreeExplainer</span>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Dataset Source</span>
                <span className="text-xs font-bold text-slate-700">Cardiovascular Dataset (70,000 Rows)</span>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Medical Safety Mode</span>
                <span className="text-xs font-bold text-slate-700">Non-Pharmacological Guidance Only</span>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-sm transition shadow flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          <span>LOG OUT ACCOUNT</span>
        </button>
      </div>
    </div>
  );
};

const ServerIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
  </svg>
);

export default ProfilePage;
