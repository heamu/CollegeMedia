import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import PostsThread from "../components/PostsThread";

function HomeLayOut() {
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