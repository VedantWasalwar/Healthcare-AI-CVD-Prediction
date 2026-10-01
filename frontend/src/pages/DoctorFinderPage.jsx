import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRecommendedDoctors } from '../services/doctorService';
import { Stethoscope, Phone, MapPin, Star, Calendar, AlertTriangle, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';

const DoctorFinderPage = () => {
  const location = useLocation();
  const passedRisk = location.state?.riskLevel || '';
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState(passedRisk || 'HIGH');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [guidance, setGuidance] = useState('');

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await getRecommendedDoctors(riskFilter, specialtyFilter);
      if (data.results) {
        setDoctors(data.results);
        setGuidance(data.recommendation_guidance);
      }
    } catch (err) {
      console.error("Failed to load doctor directory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [riskFilter, specialtyFilter]);

  const handleCallClinic = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleGetDirections = (address, city) => {
    const query = encodeURIComponent(`${address}, ${city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-slide-up">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl border border-blue-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-3">
            <Stethoscope className="w-4 h-4 text-blue-400" />
            Specialist Matching Engine (Section 11)
          </div>
          <h1 className="text-3xl font-black">Doctor & Clinic Finder</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Connect with verified cardiologists and internal medicine specialists based on your cardiovascular risk assessment score.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Risk Severity</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-800 text-white font-bold rounded-xl px-3 py-2 border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Risk Levels</option>
              <option value="HIGH">High / Very High Risk</option>
              <option value="MODERATE">Moderate Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Specialty</label>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="bg-slate-800 text-white font-bold rounded-xl px-3 py-2 border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specialties</option>
              <option value="CARDIOLOGIST">Cardiologist</option>
              <option value="GENERAL_PHYSICIAN">General Physician</option>
              <option value="ENDOCRINOLOGIST">Endocrinologist</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clinical Specialty Matching Alert */}
      {guidance && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-extrabold text-blue-950">Clinical Decision Support Suggestion:</strong> {guidance}
          </p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Searching verified medical directory...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No doctors match the selected filters</h3>
          <p className="text-xs text-slate-400 mt-1">Try switching the specialty filter to 'All Specialties'.</p>
        </div>
      ) : (
        /* Doctor Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition flex flex-col justify-between space-y-5 group"
            >
              {/* Doctor Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full uppercase">
                      {doc.specialty_display}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-blue-600 transition">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">{doc.qualification}</p>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-black shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-extrabold text-slate-800">{doc.hospital_name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                      {doc.experience_years} yrs exp
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{doc.address}, {doc.city}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  onClick={() => handleCallClinic(doc.phone)}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Clinic</span>
                </button>

                <button
                  onClick={() => handleGetDirections(doc.address, doc.city)}
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
                >
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorFinderPage;
