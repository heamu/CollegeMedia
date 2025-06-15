import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const TAG_OPTIONS = [
  'CSE','ECE','Mechanical','Civil','EE','AI','GATE','Web Dev','Data Science','Internships','Placements','Robotics','DSA','ML',
  'DevOps', 'Blockchain', 'Android', 'Cloud', 'Cybersecurity', 'UI/UX', 'IOT', 'Quantum', 'AR/VR', 'Startups', 'Open Source', 'Competitive Coding', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Electronics', 'Automobile', 'Aerospace', 'Design', 'Product', 'Finance', 'Marketing', 'Entrepreneurship', 'Photography', 'Music', 'Art', 'Gaming', 'Sports', 'Yoga', 'Literature', 'Debate', 'Drama', 'Dance', 'Social Work', 'Travel', 'Cooking'
];

function SelectTags() {
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      alert('Please select at least one tag.');
      return;
    }
    const res = await axios.patch(
      `${baseUrl}/user/update-tags`,
      { tags: selectedTags },
      { withCredentials: true }
    );
    if (res.data && res.data.user) {
      setUser(res.data.user);
    }
    navigate('/'); // or your home route
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gradient-to-br from-blue-950 via-black to-gray-900">
      <div className="bg-black/80 rounded-2xl shadow-2xl p-8 w-full max-w-2xl flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Select Your Interests</h2>
        <p className="text-gray-400 mb-6 text-center text-sm">Choose the topics you want to follow. You can change these later in your profile.</p>
        <div className="w-full bg-gray-900/80 rounded-xl p-4 flex flex-wrap gap-3 justify-center max-h-80 overflow-y-auto border border-gray-700 mb-6">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 shadow-sm
                ${selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white border-blue-400 scale-105 shadow-blue-500/30'
                  : 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-blue-900 hover:text-white'}
              `}
            >
              {tag}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full font-semibold shadow-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedTags.length === 0}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default SelectTags;
