import ProfileTags from "./ProfileTags";
import Image from "./Image";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import ChatContext from '../context/chatContext';
import api from '../utils/api';

function OtherProfileDetails({user}) {
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(user);
  const navigate = useNavigate();
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [pendingChatNav, setPendingChatNav] = useState(null);
  const chat = useContext(ChatContext);

  // Add effect to navigate only when user is present in the list and selected
  useEffect(() => {
    if (
      pendingChatNav &&
      chat.chatType === pendingChatNav.chatType &&
      chat.selectedUser &&
      chat.selectedUser._id === pendingChatNav.userId &&
      chat.getCurrentUsers().some(u => u._id === pendingChatNav.userId)
    ) {
      navigate('/chats');
      setPendingChatNav(null);
    }
  }, [pendingChatNav, chat, navigate]);

  // If user is not loaded yet, show nothing or a loading state
  if (!user) {
    return <div className="text-center text-gray-400">Loading profile...</div>;
  }

  //console.log(profileUser);

  // Safely handle missing user or properties
  function getArrayLength(arr) {
    return Array.isArray(arr) ? arr.length : 0;
  }

  const stats = {
    asks: getArrayLength(profileUser.questions),
    answers: getArrayLength(profileUser.answers),
    upvotes: typeof profileUser.upvotes === 'number' ? profileUser.upvotes : getArrayLength(profileUser.upvotes),
  };
  stats.points = stats.answers * 5 + stats.asks * 10 + stats.upvotes * 1;
  const TagsList = profileUser.tags || [];
  const imageUrl = profileUser.profileImage && profileUser.profileImage.trim() !== "" ? profileUser.profileImage : "/default-avatar.png";

  function isGoogleImage(url) {
    return url && url.startsWith("https://lh3.googleusercontent.com/");
  }

  function handleMakeModerator(userId) {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/moderation/add-moderator/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(() => {
        setProfileUser(prev => ({ ...prev, isContentModerator: true }));
      })
      .catch(() => alert('Failed to make moderator'));
  }

  // Handler for normal chat button
  const handleChatNormally = async () => {
    setShowChatOptions(false);
    const userList = chat.getCurrentUsers();
    const alreadyPresent = userList.some(u => u._id === profileUser._id);
    if (!alreadyPresent) {
      try {
        await api.post('/messages/add-user-to-chat-list', {
          userIdToAdd: profileUser._id,
          chatType: 'commonChats',
        });
      } catch {
        // Optionally handle error
      }
    }
    chat.setChatType('common');
    chat.setSelectedUser({
      _id: profileUser._id,
      name: profileUser.name,
      profileImage: profileUser.profileImage
    });
    navigate('/chats');
  };

  // Handler for anonymous chat button
  const handleChatAnonymously = async () => {
    setShowChatOptions(false);
    const userList = chat.getCurrentUsers();
    const alreadyPresent = userList.some(u => u._id === profileUser._id);
    if (!alreadyPresent) {
      try {
        await api.post('/messages/add-user-to-chat-list', {
          userIdToAdd: profileUser._id,
          chatType: 'anonymousSentChats',
        });
      } catch {
        // Optionally handle error
      }
    }
    chat.setChatType('anon_sent');
    chat.setSelectedUser({
      _id: profileUser._id,
      name: profileUser.name,
      profileImage: profileUser.profileImage
    });
    navigate('/chats');
  };

  return (
    <div className="pt-10">
      <div className="flex flex-col sm:flex-row gap-8 relative" style={{overflow: 'visible'}}>
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
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-4">
                <span>{profileUser.name}</span>
                {profileUser.isAdmin && (
                  <span className="text-xs text-blue-400 font-semibold align-middle">admin</span>
                )}
                {!profileUser.isAdmin && profileUser.isContentModerator && (
                  <span className="text-xs text-blue-400 font-semibold align-middle">moderator</span>
                )}
              </h1>
              <p className="text-sm text-gray-400">{profileUser.bio}</p>
            </div>
            <div className="flex flex-col gap-2 mt-4 sm:mt-0">
              {/* Chat button(s) */}
              <div className="relative z-50" style={{overflow: 'visible'}}>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow font-semibold transition-all duration-150 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => setShowChatOptions((v) => !v)}
                >
                  Chat
                </button>
                {showChatOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#181a2a] border border-blue-700 rounded shadow-lg flex flex-col"
                    style={{ top: '100%', left: 'auto', right: 0, zIndex: 9999, minWidth: '12rem', overflow: 'visible' }}
                  >
                    <button
                      className="px-4 py-2 hover:bg-blue-900 text-left text-white"
                      onClick={handleChatNormally}
                    >
                      Chat Normally
                    </button>
                    <button
                      className="px-4 py-2 hover:bg-blue-900 text-left text-white"
                      onClick={handleChatAnonymously}
                    >
                      Chat Anonymously
                    </button>
                  </div>
                )}
              </div>
              {/* Show Make Moderator button only to admin and if user is not already a moderator or admin */}
              {currentUser?.isAdmin && !profileUser.isAdmin && !profileUser.isContentModerator && (
                <button
                  className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-1 rounded shadow font-semibold transition-all duration-150 mt-2 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={() => handleMakeModerator(profileUser._id)}
                >
                  <span className="inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Make Moderator
                  </span>
                </button>
              )}
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
        </div>
      </div>

      {/* Tabs */}
      
    </div>
  );
}

export default OtherProfileDetails;