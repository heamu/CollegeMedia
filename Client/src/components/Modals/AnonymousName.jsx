import { useState } from 'react';
import axios from '../../utils/api';

function AnonymousName({ user, initialAnonymousName = '', onSave, onClose }) {
    const [anonName, setAnonName] = useState(initialAnonymousName);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        // Prevent spaces at start, only allow after 'Anonymous '
        let value = e.target.value.replace(/^\s+/, '');
        // Disallow special chars if needed (optional)
        setAnonName(value);
        setError('');
    };

    const handleSave = async () => {
        if (!anonName.trim()) {
            setError('Name cannot be empty.');
            return;
        }
        if (anonName.length > 24) {
            setError('Name must be under 24 characters.');
            return;
        }
        setLoading(true);
        try {
            await axios.patch('/user/editAnonymousName', { anonymousName: anonName.trim() });
            setEditing(false);
            if (onSave) onSave(anonName.trim());
            // Update the user object's anonymousName after successful save
            if (user) user.anonymousName = anonName.trim();
        } catch {
            setError('Failed to update anonymous name.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.0)' }}>
            <div className="bg-[#181a2a] rounded-xl shadow-lg p-8 w-full max-w-md relative">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl" onClick={onClose}>&times;</button>
                <div className="flex flex-col items-center gap-3 mb-6">
                    <img
                        src={user.profileImage || '/default-avatar.png'}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover border border-gray-700"
                    />
                    <div className="text-lg font-semibold text-white">{user.name}</div>
                </div>
                <div className="mb-4 w-full">
                    <label className="block text-gray-300 mb-1 font-medium">Anonymous Name</label>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-semibold">Anonymous</span>
                        {editing ? (
                            <input
                                className="flex-1 px-2 py-1 rounded bg-[#23244a] text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={anonName}
                                onChange={handleInputChange}
                                maxLength={24}
                                autoFocus
                                disabled={loading}
                            />
                        ) : (
                            <span className="text-white font-medium">{anonName || <span className="italic text-gray-500">(not set)</span>}</span>
                        )}
                        <button
                            className="ml-2 px-2 py-1 text-blue-400 hover:text-blue-600 border border-blue-700 rounded"
                            onClick={() => {
                                if (!editing) setEditing(true);
                                else {
                                    setEditing(false);
                                    setAnonName(initialAnonymousName);
                                    setError('');
                                }
                            }}
                            disabled={loading}
                        >
                            {editing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>
                    {error && <div className="text-red-400 text-sm mt-1">{error}</div>}
                </div>
                {editing && (
                    <button
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow disabled:opacity-60"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                )}
                <div className="mt-6 text-xs text-gray-400 bg-[#23244a] rounded p-3">
                    <div className="mb-1 font-semibold text-blue-300">Guidelines:</div>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Name must be appropriate and respectful.</li>
                        <li>Name should not reflect or impersonate any other user.</li>
                        <li>Your anonymous name will always start with <span className="font-bold text-white">Anonymous</span> and a space.</li>
                        <li>Maximum 24 characters (excluding the prefix).</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AnonymousName;
