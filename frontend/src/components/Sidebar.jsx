import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Activity, FileUp, History, FileText, Lightbulb, User, Settings, LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/health-input', label: 'Analyze Health', icon: Activity },
    { path: '/upload-report', label: 'Upload Report', icon: FileUp },
    { path: '/history', label: 'Prediction History', icon: History },
    { path: '/reports', label: 'Medical Reports', icon: FileText },
    { path: '/recommendations', label: 'AI Recommendations', icon: Lightbulb },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation matching image style */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0b192c] text-white z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header with Shield Icon */}
          <div className="p-6 flex items-center justify-between border-b border-slate-800/60">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30 group-hover:scale-105 transition">
                <Shield className="w-7 h-7 text-blue-400 fill-blue-500/30" />
              </div>
              <div>
                <h1 className="font-black text-lg text-white tracking-wider leading-none">HEARTCARE</h1>
                <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase block mt-1">Smart Risk AI</span>
              </div>
            </Link>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation List */}
          <nav className="p-4 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile, Settings & Red Logout */}
        <div className="p-4 space-y-1 border-t border-slate-800/60">
          <Link
            to="/profile"
            onClick={onClose}
            className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              location.pathname === '/profile' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <User className="w-5 h-5 text-slate-400" />
            <span>Profile</span>
          </Link>

          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition text-left mt-2"
          >
            <LogOut className="w-5 h-5 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
