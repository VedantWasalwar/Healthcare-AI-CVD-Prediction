import React, { useState } from 'react';
import { sendTextMessage, sendVoiceQuery, analyzeMedicalImage } from '../services/chatService';
import {
  MessageSquare, Mic, Image as ImageIcon, Send, Volume2, ShieldAlert,
  Loader2, CheckCircle2, Info, AlertTriangle, FileText, Pill
} from 'lucide-react';

const ChatbotPage = () => {
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'voice', 'image'
  
  // Mode 1: Text Chat
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your HeartCare AI Health Assistant. Ask me questions about blood pressure, cholesterol, exercise, or your risk assessment score.' }
  ]);
  const [textInput, setTextInput] = useState('');
  const [textLoading, setTextLoading] = useState(false);

  // Mode 2: Voice Chat
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceLang, setVoiceLang] = useState('en');
  const [voiceResponse, setVoiceResponse] = useState(null);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Mode 3: Image OCR
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  // Handle Mode 1: Text Chat
  const handleSendText = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const userMsg = textInput;
    setTextInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setTextLoading(true);

    try {
      const data = await sendTextMessage(userMsg);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.response,
          isEmergency: data.is_emergency
        }
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, I failed to process your question. Please try again.' }]);
    } finally {
      setTextLoading(false);
    }
  };

  // Handle Mode 2: Voice Query
  const handleVoiceSubmit = async (e) => {
    e.preventDefault();
    if (!voiceQuery.trim()) return;

    setVoiceLoading(true);
    try {
      const data = await sendVoiceQuery(voiceQuery, voiceLang);
      setVoiceResponse(data);
      
      // Speak back text using Web Speech API if supported
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.spoken_response);
        utterance.lang = voiceLang === 'hi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      alert('Voice query processing failed.');
    } finally {
      setVoiceLoading(false);
    }
  };

  // Browser Web Speech API Listener
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your query below.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLang === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  // Handle Mode 3: Image Upload & OCR
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setOcrLoading(true);
    setOcrResult(null);

    try {
      const data = await analyzeMedicalImage(file);
      setOcrResult(data);
    } catch (err) {
      alert('Medical image OCR analysis failed.');
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-3">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            Multimodal AI Health Assistant (Section 13)
          </span>
          <h1 className="text-3xl font-black">AI Cardiovascular Assistant</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Interactive medical Q&A assistant supporting Text, Multilingual Voice (English & Hindi), and Medicine Strip OCR Image Analysis.
          </p>
        </div>

        {/* 3-Mode Tab Switcher */}
        <div className="flex items-center bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'text' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Text Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'voice' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voice Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'image' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Medicine OCR</span>
          </button>
        </div>
      </div>

      {/* MODE 1: TEXT CHAT */}
      {activeTab === 'text' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col h-[520px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-lg p-4 rounded-2xl text-xs leading-relaxed font-medium shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : m.isEmergency
                      ? 'bg-rose-900 text-white border border-rose-700 rounded-bl-none font-bold'
                      : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {textLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-500 p-3 rounded-2xl text-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Analyzing question...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendText} className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Ask about BP, cholesterol, risk scores, or exercise..."
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={textLoading || !textInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs transition flex items-center gap-1.5 shadow disabled:opacity-50"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* MODE 2: VOICE CHAT */}
      {activeTab === 'voice' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-black text-slate-900">Multilingual Voice Assistant</h3>
              <p className="text-xs text-slate-500">Speak your cardiovascular health questions in English or Hindi.</p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setVoiceLang('en')}
                className={`px-3 py-1 rounded-lg ${voiceLang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                English
              </button>
              <button
                onClick={() => setVoiceLang('hi')}
                className={`px-3 py-1 rounded-lg ${voiceLang === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>

          {/* Voice Input Controls */}
          <div className="flex flex-col items-center justify-center py-6 space-y-4 bg-slate-50 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={startSpeechRecognition}
              className={`p-6 rounded-full text-white shadow-xl transition transform hover:scale-105 ${
                isListening ? 'bg-rose-600 animate-ping' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Mic className="w-8 h-8" />
            </button>
            <p className="text-xs font-extrabold text-slate-600">
              {isListening ? 'Listening to your speech...' : 'Click Microphone to Speak'}
            </p>
          </div>

          <form onSubmit={handleVoiceSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transcribed Query</label>
              <input
                type="text"
                value={voiceQuery}
                onChange={(e) => setVoiceQuery(e.target.value)}
                placeholder="Spoken text appears here..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-2xl px-4 py-3 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={voiceLoading || !voiceQuery.trim()}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs transition shadow flex items-center justify-center gap-2"
            >
              {voiceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
              <span>PROCESS VOICE QUERY</span>
            </button>
          </form>

          {/* Spoken Response Result */}
          {voiceResponse && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900 text-xs space-y-2">
              <span className="font-extrabold uppercase tracking-wider block text-emerald-700">Voice Response:</span>
              <p className="font-bold text-sm leading-relaxed">{voiceResponse.spoken_response}</p>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: MEDICINE IMAGE OCR */}
      {activeTab === 'image' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-md space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">Medicine Strip & Prescription OCR Analyzer</h3>
            <p className="text-xs text-slate-500">Upload a medicine strip or prescription image to extract structured safety information cards.</p>
          </div>

          {/* Upload Drop Zone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-8 text-center bg-slate-50 hover:bg-blue-50/40 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="med-upload"
            />
            <label htmlFor="med-upload" className="cursor-pointer space-y-3 block">
              <Pill className="w-10 h-10 text-blue-600 mx-auto" />
              <div className="text-xs font-extrabold text-slate-800">
                Click to upload Medicine Strip or Prescription Image
              </div>
              <p className="text-[11px] text-slate-400">Supported Formats: JPG, JPEG, PNG</p>
            </label>
          </div>

          {ocrLoading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Running Tesseract OCR & safety validation...</p>
            </div>
          )}

          {/* 3 STRUCTURED CARDS (Section 13 Mode 3) */}
          {ocrResult && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  Detected: {ocrResult.detected_item}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* CARD 1: PURPOSE */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-xs text-blue-900 space-y-2 shadow-sm">
                  <span className="font-extrabold text-blue-950 uppercase tracking-wider block flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-600" />
                    CARD 1: Purpose
                  </span>
                  <p className="leading-relaxed font-semibold">{ocrResult.cards.card1_purpose}</p>
                </div>

                {/* CARD 2: MISSED DOSE */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 space-y-2 shadow-sm">
                  <span className="font-extrabold text-amber-950 uppercase tracking-wider block flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    CARD 2: Missed Dose Safety
                  </span>
                  <p className="leading-relaxed font-semibold">{ocrResult.cards.card2_missed_dose}</p>
                </div>

                {/* CARD 3: PRECAUTIONS */}
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-xs text-rose-900 space-y-2 shadow-sm">
                  <span className="font-extrabold text-rose-950 uppercase tracking-wider block flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    CARD 3: Precautions & Warnings
                  </span>
                  <p className="leading-relaxed font-semibold">{ocrResult.cards.card3_precautions}</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[11px] text-slate-500 italic text-center">
                {ocrResult.disclaimer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;
