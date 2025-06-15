import React, { useState } from 'react';
import axios from 'axios';

const SingleMaterial = ({ fileId, name, isSelf, _id: materialId }) => {
  const [showFallback, setShowFallback] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const previewImage = `https://drive.google.com/thumbnail?id=${fileId}`;
  const previewLink = `https://drive.google.com/file/d/${fileId}/view`;

  async function handleDelete(e) {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    setDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/material/delete-material/${materialId}`, { withCredentials: true });
      window.location.reload(); // Or trigger a parent refresh if you want a better UX
    } catch {
      alert('Failed to delete material');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <a
      href={previewLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block w-36 group"
    >
      <div className="relative">
        <div className="relative w-full h-48 flex items-center justify-center bg-[#23244a] rounded border overflow-hidden">
          {/* Delete icon for owner */}
          {isSelf && (
            <button
              className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-red-600/80 rounded-full p-1 transition-colors"
              title="Delete Material"
              onClick={handleDelete}
              disabled={deleting}
              style={{ cursor: deleting ? 'not-allowed' : 'pointer' }}
            >
              {/* Trash/Delete SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
              </svg>
            </button>
          )}
          {!showFallback && (
            <img
              src={previewImage}
              alt="PDF Preview"
              className="w-full h-full object-cover"
              onError={() => setShowFallback(true)}
              onLoad={e => {
                if (e.target.naturalWidth === 0) setShowFallback(true);
              }}
            />
          )}
          {showFallback && (
            <div className="fallback-icon absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="4" y="4" width="16" height="20" rx="3" fill="#23244a" stroke="#3b82f6" strokeWidth="2"/>
                <path d="M8 8h8M8 12h8M8 16h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-xs text-gray-400">No Preview</span>
            </div>
          )}
        </div>
        {name && (
          <p className="text-sm text-white text-center mt-1 truncate">{name}</p>
        )}
      </div>
    </a>
  );
};

export default SingleMaterial;
