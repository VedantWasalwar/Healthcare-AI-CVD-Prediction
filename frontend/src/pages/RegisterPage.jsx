import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/apiConfig';
import { Heart, Lock, User, Mail, AlertCircle, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const parseErrorMessage = (err) => {
    if (!err.response) {
      return "Backend server is not connected. Please ensure Django is running on http://127.0.0.1:8000.";
    }

    const data = err.response.data;
    if (data?.errors) {
      if (typeof data.errors === 'string') return data.errors;
      if (typeof data.errors === 'object') {
        const messages = [];
        for (const [key, val] of Object.entries(data.errors)) {
          const fieldMsg = Array.isArray(val) ? val.join(', ') : val;
          messages.push(`${key}: ${fieldMsg}`);
        }
        return messages.join(' | ');
      }
    }

    return data?.error || data?.detail || "Registration failed. Please try a different username or email.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/register/', formData);
      if (res.data && res.data.tokens) {
        localStorage.setItem('access_token', res.data.tokens.access);
        localStorage.setItem('refresh_token', res.data.tokens.refresh);
        localStorage.setItem('username', res.data.user.username);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-6">
          <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-2xl mb-3 shadow-inner">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Create Account</h1>
          <p className="text-xs text-slate-500 mt-1">Join HeartCare AI System</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-4 flex items-center gap-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Username</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose unique username"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="patient@example.com"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min 6 chars)"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-5">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
