import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext.js";
import { io } from 'socket.io-client';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${baseUrl}/auth/me`, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [baseUrl]);

  useEffect(() => {
    if (user && user._id) {
      // If the same user is already connected, do nothing
      if (socketRef.current?.connected && socketRef.current?.auth?.userId === user._id) {
        return;
      }

      // Disconnect existing socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      const newSocket = io(baseUrl, {
        query: { userId: user._id },
        transports: ['websocket'],
        withCredentials: true
      });

      newSocket.on('connect', () => {
        // console.log('[Socket] Connected:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        // console.log('[Socket] Disconnected:', reason);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        socketRef.current = null;
        setSocket(null);
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
    }
  }, [user, baseUrl]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, socket }}>
      {children}
    </AuthContext.Provider>
  );
};



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { AuthContext } from "./AuthContext.js";
// import { io } from 'socket.io-client';

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [socket, setSocket] = useState(null);
//   const baseUrl = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     axios.get(`${baseUrl}/auth/me`, { withCredentials: true })
//       .then(res => setUser(res.data))
//       .catch(() => setUser(null))
//       .finally(() => setLoading(false));
//   }, [baseUrl]);

//   // Ensure websocket connection is always present when user is logged in
//   useEffect(() => {
//     if (user && user._id) {
//       // If already connected to the correct user, do nothing
//       if (socket && socket.connected && socket.auth?.userId === user._id) {
//         //console.log("you are connected :",socket);return;
//       }
//       // Disconnect any existing socket
//       if (socket) {
//         socket.disconnect();
//         setSocket(null);
//       }
//       // Establish new websocket connection
//       const sock = io(baseUrl, {
//         query: { userId: user._id },
//         withCredentials: true
//       });
//       sock.on('connect', () => {
//         //console.log('[Socket] Connected:', sock.id);
//       });
//       sock.on('disconnect', () => {
//         //console.log('[Socket] Disconnected:', sock.id, 'Reason:', reason);
//       });
      
//       setSocket(sock);
//       return () => {
//         sock.disconnect();
//         setSocket(null);
//       };
//     } else if (socket) {
//       // If user logs out, disconnect socket
//       socket.disconnect();
//       setSocket(null);
//     }
    
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, baseUrl]);

//   if (loading) {
//     // You can replace this with a better spinner if you want
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   }

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, socket }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };





