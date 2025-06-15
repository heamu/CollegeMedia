import { useState } from "react";
import axios from "axios";

function MaterialUpload() {
  const [driveUrl, setDriveUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

   function extractFileId(url) {
    // Accepts URLs like https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const match = url.match(/\/file\/d\/([\w-]+)/);
    return match ? match[1] : null;
  }

    function isValidDriveFileUrl(url) {
    return /https:\/\/drive\.google\.com\/file\/d\//.test(url);
  }

  
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!driveUrl || !fileName) {
      setError("Please provide both Google Drive URL and file name.");
      return;
    }
    if (!isValidDriveFileUrl(driveUrl)) {
      setError("Please provide a valid Google Drive file URL (not a folder).");
      return;
    }
    const fileId = extractFileId(driveUrl);
    if (!fileId) {
      setError("Could not extract file ID from the provided URL.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/material/upload-material`,
        { fileId, fileName },
        { withCredentials: true }
      );
      setSuccess("Material uploaded successfully!");
      setDriveUrl("");
      setFileName("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload material");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <form onSubmit={handleSubmit} className="bg-[#181a2a]/90 p-8 rounded-xl shadow-2xl w-full max-w-md flex flex-col gap-6 border border-blue-900 relative">
        <button
          type="button"
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-400 transition-colors z-10"
          onClick={() => window.history.back()}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Upload Material</h2>
        <div className="text-gray-400 text-center text-sm font-semibold mb-2">
          Please make sure your Google Drive file is <span className="underline">publicly accessible</span> before uploading.
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Google Drive PDF URL</label>
          <input
            type="url"
            className="w-full px-3 py-2 rounded bg-[#23244a] text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
            value={driveUrl}
            onChange={e => setDriveUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">File Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded bg-[#23244a] text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Enter file name"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-400 text-center font-semibold">{error}</div>}
        {success && <div className="text-green-400 text-center font-semibold">{success}</div>}
        <div className="flex gap-8 justify-between mt-4">
          <button
            type="button"
            className="bg-transparent border border-gray-400 text-gray-200 font-semibold py-2 px-6 rounded hover:bg-gray-700/40 transition-all duration-150"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded transition-all duration-150 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MaterialUpload;
