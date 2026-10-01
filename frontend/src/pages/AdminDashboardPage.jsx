import React, { useState, useEffect } from 'react';
import api from '../config/apiConfig';
import { ShieldCheck, Users, Activity, FileText, AlertTriangle, Database, Cpu, Loader2 } from 'lucide-react';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin-dashboard/stats/');
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      setError("Failed to load admin statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-500">Loading system administration dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-rose-600">
        <p className="font-bold">{error || "Admin stats unavailable."}</p>
      </div>
    );
  }

  const stats = data.stats || {};
  const logs = data.recent_audit_logs || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-3">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            System Administration Portal (Section 18)
          </span>
          <h1 className="text-3xl font-black">Admin Management Dashboard</h1>
          <p className="text-slate-300 text-sm mt-1">
            Monitor registered users, active ML models, dataset versioning, and prediction audit logs.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Users</span>
          <div className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>{stats.total_registered_users}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Predictions Executed</span>
          <div className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            <span>{stats.total_predictions_executed}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Uploaded Reports</span>
          <div className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            <span>{stats.total_uploaded_reports}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">High Risk Flagged</span>
          <div className="text-3xl font-black text-rose-600 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <span>{stats.high_risk_flagged_cases}</span>
          </div>
        </div>
      </div>

      {/* System Settings & Dataset Versioning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Dataset Versioning</span>
          </div>
          <p className="text-lg font-black">{stats.dataset_version}</p>
          <p className="text-xs text-slate-400">Cardiovascular dataset with 12 features & 70,000 patient records.</p>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Active Model Version</span>
          </div>
          <p className="text-lg font-black">{stats.active_model}</p>
          <p className="text-xs text-slate-400">Selected based on highest ROC-AUC (0.8007) and accuracy (73.46%).</p>
        </div>
      </div>

      {/* Recent Audit Logs Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <h3 className="text-xl font-black text-slate-900">Recent Prediction Audit Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white uppercase tracking-wider">
                <th className="py-3 px-4 font-bold rounded-l-xl">ID</th>
                <th className="py-3 px-4 font-bold">User</th>
                <th className="py-3 px-4 font-bold">Risk Percentage</th>
                <th className="py-3 px-4 font-bold">Risk Category</th>
                <th className="py-3 px-4 font-bold rounded-r-xl">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold font-mono">#{log.id}</td>
                  <td className="py-3 px-4">{log.user__username}</td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">{log.risk_percentage}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      log.risk_level === 'HIGH' || log.risk_level === 'VERY HIGH'
                        ? 'bg-rose-100 text-rose-800'
                        : log.risk_level === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {log.risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
