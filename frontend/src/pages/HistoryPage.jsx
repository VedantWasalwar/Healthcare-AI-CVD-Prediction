import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/apiConfig';
import { History, Loader2, ArrowRight } from 'lucide-react';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get('/predictions/');
        if (res.data) {
          setHistory(res.data.results || res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
          <History className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Prediction History</h1>
          <p className="text-xs text-slate-500">View all past cardiovascular risk assessments.</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
          Loading assessment history...
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No past assessment records found.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 font-bold">Record ID</th>
                <th className="py-3.5 px-4 font-bold">Assessment Date</th>
                <th className="py-3.5 px-4 font-bold">Risk Percentage</th>
                <th className="py-3.5 px-4 font-bold">Risk Level</th>
                <th className="py-3.5 px-4 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">#CVD-{item.id}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-800">
                    {item.risk_percentage?.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
                      {item.risk_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate(`/prediction/${item.id}`)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
