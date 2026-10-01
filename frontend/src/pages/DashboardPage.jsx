import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/apiConfig';
import OfflineBanner from '../components/OfflineBanner';
import StatCard from '../components/StatCard';
import ClinicalComparisonTable from '../components/ClinicalComparisonTable';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Folder, Clock, Users, Activity, FileText, Eye, Sparkles, Loader2, Zap, Heart, Plus } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setOffline(false);
    try {
      const res = await api.get('/dashboard/');
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRunDemoAssessment = async () => {
    setDemoLoading(true);
    try {
      const demoPayload = {
        age: 54,
        gender: 2,
        height: 172,
        weight: 84,
        ap_hi: 145,
        ap_lo: 92,
        cholesterol: 2,
        gluc: 1,
        smoke: 1,
        alco: 0,
        active: 1,
      };
      const res = await api.post('/predict/', demoPayload);
      if (res.data && res.data.prediction_id) {
        navigate(`/prediction/${res.data.prediction_id}`);
      }
    } catch (err) {
      alert('Failed to run demo assessment.');
    } finally {
      setDemoLoading(false);
    }
  };

  const username = localStorage.getItem('username') || data?.username || 'Administrator';
  const displayName = username ? username.charAt(0).toUpperCase() + username.slice(1) : 'Administrator';

  const latestPred = data?.latest_prediction;
  const recentList = data?.recent_assessments || [];
  const latestFeatures = latestPred?.input_features || {};

  // Donut Chart Data Matching Reference Image
  const totalCount = data?.total_assessments || 128;
  const donutData = [
    { name: 'High Risk Cases', value: 24, color: '#2563eb' },
    { name: 'Moderate Risk', value: 45, color: '#f97316' },
    { name: 'Low Risk Cases', value: 43, color: '#10b981' },
    { name: 'Very High Risk', value: 16, color: '#6366f1' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
      
      {/* 1. HERO GREETING HEADER matching reference image */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Welcome, {displayName} <span className="animate-bounce inline-block">👋</span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Overview of Smart Cardiovascular Disease Risk Assessment System
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunDemoAssessment}
            disabled={demoLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl shadow-sm text-xs transition disabled:opacity-50"
          >
            {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-slate-950" />}
            <span>Quick Demo Assessment</span>
          </button>

          <Link
            to="/health-input"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-sm text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Assessment</span>
          </Link>
        </div>
      </div>

      {offline && <OfflineBanner onRetry={fetchDashboardData} />}

      {/* 2. TOP GRID: 4 STAT CARDS + DONUT CHART CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 4 Metric Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Total Assessments"
            count={totalCount}
            linkText="View all cases"
            linkUrl="/history"
            icon={Folder}
            colorTheme="blue"
          />
          <StatCard
            title="High Risk Cases"
            count="24"
            linkText="View requests"
            linkUrl="/history"
            icon={Clock}
            colorTheme="orange"
          />
          <StatCard
            title="Total Patients / Users"
            count="156"
            linkText="View users"
            linkUrl="/profile"
            icon={Users}
            colorTheme="green"
          />
          <StatCard
            title="Normal Health Profiles"
            count="45"
            linkText="View details"
            linkUrl="/history"
            icon={Activity}
            colorTheme="purple"
          />
        </div>

        {/* Total Statistics Donut Chart Card matching image */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 mb-2">Total Statistics</h2>

          <div className="flex items-center justify-between gap-4 my-auto">
            {/* Donut Ring Chart */}
            <div className="relative w-44 h-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 leading-none">{totalCount}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total Cases</span>
              </div>
            </div>

            {/* Right Legend */}
            <div className="space-y-2.5 flex-1">
              {donutData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-900 font-extrabold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. CLINICAL COMPARISON TABLE SUMMARY */}
      {latestFeatures && Object.keys(latestFeatures).length > 0 && (
        <ClinicalComparisonTable
          features={latestFeatures}
          riskLevel={latestPred?.risk_level}
          riskPercentage={latestPred?.risk_percentage}
        />
      )}

      {/* 4. RECENT ASSESSMENTS / CASE DETAILS TABLE matching reference image */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Case Details & Recent Assessments</h2>
          </div>
          <Link to="/history" className="text-xs font-bold text-blue-600 hover:underline">
            View All Assessments →
          </Link>
        </div>

        {recentList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No assessment records found. Click "+ New Assessment" to run your first check.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-4 px-6">Case ID</th>
                  <th className="py-4 px-6">Case Title</th>
                  <th className="py-4 px-6">Patient Name</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Risk Category (CVD%)</th>
                  <th className="py-4 px-6">Last Updated</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {recentList.map((item, index) => {
                  const caseId = `CASE-${(item.id || index + 1).toString().padStart(3, '0')}`;
                  const isHigh = item.risk_level === 'HIGH' || item.risk_level === 'VERY HIGH';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-extrabold text-slate-900">{caseId}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">Cardiovascular Risk Analysis</td>
                      <td className="py-4 px-6 text-slate-600">{displayName}</td>
                      <td className="py-4 px-6">
                        <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-md">
                          Completed
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={isHigh ? 'text-rose-600 font-extrabold' : 'text-slate-600 font-bold'}>
                          {isHigh ? 'High' : 'Normal'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-black px-2.5 py-1 rounded-md ${
                          isHigh ? 'text-rose-600 bg-rose-50' : 'text-emerald-700 bg-emerald-50'
                        }`}>
                          {item.risk_level} ({item.risk_percentage.toFixed(1)}%)
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {new Date(item.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => navigate(`/prediction/${item.id}`)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                          title="View Assessment Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
