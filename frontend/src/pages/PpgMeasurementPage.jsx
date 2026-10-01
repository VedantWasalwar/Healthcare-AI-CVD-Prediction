import React, { useState, useRef, useEffect } from 'react';
import { estimatePpgHeartRate } from '../services/ppgService';
import { Camera, Heart, Activity, AlertCircle, ShieldAlert, CheckCircle2, RefreshCw, Loader2, Info } from 'lucide-react';

const PpgMeasurementPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const startPpgCapture = async () => {
    setResult(null);
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 320, height: 240 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsRecording(true);
      setProgress(0);

      const redSignals = [];
      const canvas = canvasRef.current;
      const ctx = canvas ? canvas.getContext('2d') : null;
      let frameCount = 0;
      const totalFrames = 150; // 5 seconds @ 30 FPS

      const captureInterval = setInterval(() => {
        if (!videoRef.current || !ctx) return;

        ctx.drawImage(videoRef.current, 0, 0, 100, 100);
        const imgData = ctx.getImageData(0, 0, 100, 100);
        const data = imgData.data;

        // Extract average red channel intensity
        let redSum = 0;
        for (let i = 0; i < data.length; i += 4) {
          redSum += data[i]; // Red channel
        }
        const avgRed = redSum / (data.length / 4);
        redSignals.push(avgRed);

        frameCount++;
        setProgress(Math.round((frameCount / totalFrames) * 100));

        if (frameCount >= totalFrames) {
          clearInterval(captureInterval);
          // Stop video stream
          stream.getTracks().forEach((track) => track.stop());
          setIsRecording(false);

          // Submit red channel signals to backend PPG engine
          sendSignalsToBackend(redSignals);
        }
      }, 33); // ~30 FPS
    } catch (err) {
      setCameraError("Camera access denied or unavailable. Please grant camera permission or verify webcam hardware.");
      setIsRecording(false);
    }
  };

  const sendSignalsToBackend = async (signals) => {
    setLoading(true);
    try {
      const data = await estimatePpgHeartRate(signals, 30.0);
      setResult(data);
    } catch (err) {
      setCameraError("Failed to calculate PPG heart rate signal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 via-pink-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl border border-rose-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30 mb-3">
            <Camera className="w-4 h-4 text-rose-400" />
            Optical Photoplethysmography (Section 14 & 15)
          </span>
          <h1 className="text-3xl font-black">Camera PPG Heart Rate Estimation</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Place your fingertip lightly over the camera lens to capture optical pulse signals and estimate Heart Rate (BPM).
          </p>
        </div>
      </div>

      {/* Camera Capture Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-md text-center space-y-6">
        <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-rose-500 shadow-xl bg-slate-900 flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} width="100" height="100" className="hidden" />

          {isRecording && (
            <div className="absolute inset-0 bg-rose-900/60 flex flex-col items-center justify-center text-white p-4">
              <Heart className="w-12 h-12 text-rose-400 animate-ping mb-2" />
              <span className="text-2xl font-black">{progress}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">Analyzing Pulse</span>
            </div>
          )}
        </div>

        {/* Start Button */}
        {!isRecording && (
          <button
            onClick={startPpgCapture}
            disabled={loading}
            className="py-4 px-8 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
            <span>START CAMERA PPG MEASUREMENT</span>
          </button>
        )}

        {/* Camera Error Alert */}
        {cameraError && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 flex items-center gap-2 max-w-lg mx-auto">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}
      </div>

      {/* PPG Results & Quality Meter */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-xl font-black text-slate-900">PPG Estimation Results</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-black border ${
              result.signal_quality === 'GOOD'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : result.signal_quality === 'FAIR'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}>
              Signal Quality: {result.signal_quality}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heart Rate Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 text-center space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Estimated Heart Rate</span>
              <div className="text-5xl font-black text-rose-400 flex items-center justify-center gap-2">
                <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-pulse" />
                <span>{result.heart_rate_bpm} <span className="text-lg font-bold text-slate-400">BPM</span></span>
              </div>
            </div>

            {/* Experimental BP Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 text-center space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Experimental / Estimated BP</span>
              <div className="text-4xl font-black text-blue-400">
                {result.experimental_bp?.formatted}
              </div>
              <span className="text-[11px] text-amber-400 font-bold block">Experimental Waveform Estimation</span>
            </div>
          </div>

          {/* Mandatory Experimental Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-extrabold">Experimental Measurement Disclaimer:</strong> {result.disclaimer} Always verify blood pressure using a validated clinical blood-pressure cuff.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PpgMeasurementPage;
