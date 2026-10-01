import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, count, linkText, linkUrl, icon: Icon, colorTheme = 'blue' }) => {
  const getThemeStyles = (theme) => {
    switch (theme) {
      case 'orange':
        return {
          iconBg: 'bg-orange-100 text-orange-600',
          linkText: 'text-orange-600 hover:text-orange-700',
          sparkline: '#f97316',
        };
      case 'green':
        return {
          iconBg: 'bg-emerald-100 text-emerald-600',
          linkText: 'text-emerald-600 hover:text-emerald-700',
          sparkline: '#10b981',
        };
      case 'purple':
        return {
          iconBg: 'bg-indigo-100 text-indigo-600',
          linkText: 'text-indigo-600 hover:text-indigo-700',
          sparkline: '#6366f1',
        };
      default: // blue
        return {
          iconBg: 'bg-blue-100 text-blue-600',
          linkText: 'text-blue-600 hover:text-blue-700',
          sparkline: '#2563eb',
        };
    }
  };

  const style = getThemeStyles(colorTheme);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between h-44">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-2xl ${style.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 max-w-[130px] text-right leading-tight">
            {title}
          </span>
        </div>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{count}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <Link to={linkUrl || '#'} className={`text-xs font-extrabold flex items-center gap-1 ${style.linkText}`}>
          <span>{linkText || 'View details'}</span>
        </Link>
        {/* Trend Curve SVG matching reference image */}
        <svg className="w-16 h-5" viewBox="0 0 60 20" fill="none">
          <path
            d="M2 16 Q 15 18, 30 10 T 58 4"
            stroke={style.sparkline}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M54 2 L58 4 L56 8" stroke={style.sparkline} strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  );
};

export default StatCard;
