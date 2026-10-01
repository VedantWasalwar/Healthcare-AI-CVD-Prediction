import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart, LayoutDashboard, Activity, FileUp, History, FileText, User, LogOut, ChevronDown,
  Stethoscope, MessageSquare, Camera, BarChart3, ShieldCheck
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const username = localStorage.getItem('username') || 'User';
  const isLoggedIn = !!localStorage.getItem('access_token');

  const displayName = username
    ? username.charAt(0).toUpperCase() + username.slice(1)
    : 'User';

  const userInitials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (!isLoggedIn) return null;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/health-input', label: 'Analyze Health', icon: Activity },
    { path: '/upload-report', label: 'Upload OCR Report', icon: FileUp },
    { path: '/doctors', label: 'Doctor Finder', icon: Stethoscope },
    { path: '/chat', label: 'AI Chatbot', icon: MessageSquare },
    { path: '/ppg', label: 'Camera PPG', icon: Camera },
    { path: '/model-performance', label: 'Model Performance', icon: BarChart3 },
    { path: '/admin-dashboard', label: 'Admin Portal', icon: ShieldCheck },
    { path: '/history', label: 'History', icon: History },
    { path: '/reports', label: 'PDF Reports', icon: FileText },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <Link to="/dashboard" className="flex items-center gap-2.5 font-black text-xl text-white group shrink-0">
            <div className="p-2 bg-rose-500/20 text-rose-500 rounded-xl border border-rose-500/30 group-hover:scale-105 transition">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-base font-black tracking-wide">HEARTCARE AI</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Cardiovascular System</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5 overflow-x-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right User & Logout Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-[10px]">
                  {userInitials}
                </div>
                <span>{displayName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 text-slate-900">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{displayName}</p>
                    <p className="text-[10px] text-slate-500">Authenticated User</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4 text-slate-400" /> Profile & Settings
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition shadow"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Sub-Bar */}
        <div className="xl:hidden flex items-center overflow-x-auto py-2 border-t border-slate-800 gap-2 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold shrink-0 transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
