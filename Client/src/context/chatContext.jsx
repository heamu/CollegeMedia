import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext.js';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  // Global chat state
  const [chatType, setChatType] = useState('common'); // 'normal', 'anonymous-sent', 'anonymous-received'
  const [selectedUser, setSelectedUser] = useState(null); // The user object
  const [messages, setMessages] = useState([]); // Messages for the selected chat
  const [allUsers, setAllUsers] = useState({
    commonUsers: [],
    anonymousSentUsers: [],
    anonymousReceivedUsers: []
  });
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [showAnonModal, setShowAnonModal] = useState(false);
  const { socket, user } = useContext(AuthContext);

  // --- Unvisited Notification State ---
  const [commonUnvisited, setCommonUnvisited] = useState(0);
  const [anonSentUnvisited, setAnonSentUnvisited] = useState(0);
  const [anonRecieveUnvisited, setAnonRecieveUnvisited] = useState(0);
  const [totalUnvisited, setTotalUnvisited] = useState(0);

  // WebSocket event handlers
  useEffect(() => {
    if (!socket || !user) return;

    // Function to emit send_read_message for a message
    const sendReadMessage = (msg) => {
      if (!msg || !msg._id || !msg.senderId || !msg.receiverId || !msg.type) return;
      socket.emit('send_read_message', {
        messageId: msg._id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        chatType: msg.type
      });
    };

    // Helper to get the expected chatType for the current user based on the incoming message type
    const isRelevantChatType = (msgType, currentChatType) => {
      const normMsgType = normalizeChatType(msgType);
      const normCurrent = normalizeChatType(currentChatType);
      if (normMsgType === 'common' && normCurrent === 'common') return true;
      if (normMsgType === 'anon_sent' && normCurrent === 'anon_received') return true;
      if (normMsgType === 'anon_received' && normCurrent === 'anon_sent') return true;
      return false;
    };

    // Handle incoming messages
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => {
        if (
          selectedUser &&
          (
            (msg.senderId === selectedUser._id && msg.receiverId === user._id) ||
            (msg.senderId === user._id && msg.receiverId === selectedUser._id)
          ) &&
          isRelevantChatType(msg.type, chatType)
        ) {
          // If the message is from the selected user to me, mark as read
          if (msg.senderId === selectedUser._id && msg.receiverId === user._id) {
            sendReadMessage(msg);
          }
          return [...prev, msg];
        }
        return prev;
      });
      // Only increment notificationCount for the correct chatType
      if (
        (!selectedUser || msg.senderId !== selectedUser._id || !isRelevantChatType(msg.type, chatType))
      ) {
        setAllUsers((prev) => {
          let key = null;
          if (normalizeChatType(msg.type) === 'common') key = 'commonUsers';
          else if (normalizeChatType(msg.type) === 'anon_received') key = 'anonymousSentUsers';
          else if (normalizeChatType(msg.type) === 'anon_sent') key = 'anonymousReceivedUsers';
          if (!key) return prev;
          return {
            ...prev,
            [key]: prev[key].map((u) =>
              u._id === msg.senderId ? { ...u, notificationCount: (u.notificationCount || 0) + 1 } : u
            ),
          };
        });
      }
    };

    // Handle new chat user
    const handleNewChatUser = (newUser) => {
      // Add the new user to the correct chat list based on chatType
      if (newUser && newUser._id && newUser.chatType) {
        setAllUsers((prev) => {
          let key = null;
          const type = normalizeChatType(newUser.chatType);
          if (type === 'common') key = 'commonUsers';
          else if (type === 'anon_sent') key = 'anonymousReceivedUsers';
          else if (type === 'anon_received') key = 'anonymousSentUsers';
          if (!key) return prev;
          if (prev[key].some((u) => u._id === newUser._id)) return prev;
          return {
            ...prev,
            [key]: [newUser, ...prev[key]]
          };
        });
      }
    };

    // Handle messageRead event from server
    const handleMessageRead = ({ messageId, senderId, receiverId, chatType: readChatType }) => {
      // Only update if the read receipt is for the currently selected user and chat type
      if (
        selectedUser &&
        ((senderId === user._id && receiverId === selectedUser._id) ||
         (receiverId === user._id && senderId === selectedUser._id)) &&
        normalizeChatType(chatType) === normalizeChatType(readChatType)
      ) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, status: 'read' } : msg
          )
        );
      }
    };

    // Handle allMessagesReadInChat event from server
    const handleAllMessagesReadInChat = ({ readerId, chatType: readChatType }) => {
      // Only update if the currently selected user is the reader and chatType matches
      if (
        selectedUser &&
        selectedUser._id === readerId &&
        normalizeChatType(chatType) === normalizeChatType(readChatType)
      ) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.status !== 'read' ? { ...msg, status: 'read' } : msg
          )
        );
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('newChatUser', handleNewChatUser);
    socket.on('messageRead', handleMessageRead);
    socket.on('allMessagesReadInChat', handleAllMessagesReadInChat);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('newChatUser', handleNewChatUser);
      socket.off('messageRead', handleMessageRead);
      socket.off('allMessagesReadInChat', handleAllMessagesReadInChat);
    };
  }, [socket, user, selectedUser, chatType]);

  // Helper to get the current users list for the selected chatType
  const getCurrentUsers = () => {
    if (chatType === 'common') return allUsers.commonUsers;
    if (chatType === 'anon_sent') return allUsers.anonymousSentUsers;
    if (chatType === 'anon_received') return allUsers.anonymousReceivedUsers;
    return [];
  };

  // Helper to add a user to the correct chat list if not present
  const addUserToChatList = (type, userObj) => {
    setAllUsers(prev => {
      const key =
        type === 'common' ? 'commonUsers' :
        type === 'anon_sent' ? 'anonymousSentUsers' :
        type === 'anon_received' ? 'anonymousReceivedUsers' : null;
      if (!key) return prev;
      if (prev[key].some(u => u._id === userObj._id)) return prev;
      return {
        ...prev,
        [key]: [userObj, ...prev[key]]
      };
    });
  };

  // Helper to normalize chat type for comparison
  const normalizeChatType = (type) => {
    if (!type) return '';
    if (type === 'anon_received' || type === 'anon_recieve') return 'anon_received';
    if (type === 'anon_sent') return 'anon_sent';
    if (type === 'common') return 'common';
    return type;
  };

  // Helper to update all unvisited counts
  const updateTotalUnvisited = (c, aS, aR) => {
    setCommonUnvisited(c);
    setAnonSentUnvisited(aS);
    setAnonRecieveUnvisited(aR);
    setTotalUnvisited(c + aS + aR);
  };

  // When fetching users (e.g. in fetchAllUsers in ChatsPage), update unvisited counts
  useEffect(() => {
    const c = allUsers.commonUsers.reduce((sum, u) => sum + (u.notificationCount || 0), 0);
    const aS = allUsers.anonymousSentUsers.reduce((sum, u) => sum + (u.notificationCount || 0), 0);
    const aR = allUsers.anonymousReceivedUsers.reduce((sum, u) => sum + (u.notificationCount || 0), 0);
    updateTotalUnvisited(c, aS, aR);
  }, [allUsers]);

  // On receiveMessage, increment unvisited for the correct type if not currently viewing that type
  useEffect(() => {
    if (!socket || !user) return;
    const handleReceiveMessageUnvisited = (msg) => {
      const type = normalizeChatType(msg.type);
      if (type === 'common' && chatType !== 'common') {
        setCommonUnvisited((prev) => { const v = (prev || 0) + 1; setTotalUnvisited(v + anonSentUnvisited + anonRecieveUnvisited); return v; });
      } else if (type === 'anon_sent' && chatType !== 'anon_sent') {
        setAnonSentUnvisited((prev) => { const v = (prev || 0) + 1; setTotalUnvisited(commonUnvisited + v + anonRecieveUnvisited); return v; });
      } else if (type === 'anon_received' && chatType !== 'anon_received') {
        setAnonRecieveUnvisited((prev) => { const v = (prev || 0) + 1; setTotalUnvisited(commonUnvisited + anonSentUnvisited + v); return v; });
      }
    };
    socket.on('receiveMessage', handleReceiveMessageUnvisited);
    return () => { socket.off('receiveMessage', handleReceiveMessageUnvisited); };
  }, [socket, user, chatType, commonUnvisited, anonSentUnvisited, anonRecieveUnvisited]);

  // When switching to a chat type, clear its unvisited count
  const clearUnvisitedForType = (type) => {
    if (type === 'common') setCommonUnvisited(0);
    if (type === 'anon_sent') setAnonSentUnvisited(0);
    if (type === 'anon_received') setAnonRecieveUnvisited(0);
    setTotalUnvisited(
      (type === 'common' ? 0 : commonUnvisited) +
      (type === 'anon_sent' ? 0 : anonSentUnvisited) +
      (type === 'anon_received' ? 0 : anonRecieveUnvisited)
    );
  };

  const value = {
    chatType, setChatType,
    selectedUser, setSelectedUser,
    messages, setMessages,
    allUsers, setAllUsers,
    isUsersLoading, setIsUsersLoading,
    showAnonModal, setShowAnonModal,
    getCurrentUsers,
    addUserToChatList,
    commonUnvisited, anonSentUnvisited, anonRecieveUnvisited, totalUnvisited, clearUnvisitedForType
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

ChatProvider.useChat = function useChat() {
  return useContext(ChatContext);
};

export default ChatContext;
