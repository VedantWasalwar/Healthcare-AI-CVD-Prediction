import React, { useState, useEffect } from 'react';
import api from '../config/apiConfig';
import { FileText, Download, Loader2 } from 'lucide-react';

const ReportHistoryPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await api.get('/medical-reports/');
        if (res.data) {
          setReports(res.data.results || res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDownload = async (reportId) => {
    setDownloadingId(reportId);
    try {
      const res = await api.get(`/medical-reports/${reportId}/download/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `HeartCare_Medical_Report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download PDF report.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
          <FileText className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Generated PDF Medical Reports</h1>
          <p className="text-xs text-slate-500">Download publication-quality A4 Health Assessment Reports.</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
          Loading report history...
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No generated PDF reports found. Run a prediction to generate a report.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 font-bold">Report Code</th>
                <th className="py-3.5 px-4 font-bold">Generated Date</th>
                <th className="py-3.5 px-4 font-bold">Risk Level</th>
                <th className="py-3.5 px-4 font-bold text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {reports.map((rpt) => (
                <tr key={rpt.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{rpt.report_number || `#RPT-${rpt.id}`}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs">
                    {new Date(rpt.created_at).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {rpt.risk_level || 'ASSESSED'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDownload(rpt.id)}
                      disabled={downloadingId === rpt.id}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {downloadingId === rpt.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 text-purple-400" />
                      )}
                      <span>Download PDF</span>
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

export default ReportHistoryPage;
