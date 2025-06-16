import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import PostsThread from "../components/PostsThread";
import { useContext, useEffect } from "react";
import ChatContext from "../context/chatContext";
import api from "../utils/api";

function HomeLayOut() {
  const { setAllUsers } = useContext(ChatContext);

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const res = await api.get('/messages/all-chat-users');
        setAllUsers({
          commonUsers: res.data.commonUsers || [],
          anonymousSentUsers: res.data.anonymousSentUsers || [],
          anonymousReceivedUsers: res.data.anonymousReceivedUsers || [],
        });
      } catch {
        setAllUsers({ commonUsers: [], anonymousSentUsers: [], anonymousReceivedUsers: [] });
      }
    }
    fetchAllUsers();
  }, [setAllUsers]);

  return (
    <div className="h-screen w-screen overflow-x-hidden">
      {/* NavBar with z-40 */}
      <NavBar />

      <div className="flex h-full w-screen">
        {/* Sidebar */}
        <div className="w-[20vw] border-r-[1px]">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="w-[80vw] bg-black h-full">
          <PostsThread />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default HomeLayOut;