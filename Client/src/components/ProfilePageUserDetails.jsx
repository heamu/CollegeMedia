import { useNavigate } from "react-router-dom";
import ProfileTags from "./ProfileTags";
import { useAuth } from "../context/useAuth";
import Image from "./Image";
import LoadingSpinner from '../assets/Loading.svg';
import Failed from './Failed';

function ProfilePageUserDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is not loaded yet, show nothing or a loading state
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full text-blue-300">
        <img src={LoadingSpinner} alt="Loading" className="w-16 h-16 mb-4 animate-spin" />
        <span className="text-xl font-semibold">Loading profile...</span>
      </div>
    );
  }

  // Safely handle missing user or properties
  function getArrayLength(arr) {
    return Array.isArray(arr) ? arr.length : 0;
  }

  const stats = {
    asks: getArrayLength(user.questions),
    answers: getArrayLength(user.answers),
    upvotes: typeof user.upvotes === 'number' ? user.upvotes : getArrayLength(user.upvotes),
  };
  stats.points = stats.answers * 5 + stats.asks * 10 + stats.upvotes * 1;
  const TagsList = user.tags || [];
  const imageUrl = user.profileImage && user.profileImage.trim() !== "" ? user.profileImage : "/default-avatar.png";

  function isGoogleImage(url) {
    return url && url.startsWith("https://lh3.googleusercontent.com/");
  }

  function handleEdit() {
    navigate('edit');
  }

  return (
    <div className="pt-10">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Profile image */}
        <div className="flex justify-center items-center">
          {isGoogleImage(imageUrl) || imageUrl.startsWith("/default-avatar") ? (
            <img
              src={imageUrl}
              alt="Profile"
              onError={e => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
              className="rounded-full object-cover bg-black w-32 h-32 sm:w-40 sm:h-40 border-2 border-gray-700"
              width={128}
              height={128}
            />
          ) : (
            <Image
              src={imageUrl}
              alt="Profile"
              w={128}
              h={128}
              className="rounded-full object-cover bg-black w-32 h-32 sm:w-40 sm:h-40 border-2 border-gray-700"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-8">
                <span>{user.name}</span>
                {user.isAdmin && (
                  <span className="text-xs text-blue-400 font-semibold align-middle">admin</span>
                )}
                {!user.isAdmin && user.isContentModerator && (
                  <span className="text-xs text-blue-400 font-semibold align-middle">moderator</span>
                )}
              </h1>
              <p className="text-sm text-gray-400">{user.bio}</p>
              {/* Role badges */}
            </div>
            <div className="flex flex-col gap-2 mt-4 sm:mt-0">
              <button onClick={handleEdit} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded shadow font-semibold border border-blue-900 transition-all duration-150">
                Edit
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex gap-6 mt-4 text-sm text-gray-300">
            <div><span className="font-semibold text-white">Asks:</span> {stats.asks}</div>
            <div><span className="font-semibold text-white">Answers:</span> {stats.answers}</div>
            <div><span className="font-semibold text-white">Upvotes:</span> {stats.upvotes}</div>
            <div><span className="font-semibold text-yellow-400">Points:</span> {stats.points}</div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mt-6">
            {TagsList.map((tag, i) => (
              <ProfileTags key={i} TagName={tag} />
            ))}
          </div>
          {/* Upload Button - just below tags */}
          <div className="flex w-full justify-end mt-4">
            <button
              onClick={() => navigate('upload')}
              className="px-4 py-1 rounded-md border border-white text-white font-semibold text-base bg-transparent hover:bg-white/10 hover:backdrop-blur-md transition-all duration-200 shadow group"
              style={{backdropFilter: 'blur(2px)'}}
            >
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      
    </div>
  );
}

export default ProfilePageUserDetails;