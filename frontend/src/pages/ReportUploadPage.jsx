import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/apiConfig';
import { evaluateClinicalParameter } from '../utils/clinicalRanges';
import { FileUp, UploadCloud, AlertCircle, CheckCircle2, Loader2, Sparkles, Activity, Edit3 } from 'lucide-react';

const ReportUploadPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUploadAndExtract = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF, JPG, or PNG medical report file to upload.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/reports/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data && res.data.extracted_data) {
        setReportData(res.data);
        setEditedValues({ ...res.data.extracted_data });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'OCR document processing failed. Ensure file is readable.');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key, val) => {
    setEditedValues({
      ...editedValues,
      [key]: parseFloat(val) || val,
    });
  };

  const handleConfirmAndAnalyze = async () => {
    if (!reportData) return;

    setConfirmLoading(true);
    setError(null);

    try {
      const res = await api.post(`/reports/${reportData.id}/confirm/`, {
        confirmed_features: editedValues,
      });

      if (res.data && res.data.prediction_id) {
        navigate(`/prediction/${res.data.prediction_id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Confirmation failed. Please verify confirmed parameters.');
    } finally {
      setConfirmLoading(false);
    }
  };

  const supportedKeys = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="medical-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <FileUp className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest block">Medical Document Processing</span>
            <h1 className="text-2xl font-black text-slate-900">Upload Medical Report (OCR Scan)</h1>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {!reportData ? (
          /* Step 1: Upload Form */
          <form onSubmit={handleUploadAndExtract} className="space-y-6">
            <div className="border-3 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-10 text-center bg-slate-50/50 transition group">
              <UploadCloud className="w-16 h-16 text-slate-400 group-hover:text-emerald-500 mx-auto mb-4 transition-transform group-hover:scale-110" />
              <h3 className="font-extrabold text-slate-900 text-lg mb-1">Select Medical Report File</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                Supported Formats: PDF, JPG, JPEG, PNG. Extracts Blood Pressure, Cholesterol, Glucose, BMI & habits using Tesseract OCR.
              </p>

              <input
                type="file"
                id="file-upload"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition cursor-pointer shadow-lg transform hover:-translate-y-0.5"
              >
                Choose File from Computer
              </label>

              {selectedFile && (
                <p className="text-xs font-black text-emerald-700 mt-4 flex items-center justify-center gap-1.5 bg-emerald-100/80 px-4 py-2 rounded-xl inline-block border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-base transition shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Extracting Health Parameters with Tesseract OCR...</span>
                </>
              ) : (
                <>
                  <FileUp className="w-6 h-6" />
                  <span>UPLOAD & EXTRACT REPORT PARAMETERS</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Extracted Health Values Review & Manual Edit */
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Detected Health Values — Review & Edit before ML Prediction</span>
              </div>
              <button
                onClick={() => setReportData(null)}
                className="text-xs text-slate-600 hover:underline font-bold"
              >
                Upload Different File
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Health Parameter</th>
                    <th className="py-3 px-4 font-bold">Detected Value</th>
                    <th className="py-3 px-4 font-bold">Edit / Update Value</th>
                    <th className="py-3 px-4 font-bold">Clinical Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {supportedKeys.map((key) => {
                    const evalItem = evaluateClinicalParameter(key, editedValues[key]);
                    const isHigh = evalItem.status === 'HIGH RISK' || evalItem.status === 'ELEVATED';
                    return (
                      <tr key={key} className={`transition ${isHigh ? 'bg-rose-50/70' : 'hover:bg-slate-50'}`}>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {isHigh ? (
                            <span className="border-b-4 border-rose-600 font-black text-rose-950 px-1 py-0.5 bg-rose-200/60 rounded">
                              {evalItem.name}
                            </span>
                          ) : (
                            <span>{evalItem.name}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-xs">
                          {reportData.extracted_data[key] !== undefined ? reportData.extracted_data[key] : 'Not Detected'}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={editedValues[key] !== undefined ? editedValues[key] : ''}
                            onChange={(e) => handleValueChange(key, e.target.value)}
                            className="w-28 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-inner"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${isHigh ? 'border-b-4 border-rose-600 bg-rose-600 text-white' : evalItem.badge}`}>
                            {evalItem.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleConfirmAndAnalyze}
              disabled={confirmLoading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-base transition shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {confirmLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Executing XGBoost Prediction & Generating PDF...</span>
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  <span>CONFIRM & ANALYZE HEALTH RISK</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportUploadPage;
