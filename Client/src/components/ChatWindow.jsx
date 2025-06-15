import AttatchIcon from "../assets/Attatch.svg";
import AnonymousIcon from "../assets/Anonymous.svg";
import SingleTick from '../assets/SingleTick.svg';
import DoubleTick from '../assets/DoubleTick.svg';
import DoubleGreenTick from '../assets/DoubleGreenTick.svg';
import SendIcon from '../assets/Send.svg';
import MessageBg from '../assets/MessageBg.svg';
import { useRef, useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/useAuth';
import ErrorModal from './ErrorModal';

function ChatWindow({ chatType, selectedUser, messages, setMessages }) {
  const [input, setInput] = useState("");
  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const [showError, setShowError] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // If no user is selected, show a placeholder
  if (!selectedUser) {
    return (
      <div className="flex flex-col h-full min-h-0 w-full items-center justify-center bg-gradient-to-br from-[#0D0B41] to-black rounded-xl border-2 border-blue-700 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" className="w-20 h-20 text-blue-500">
            <path stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M24 6C13.506 6 5 13.506 5 22.5c0 3.97 2.13 7.57 5.67 10.13-.23.97-.82 3.13-1.01 3.91-.15.6.43 1.09 1 .87.98-.36 3.13-1.16 4.13-1.54C17.7 36.62 20.77 37.5 24 37.5c10.494 0 19-7.506 19-16.5S34.494 6 24 6Z" />
          </svg>
          <div className="text-2xl font-semibold text-blue-200 drop-shadow-lg">Select a user to start chatting</div>
          <div className="text-base text-blue-400">Choose a contact from the list to view your conversation.</div>
        </div>
      </div>
    );
  }

  const user = selectedUser;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !selectedUser) return;
    // Optimistically add message
    const newMsg = {
      text: trimmed,
      fromMe: true,
      status: 'sent',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    try {
      const res = await api.post('/messages/send-message', {
        receiverId: selectedUser._id,
        text: trimmed,
        type: (chatType === 'anon_sent') ? 'anon_sent' : (chatType === 'anon_received' || chatType === 'anon_received') ? 'anon_received' : 'common',
      });
      if (res && res.data) {
        const saved = res.data;
        setMessages((prev) => {
          // Replace the optimistic message with the real one (optional: match by text)
          const idx = prev.findIndex(m => m === newMsg);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { ...saved, fromMe: true };
            return updated;
          }
          return [...prev, { ...saved, fromMe: true }];
        });
      }
    } catch {
      setShowError(true);
    }
  };
  console.log(messages);

  return (
    <>
      <ErrorModal open={showError} onClose={() => setShowError(false)} message="An error occurred. Try reloading the page." />
      <div className="flex flex-col h-full min-h-0 w-full">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4  bg-[#0D0B41] rounded-tr-xl">
          <img
            src={
              chatType === 'anon_received' || chatType === 'anon_received'
                ? '/hackerProfile.jpg'
                : user.profileImage || "/default-avatar.png"
            }
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-700"
          />
          <div className="font-semibold text-white text-lg">
            {chatType === 'anon_received' || chatType === 'anon_received'
              ? `Anonymous - ${user.name}`
              : user.name}
          </div>
        </div>
        {/* Messages area */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            maxHeight: "100%",
            overflowY: "auto",
          }}
          className="py-2 flex flex-col gap-2 bg-[#000000] relative"
        >
          {/* Background SVG (fixed, not scrolling) */}
          {chatType === 'common' ? (
            <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0">
              <img 
                src={MessageBg} 
                alt="MessageBg" 
                className="w-72 h-72 opacity-30"
                draggable="false"
              />
            </div>
          ) : (
            <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0">
              <img 
                src={AnonymousIcon} 
                alt="Anonymous" 
                className="w-72 h-72 opacity-30"
                draggable="false"
              />
            </div>
          )}
          {/* Messages */}
          <div className="relative z-10 flex flex-col gap-2">
            {messages.map((msg, idx) => {
              const fromMe = msg.fromMe !== undefined
                ? msg.fromMe
                : (msg.senderId === currentUser._id || (msg.senderId && msg.senderId._id === currentUser._id));
              return (
                <div
                  key={idx}
                  className={`w-full flex ${fromMe ? "justify-end" : "justify-start"}`}
                  style={{overflow: 'visible'}}
                >
                  <div
                    className={`rounded-lg px-2 py-1 text-base font-medium break-words shadow-md ${
                      fromMe
                        ? "bg-blue-600 text-white mr-4"
                        : "bg-[#23244a] text-white ml-4"
                    }`}
                    style={{
                      maxWidth: '70%',
                      minWidth: 90,
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-line',
                      overflowWrap: 'break-word',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      gap: 4,
                    }}
                  >
                    <span style={{flex: 1, minWidth: 0, wordBreak: 'break-word'}}>{msg.text}</span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        color: '#d1d5db',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        marginLeft: 4,
                      }}
                    >
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      {fromMe && (
                        <>
                          {msg.status === 'sent' && (
                            <img src={SingleTick} alt="Sent" style={{width: 16, height: 16, marginLeft: 2, display: 'inline-block'}} />
                          )}
                          {msg.status === 'delivered' && (
                            <img src={DoubleTick} alt="Delivered" style={{width: 16, height: 16, marginLeft: 2, display: 'inline-block'}} />
                          )}
                          {msg.status === 'read' && (
                            <img src={DoubleGreenTick} alt="read" style={{width: 16, height: 16, marginLeft: 2, display: 'inline-block'}} />
                          )}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Message input */}
        <form className="flex items-center gap-3 px-6 py-4 border-t border-blue-900  bg-[#000000] rounded-b-xl" onSubmit={handleSendMessage}>
          <button
            type="button"
            className="p-2 rounded hover:bg-blue-900 transition-colors"
          >
            <img src={AttatchIcon} alt="Attach" className="w-5 h-5" />
          </button>
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-full bg-[#23244a] text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Type a message . . . ."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            type="submit"
            className="text-blue-600 px-6 py-2 rounded-full font-semibold transition-colors hover:bg-white/60 hover:text-blue-600"
            style={{background: 'transparent', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)'}}
          >
            <img src={SendIcon} alt="Send" className="w-6 h-6" />
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatWindow;
