import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    async function handleChange(e) {
        const value = e.target.value;
        setQuery(value);
        if (!value.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/search?query=${encodeURIComponent(value)}`, { withCredentials: true });
            setResults(res.data.users || []);
            setShowDropdown(true);
        } catch {
            setResults([]);
            setShowDropdown(false);
        } finally {
            setLoading(false);
        }
    }

    function handleBlur() {
        // Delay hiding dropdown to allow click
        setTimeout(() => setShowDropdown(false), 150);
    }

    return (
        <div className="bg-gray-900 p-2 rounded-full flex w-85 h-10 items-center gap-2 relative">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="gray"
            >
                <circle cx="10.5" cy="10.5" r="7.5" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input
                type="text"
                placeholder="search users ..."
                className="bg-transparent focus:outline-none"
                value={query}
                onChange={handleChange}
                onFocus={() => { if (results.length) setShowDropdown(true); }}
                onBlur={handleBlur}
                autoComplete="off"
            />
            {showDropdown && results.length > 0 && (
                <div className="fixed left-1/2 -translate-x-1/2 top-16 w-[340px] bg-[#181a29] rounded-xl shadow-2xl z-[1000] max-h-64 overflow-y-auto border border-gray-800 backdrop-blur-md"
                    style={{ minWidth: 240, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)' }}
                >
                    {loading ? (
                        <div className="p-3 text-gray-400 text-center">Loading...</div>
                    ) : (
                        results.map(user => (
                            <div
                                key={user._id}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-[#23244a] cursor-pointer transition-colors"
                                onMouseDown={() => {
                                    if (currentUser && currentUser._id === user._id) {
                                        navigate('/profile');
                                    } else {
                                        navigate(`/profile/${user._id}`);
                                    }
                                }}
                            >
                                <img src={user.profileImage || '/default-avatar.png'} alt="avatar" className="w-7 h-7 rounded-full object-cover border border-gray-700" />
                                <span className="text-white font-medium">{user.name}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Search;
