import React from 'react';

export default function ErrorModal({ open, onClose, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gradient-to-br from-[#0D0B41] via-black to-[#1e293b] rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center">
        <span className="text-3xl font-extrabold text-red-500 mb-3 tracking-wide drop-shadow">Error</span>
        <span className="text-blue-200 mb-6 text-lg text-center font-medium max-w-xs">{message || 'An error occurred. Try reloading the page.'}</span>
        <div className="flex gap-4 mt-2">
          <button
            className="px-8 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg font-bold hover:from-blue-800 hover:to-blue-600 transition shadow"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
          <button
            className="px-8 py-2 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-800 transition shadow"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
