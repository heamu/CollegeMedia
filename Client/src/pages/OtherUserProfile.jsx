import ProfilePageUserDetails from "../components/ProfilePageUserDetails";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import OtherProfileDetails from "../components/OtherProfileDetails";
import Failed from '../components/Failed';
import LoadingSpinner from '../assets/Loading.svg';

function OtherUserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    axios
      .get(`${baseUrl}/user/${userId}/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        setOtherUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user profile");
        setLoading(false);
      });
  }, [userId]);

  function handleAsks() {
    navigate("asks");
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full text-blue-300">
        <img src={LoadingSpinner} alt="Loading" className="w-10 h-10 mb-4 animate-spin" />
        <span className="text-xl font-semibold">Loading profile...</span>
      </div>
    );
  if (error)
    return <Failed message="Failed to load user profile" subMessage="Try reloading the page." />;
  if (!otherUser) return null;

  //console.log("it is form Other User Profile");
  //console.log(userId);

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
       <OtherProfileDetails user = {otherUser} />
      <div className="mt-5 border-b border-gray-600 text-gray-300 flex text-sm sm:text-base relative">
        {/* Tabs */}
        <div className="flex w-full z-10">
          <button
            onClick={handleAsks}
            className={`w-1/3 pb-2 h-12 border-b-2 text-center transition-all duration-200 ${
              location.pathname.endsWith("/asks")
                ? "border-white bg-white/10 text-white font-semibold"
                : "border-transparent hover:border-white hover:bg-white/10"
            }`}
          >
            Asks
          </button>
          <button
            onClick={() => navigate("discussions")}
            className={`w-1/3 pb-2 h-12 border-b-2 text-center transition-all duration-200 ${
              location.pathname.endsWith("/discussions")
                ? "border-white bg-white/10 text-white font-semibold"
                : "border-transparent hover:border-white hover:bg-white/10"
            }`}
          >
            Discussions
          </button>
          <button
            onClick={() => navigate("materials")}
            className={`w-1/3 pb-2 h-12 border-b-2 text-center transition-all duration-200 ${
              location.pathname.endsWith("/materials")
                ? "border-white bg-white/10 text-white font-semibold"
                : "border-transparent hover:border-white hover:bg-white/10"
            }`}
          >
            Materials
          </button>
        </div>
      </div>
      <Outlet context={{ user: otherUser, isSelf: false }} />
    </div>
  );
}

export default OtherUserProfile;