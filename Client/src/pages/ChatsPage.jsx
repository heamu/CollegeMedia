import { useEffect, useState, useContext } from 'react';
import ChatsSideBar from '../components/ChatsSideBar';
import ChatWindow from '../components/ChatWindow';
import axios from '../utils/api';
import { useAuth } from '../context/useAuth';
import AnonymousName from '../components/Modals/AnonymousName';
import ChatContext from '../context/chatContext';

function ChatsPage() {
    const { user } = useAuth();
    const { socket } = useAuth();
    const [wsDisconnected, setWsDisconnected] = useState(false);

    const {
        chatType, setChatType,
        selectedUser, setSelectedUser,
        messages, setMessages,
        allUsers, setAllUsers,
        isUsersLoading, setIsUsersLoading,
        showAnonModal, setShowAnonModal,
        getCurrentUsers
    } = useContext(ChatContext);

    // Detect websocket disconnects
    useEffect(() => {
        if (!socket) return;
        const handleDisconnect = () => setWsDisconnected(true);
        const handleConnect = () => setWsDisconnected(false);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect', handleConnect);
        if (socket.connected) setWsDisconnected(false);
        else setWsDisconnected(true);
        return () => {
            socket.off('disconnect', handleDisconnect);
            socket.off('connect', handleConnect);
        };
    }, [socket]);

    // Fetch all users once on mount
    useEffect(() => {
        async function fetchAllUsers() {
           // //console.log("hello i am frome the 1st use effect in chatsPage");
            setIsUsersLoading(true);
            try {
                const res = await axios.get('/messages/all-chat-users');                // Use backend-provided notificationCount for each user
                setAllUsers({
                    commonUsers: res.data.commonUsers || [],
                    anonymousSentUsers: res.data.anonymousSentUsers || [],
                    anonymousReceivedUsers: res.data.anonymousReceivedUsers || [],
                });
            } catch {
                setAllUsers({ commonUsers: [], anonymousSentUsers: [], anonymousReceivedUsers: [] });
            } finally {
                setIsUsersLoading(false);
            }
        }
        fetchAllUsers();
    }, [setAllUsers,setIsUsersLoading]);

    // Open modal if entering anonymous chat and user has no anonymous name
    useEffect(() => {
        if ((chatType === 'anon_sent') && user && (!user.anonymousName || user.anonymousName.trim() === '')) {
            setShowAnonModal(true);
        }
    }, [chatType, user, setShowAnonModal]);

    //Fetch messages when selectedUser or chatType changes
    useEffect(() => {
        async function fetchMessages() {
            if (!selectedUser) {
                setMessages([]);
                return;
            }
            try {
                // Map frontend chatType to backend enum
                let backendType = chatType;
                if (chatType === 'anon_sent') backendType = 'anon_sent';
                else if (chatType === 'anon_received' || chatType === 'anon_received') backendType = 'anon_received';
                else if (chatType === 'common') backendType = 'common';
                else backendType = chatType;
                const res = await axios.get('/messages/fetch-messages', {
                    params: {
                        userId: selectedUser._id,
                        chatType: backendType
                    }
                });
                //console.log("helloo from fetch");
                //console.log(res);
                setMessages(res.data);
                // Set notificationCount to 0 for this user in the current chat list
                setAllUsers(prev => {
                    const key =
                        chatType === 'common' ? 'commonUsers' :
                        chatType === 'anon_sent' ? 'anonymousSentUsers' :
                        chatType === 'anon_received' || chatType === 'anon_received' ? 'anonymousReceivedUsers' : null;
                    if (!key) return prev;
                    return {
                        ...prev,
                        [key]: prev[key].map(u =>
                            u._id === selectedUser._id ? { ...u, notificationCount: 0 } : u
                        )
                    };
                });
                
            } catch {
                //console.log("thrr is error")
                setMessages([]);
            }
        }
        fetchMessages();
    }, [selectedUser, chatType, setMessages, setAllUsers]);

   // Ensure selectedUser is valid for the current chatType
    useEffect(() => {
        const userList = getCurrentUsers();
        // If the selectedUser is set, but is not present in the current userList for the current chatType, clear it
        if (
            selectedUser &&
            chatType &&
            !userList.some(u => u._id === selectedUser._id)
        ) {
            setSelectedUser(null);
        }
    }, [chatType, allUsers, getCurrentUsers, setSelectedUser, selectedUser]);

    return (
        <>
            {showAnonModal && (
                <AnonymousName
                    user={user}
                    initialAnonymousName={user.anonymousName || ''}
                    onSave={() => setShowAnonModal(false)}
                    onClose={() => setShowAnonModal(false)}
                />
            )}
            <div className="fixed inset-0 w-full h-full bg-[#000000] flex items-center justify-center">
                <div className="flex flex-row h-full min-h-0 w-full max-w-5xl bg-[#000000] rounded-xl shadow-lg overflow-hidden border-2 border-blue-600">
                    {/* Sidebar: takes 1/3 of the width */}
                    <div className="flex-[1_1_0%] min-w-0 h-full">
                        <ChatsSideBar
      chatType={chatType}
      setChatType={setChatType}
      users={getCurrentUsers()}
      isUsersLoading={isUsersLoading}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
    />
                    </div>
                    {/* Chat window: takes 2/3 of the width */}
                    <div className="flex-[2_1_0%] min-w-0 h-full relative">
                        {wsDisconnected && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg flex items-center gap-4">
                            <span>Disconnected from chat server</span>
                            <button
                              className="bg-white text-red-600 font-bold px-3 py-1 rounded hover:bg-gray-200 transition"
                              onClick={() => {
                                if (!user) {
                                  window.location.reload();
                                } else {
                                  socket.connect();
                                }
                              }}
                            >Reconnect</button>
                          </div>
                        )}
                        <ChatWindow
                            chatType={chatType}
                            selectedUser={selectedUser}
                            messages={messages}
                            setMessages={setMessages}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatsPage;
