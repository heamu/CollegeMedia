import axios from "axios";
import { useAuth } from "../context/useAuth";
//import defaultAvatar from '../assets/default-avatar.png';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

function LogoutPopover({ onClose }) {
  const { user } = useAuth();

  return (
    <div className="fixed right-5 top-[80px] bg-black p-5 rounded-xl shadow-2xl z-50 min-w-64 border border-gray-800">
      <div className="flex items-center gap-3 mb-5">
        <img
          src={(!user?.profileImage) ? "/default-avatar.png" : user.profileImage}
          onError={e => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border border-gray-700"
        />
        <div>
          <div className="font-semibold text-white">{user?.name}</div>
          <div className="text-sm text-gray-400">{user?.email}</div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="text-sm px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              await axios.post(`${baseUrl}/auth/logout`, {}, { withCredentials: true });
              window.location.href = "/authenticate";
            } catch (err) {
              console.error("Logout failed", err);
            }
          }}
          className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-800 transition-colors font-semibold shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default LogoutPopover;
