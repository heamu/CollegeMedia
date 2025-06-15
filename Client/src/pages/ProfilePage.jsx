import ProfilePageUserDetails from "../components/ProfilePageUserDetails";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {user} = useAuth();
  function handleAsks() {
    navigate("asks");
  }
  return (
    <div className="mx-auto min-h-screen w-[80%] px-2 relative">
      {/* Home Button */}
      <div className="w-full flex">
        <button
          className="bg-gray-700/60 hover:bg-gray-700/80 text-white px-3 py-1.5 rounded-lg shadow transition-colors z-20 mt-4 mb-2 ml-0"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
      <ProfilePageUserDetails />
      <div className="mt-5 border-b border-gray-600 text-gray-300 flex text-sm sm:text-base relative">
        {/* Tabs */}
        <div className="flex w-full z-10">
          <button
            onClick={handleAsks}
            className={`w-1/3 pb-2 h-12 border-b-2 text-center transition-all duration-200 ${location.pathname.endsWith('/asks') ? 'border-white bg-white/10 text-white font-semibold' : 'border-transparent hover:border-white hover:bg-white/10'}`}
          >
            Asks
          </button>
          <button
            onClick={() => navigate('discussions')}
            className={`w-1/3 pb-2 h-12 border-b-2 text-center transition-all duration-200 ${location.pathname.endsWith('/discussions') ? 'border-white bg-white/10 text-white font-semibold' : 'border-transparent hover:border-white hover:bg-white/10'}`}
          >
            Discussions
          </button>
          <button
            onClick={() => navigate('materials')}
            className={`w-1/3 pb-2 h-12 border-b-2 text-center transition-all duration-200 ${location.pathname.endsWith('/materials') ? 'border-white bg-white/10 text-white font-semibold' : 'border-transparent hover:border-white hover:bg-white/10'}`}
          >
            Materials
          </button>
        </div>
      </div>
      <Outlet context={{ user: user, isSelf: true }}  />
    </div>
  );
}

export default ProfilePage;