// import Search from './Search'
// function NavBar() {
//     return (
//         <div className="w-screen flex justify-between h-18 z-50 sticky top-0 bg-black border-b-2 px-10 border-blue-500">
//             <div className="Logo cursor-pointer flex items-center gap-2 ">
//                 <div className="Logoimage">
//                     <img src="" alt="" className="rounded-full object-cover bg-white w-10 h-10"/>
//                 </div>
//                 <div className="LogoName text-xl text-blue-400 font-extrabold font-serif">
//                     College Media
//                 </div>
//             </div>
//             <div className="flex items-center">
//             <Search />
//             </div>
             
//             <div className="NavBarActions flex gap-18 font-bold items-center">
//                 <div className="cursor-pointer hover:bg-white/20 px-4 py-2 rounded transition-all duration-300 ease-in-out">Home</div>
//                 <div className="cursor-pointer hover:bg-white/20 px-4 py-2 rounded transition-all duration-300 ease-in-out">About</div>
//                 <div className="cursor-pointer hover:bg-white/20 px-4 py-2 rounded transition-all duration-300 ease-in-out text-blue-500 font-semibold">Logout</div>
//             </div>
//         </div>
//     )
// }

// export default NavBar
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from './Search';
import LogoutPopover from './LogoutPopover';
import Logo from '../assets/Logo.png'
function NavBar() {
  const [showLogout, setShowLogout] = useState(false);
  const logoutBtnRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="w-screen flex  justify-between h-18 z-50 sticky top-0 bg-black border-b-2 px-10 border-blue-500">
      {/* Logo */}
      <div className="Logo cursor-pointer flex items-center gap-2 " onClick={() => navigate("/")}> 
        <div className="Logoimage">
          <img src={Logo} alt="" type="image/svg+xml" className="rounded-full object-cover bg-white w-10 h-10" />
        </div>
        <div className="LogoName text-xl text-blue-400 font-extrabold font-serif">
          College Media
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center">
        <Search />
      </div>

      {/* Actions */}
      <div className="NavBarActions flex gap-18 font-bold items-center relative">
        <div
          className="cursor-pointer hover:bg-white/20 px-4 py-2 rounded transition-all duration-300 ease-in-out"
          onClick={() => navigate("/")}
        >
          Home
        </div>
        <div onClick={() => navigate("/about")}  className="cursor-pointer hover:bg-white/20 px-4 py-2 rounded transition-all duration-300 ease-in-out">About</div>
        
        {/* Logout button */}
        <div
          ref={logoutBtnRef}
          onClick={() => setShowLogout(!showLogout)}
          className="cursor-pointer hover:bg-white/20 px-4 py-2 rounded transition-all duration-300 ease-in-out text-blue-500 font-semibold relative"
        >
          Logout
        </div>

        {/* Logout Popover */}
        {showLogout && (
          <LogoutPopover
            onClose={() => setShowLogout(false)}
            buttonRef={logoutBtnRef}
          />
        )}
      </div>
    </div>
  );
}

export default NavBar;
