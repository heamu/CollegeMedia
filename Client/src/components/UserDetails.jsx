import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const defaultImageUrl = "https://c0.klipartz.com/pngpicture/831/88/gratis-png-perfil-de-usuario-iconos-de-la-computadora-interfaz-de-usuario-mistica-thumbnail.png";

function UserDetails({ user }) {
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();
  if (!user) return <div className="user flex items-center gap-2">Unknown User</div>;
  const imageUrl = user.profileImage || defaultImageUrl;
  const handleProfileClick = () => {
    if (loggedInUser && user._id === loggedInUser._id) {
      navigate("/profile");
    } else if (user._id) {
      navigate(`/profile/${user._id}`);
    }
  };
  return (
    <div
      className="user flex items-center cursor-pointer gap-2"
      onClick={handleProfileClick}
      title="View Profile"
    >
      <div className="profileimage ">
        <img src={imageUrl} alt="" className="rounded-full object-cover bg-black w-10 h-10" />
      </div>
      <div className="username text-md font-bold">@{user.name || "user"}</div>
    </div>
  );
}
export default UserDetails;
