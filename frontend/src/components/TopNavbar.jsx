import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';

const TopNavbar = ({ onOpenSidebar, username = 'Administrator', pageTitle = 'Dashboard' }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const displayName = username
    ? username.charAt(0).toUpperCase() + username.slice(1)
    : 'Administrator';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Menu Toggle + Page Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSidebar}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-extrabold text-slate-900">{pageTitle}</h1>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-5">
            
            {/* Notification Bell with Badge */}
            <div className="relative">
              <button className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition">
                <Bell className="w-5 h-5" />
              </button>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white shadow">
                5
              </span>
            </div>

            {/* User Profile Pill matching image */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 hover:bg-slate-100 rounded-2xl transition"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center border border-blue-200">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-sm font-extrabold text-slate-900 leading-tight">{displayName}</span>
                  <span className="text-[11px] text-slate-500 font-medium block">HeartCare Patient</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{displayName}</p>
                    <p className="text-[10px] text-slate-500">Authenticated User</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4 text-slate-400" /> Profile
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="w-4 h-4 text-slate-400" /> Settings
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
