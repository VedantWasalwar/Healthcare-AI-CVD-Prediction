import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const OfflineBanner = ({ onRetry, message = "Backend server is not connected." }) => {
  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 text-sm sm:text-base">{message}</h4>
            <p className="text-xs text-amber-700">
              Make sure Django REST API is running on <code className="bg-amber-100 px-1 rounded">http://127.0.0.1:8000</code>.
            </p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-sm font-semibold transition shadow"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default OfflineBanner;
