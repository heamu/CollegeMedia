import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Image from "../../components/Image"; // Import the Image component

const baseUrl = import.meta.env.VITE_BACKEND_URL;

function ModerateModel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState("pending"); // 'pending' or 'moderators'
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moderators, setModerators] = useState([]);
  const [modLoading, setModLoading] = useState(false);
  const [modError, setModError] = useState("");
  const [pendingError, setPendingError] = useState("");

  // Fetch pending questions
  const fetchPendingQuestions = async () => {
    setLoading(true);
    setPendingError("");
    try {
      const res = await axios.get(`${baseUrl}/moderation/pending`, { withCredentials: true });
      setPendingQuestions(res.data.questions || []);
    } catch (err) {
      setPendingError("Failed to load pending questions",err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch moderators (admin only)
  const fetchModerators = async () => {
    setModLoading(true);
    setModError("");
    try {
      const res = await axios.get(`${baseUrl}/moderation/moderators`, { withCredentials: true });
      setModerators(res.data.moderators || []);
    } catch (err) {
      setModError("Failed to load moderators",err);
    } finally {
      setModLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "pending") fetchPendingQuestions();
    if (tab === "moderators" && user?.isAdmin) fetchModerators();
    // eslint-disable-next-line
  }, [tab]);

  // Approve question
  const handleApprove = async (questionId) => {
    try {
      await axios.patch(`${baseUrl}/moderation/approve/${questionId}`, {}, { withCredentials: true });
      setPendingQuestions((prev) => prev.filter((q) => q._id !== questionId));
    } catch {
      alert("Failed to approve question");
    }
  };

  // Delete question
  const handleDelete = async (questionId) => {
    try {
      await axios.delete(`${baseUrl}/moderation/reject/${questionId}`, { withCredentials: true });
      setPendingQuestions((prev) => prev.filter((q) => q._id !== questionId));
    } catch {
      alert("Failed to delete question");
    }
  };

  // Remove moderator (admin only)
  const handleRemoveModerator = async (userId) => {
    try {
      await axios.patch(`${baseUrl}/moderation/remove-moderator/${userId}`, {}, { withCredentials: true });
      setModerators((prev) => prev.filter((m) => m._id !== userId));
    } catch {
      alert("Failed to remove moderator");
    }
  };

  // Tab buttons logic
  const showModeratorsTab = user?.isAdmin;
  const showPendingTab = user?.isAdmin || user?.isContentModerator;

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-60">
      <div className="bg-black w-[90vw] max-w-2xl h-[80vh] rounded-lg shadow-lg p-0 overflow-hidden relative flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-2 right-3 text-white text-2xl hover:text-red-400 transition-colors z-10"
          onClick={() => navigate(-1)}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Top Tab Buttons */}
        <div className="flex w-full">
          {showPendingTab && (
            <button
              className={`flex-1 py-3 text-center text-lg font-semibold transition-colors ${tab === "pending" ? "bg-blue-700 text-white" : "bg-blue-950 text-blue-300"}`}
              onClick={() => setTab("pending")}
            >
              Pending Questions
            </button>
          )}
          {showModeratorsTab && (
            <button
              className={`flex-1 py-3 text-center text-lg font-semibold transition-colors ${tab === "moderators" ? "bg-blue-700 text-white" : "bg-blue-950 text-blue-300"}`}
              onClick={() => setTab("moderators")}
            >
              Moderators
            </button>
          )}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-black min-h-0">
          {tab === "pending" && (
            <div>
              {loading ? (
                <div className="text-center text-blue-400">Loading...</div>
              ) : pendingError ? (
                <div className="text-center text-red-400">{pendingError}</div>
              ) : pendingQuestions.length === 0 ? (
                <div className="text-center text-gray-400">No questions pending approval.</div>
              ) : (
                <div className="flex flex-col gap-6">
                  {pendingQuestions.map((q) => (
                    <div key={q._id} className="bg-black rounded-lg p-4 flex flex-col gap-2 border-2 border-blue-900">
                      {/* Only show the question body, not the title as a heading */}
                      <div className="text-gray-300 mb-2 font-bold">{q.body}</div>
                      {q.imageUrl && (
                        <Image src={q.imageUrl} alt="Question" className="max-h-48 max-w-full rounded-lg object-cover border border-gray-700" />
                      )}
                      <div className="flex gap-4 mt-2">
                        <button
                          className="flex-1 py-2 rounded font-semibold border border-gray-600 text-white transition-colors bg-transparent hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
                          onClick={() => handleApprove(q._id)}
                        >
                          Accept
                        </button>
                        <button
                          className="flex-1 py-2 rounded font-semibold border border-gray-600 text-white transition-colors bg-transparent hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white"
                          onClick={() => handleDelete(q._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === "moderators" && showModeratorsTab && (
            <div>
              {modLoading ? (
                <div className="text-center text-blue-400">Loading...</div>
              ) : modError ? (
                <div className="text-center text-red-400">{modError}</div>
              ) : moderators.length === 0 ? (
                <div className="text-center text-gray-400">No moderators found.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {moderators.map((mod) => (
                    <div key={mod._id} className="flex items-center justify-between bg-[#23244a]/80 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <Image src={mod.profileImage || '/default-avatar.png'} alt="Moderator" className="w-10 h-10 rounded-full object-cover border border-gray-700" />
                        <div className="text-white font-semibold">{mod.name}</div>
                        <div className="text-blue-400 text-xs ml-2">moderator</div>
                      </div>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm font-semibold"
                        onClick={() => handleRemoveModerator(mod._id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModerateModel;
