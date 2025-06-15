import React, { useState } from "react";
import BackIcon from '../assets/Back.svg';
import AnonymousIcon from '../assets/Anonymous.svg';
import LinkIcon from '../assets/hacker.svg';
import LoadingSpinner from '../assets/Loading.svg';
import EditIcon from '../assets/Edit.svg';
import { useAuth } from '../context/useAuth';
import AnonymousName from './Modals/AnonymousName';
import { ChatProvider } from '../context/chatContext';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '../assets/Home.svg';
import ChatsIcon from '../assets/Chats.svg';

function ChatsSideBar() {
  const { user } = useAuth();
  const [showAnonModal, setShowAnonModal] = useState(false);
  const {
    chatType, setChatType,
    selectedUser, setSelectedUser,
    getCurrentUsers,
    isUsersLoading
  } = ChatProvider.useChat();
  const users = getCurrentUsers();
  const navigate = useNavigate();

  // Icon highlight logic
  const iconClasses = (type) =>
    `p-1 rounded hover:bg-blue-900 transition-colors ${chatType === type ? 'bg-blue-800' : ''}`;

  // Handler for switching chat type (resets selected user)
  const handleSetChatType = (type) => {
    if (type !== chatType) {
      setSelectedUser(null);
      setChatType(type);
    }
  };
  
  const handleSidebarAction = (action) => {
    if (action === 'home') navigate('/');
    else if (action === 'chats') handleSetChatType('common');
    else if (action === 'anon_sent') handleSetChatType('anon_sent');
    else if (action === 'anon_received') handleSetChatType('anon_received');
    else if (action === 'edit') setShowAnonModal(true);
  };

  return (
    <>
      {/* Floating Vertical Action Bar */}
      <div
        className="fixed top-8 left-4 flex flex-col items-center py-6 px-3 gap-6 bg-[#0C0C2E] border-2 border-blue-600 rounded-2xl shadow-2xl z-50"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', minWidth: '4.5rem' }}
      >
        <button onClick={() => handleSidebarAction('home')} className="p-3 rounded hover:bg-blue-900" aria-label="Home">
          <img src={HomeIcon} alt="Home" className="w-8 h-8" />
        </button>
        <button onClick={() => handleSidebarAction('chats')} className="p-3 rounded hover:bg-blue-900" aria-label="Chats">
          <img src={ChatsIcon} alt="Chats" className="w-8 h-8" />
        </button>
        <button onClick={() => handleSidebarAction('anon_received')} className="p-3 rounded hover:bg-blue-900" aria-label="Anonymous Received">
          <img src={LinkIcon} alt="Anonymous Received" className="w-8 h-8" />
        </button>
        <button onClick={() => handleSidebarAction('anon_sent')} className="p-3 rounded hover:bg-blue-900" aria-label="Anonymous Sent">
          <img src={AnonymousIcon} alt="Anonymous Sent" className="w-8 h-8" />
        </button>
        <button onClick={() => handleSidebarAction('edit')} className="p-3 rounded hover:bg-blue-900" aria-label="Edit">
          <img src={EditIcon} alt="Edit" className="w-8 h-8" />
        </button>
      </div>
      
      {showAnonModal && (
        <AnonymousName
          user={user}
          initialAnonymousName={user.anonymousName || ''}
          onSave={() => setShowAnonModal(false)}
          onClose={() => setShowAnonModal(false)}
        />
      )}
      <div className="min-w-[21rem] max-w-sm bg-[#0C0C2E] border-r-2 border-blue-600 flex flex-col h-full">
        {/* Header with back button at top, label and icons at bottom */}
        <div className="flex flex-col justify-between border-b border-blue-800 bg-[rgba(0,27,162,0.5)]" style={{height: '4.8rem'}}>
          {/* Top: Back or Home button */}
          <div className="flex-none h-8 flex items-start">
            {chatType !== 'common' ? (
              <button
                className="p-1 rounded hover:bg-blue-900 transition-colors z-10 mt-1 ml-1"
                onClick={() => handleSetChatType('common')}
              >
                <img src={BackIcon} alt="Back" className="w-4 h-4" />
              </button>
            ) : (
              <button
                className="p-1 rounded hover:bg-blue-900 transition-colors z-10 mt-1 ml-1"
                onClick={() => navigate('/')}
                aria-label="Home"
              >
                <img src={HomeIcon} alt="Home" className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Bottom: Label and nav icons */}
          <div className="flex items-center gap-3 pb-2 pl-2">
            <span className="text-white text-xl font-extrabold tracking-wide ml-2 drop-shadow-sm select-none" style={{letterSpacing: '0.04em'}}>{chatType === 'anon_sent' ? 'Anon Sent' : chatType === 'anon_received' ? 'Anon Receive' : 'Chats'}</span>
            <div className="flex-1" />
            {/* Nav icons: LinkIcon = anon_received, AnonymousIcon = anon_sent, EditIcon at the end */}
            <button className={iconClasses('anon_received')} onClick={() => handleSetChatType('anon_received')} title="Anonymous Received">
              <img src={LinkIcon} alt="Anon Receive" className="w-7 h-7" />
            </button>
            <button className={iconClasses('anon_sent')} onClick={() => handleSetChatType('anon_sent')} title="Anonymous Sent">
              <img src={AnonymousIcon} alt="Anon Sent" className="w-7 h-7" />
            </button>
            <button className="p-1 rounded hover:bg-blue-900 transition-colors" title="Edit Anonymous Name" onClick={() => setShowAnonModal(true)}>
              <img src={EditIcon} alt="Edit" className="w-7 h-7" />
            </button>
          </div>
        </div>
        
        {/* User list */}
        <div className="flex-1 overflow-y-auto py-2">
          {isUsersLoading ? (
            <div className="flex flex-col items-center justify-center h-40 text-blue-400">
              <img src={LoadingSpinner} alt="Loading" className="w-8 h-8 animate-spin mb-2" />
              <span>Loading users...</span>
            </div>
          ) : users && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-blue-300">
              <svg className="w-14 h-14 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-30" />
                <path d="M8 15h8M9 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-60" />
              </svg>
              <span className="text-lg font-semibold">No users found</span>
              <span className="text-sm text-blue-200 mt-1">Try switching chat type or check back later.</span>
            </div>
          ) : (
            users.map((user, idx) => (
              <div
                key={user._id || user.id || idx}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-950 transition-colors ${selectedUser && selectedUser._id === user._id ? 'bg-blue-950' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative">
                  <img
                    src={
                      chatType === 'anon_received' || chatType === 'anon_received'
                        ? '/hackerProfile.jpg'
                        : user.avatar || user.profileImage || '/default-avatar.png'
                    }
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-700"
                  />
                </div>
                <span className="text-white font-medium">
                  {chatType === 'anon_received' || chatType === 'anon_received'
                    ? `Anonymous - ${user.name}`
                    : user.name}
                </span>
                <div className="flex-1" />
                {user.notificationCount > 0 && (
                  <span className="ml-2 min-w-[1.1rem] h-5 px-1 bg-green-500 border-2 border-[#0C0C2E] rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {user.notificationCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ChatsSideBar;