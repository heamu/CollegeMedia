import Chats from "../assets/Chat_1.svg"
import Profile from "../assets/Profile_1.svg"
import Bookmark from "../assets/WhiteBookmark.svg"
import Question from "../assets/Question.svg"
import Moderate from "../assets/Moderate.svg"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth";


function SideBar() {
     const { user } = useAuth();
    const navigate = useNavigate();
    function handleAskQuestion(){
        navigate('/ask')
    }
    function handleProfile(){
        navigate('/profile')
    }
    function handleSavedPosts(){
        navigate('/saved-posts')
    }

    function handleModerate(){
        navigate('/moderate')
    }
    function handleChats(){
        navigate('/chats')
    }
    return (
    <div className="h-screen text-gray-300 flex flex-col fixed left-0 w-[20vw] pl-8 pt-16 gap-12 bg-black border-r-2   border-blue-500   ">
            
            <div onClick={handleProfile} className="flex gap-4 cursor-pointer">
                <div className="svg">
                    <img src={Profile} alt="" className="w-8 h-8 cursor-pointer "/>
                </div>
                <div className="svgWork font-bold text-[22px]">Profile</div>
            </div>

            
            <div onClick={handleChats} className="flex gap-4 cursor-pointer">
                <div className="svg">
                    <img src={Chats} alt="" className="w-8 h-8 cursor-pointer " />
                </div>
                <div className="svgWork font-bold text-[22px]">Chats</div>
            </div>

            
            <div onClick={handleAskQuestion} className="flex gap-4 cursor-pointer">
                <div className="svg">
                    <img src={Question} alt="" className="w-8 h-8 cursor-pointer " />
                </div>
                <div className="svgWork font-bold text-[22px]">Ask</div>
            </div>

            
            <div onClick={handleSavedPosts} className="flex gap-4 cursor-pointer">
                <div className="svg">
                    <img src={Bookmark} alt="" className="w-8 h-8 cursor-pointer " />
                </div>
                <div className="svgWork font-bold text-[22px]">Saved</div>
            </div>


            {(user.isAdmin || user.isContentModerator) &&(<div onClick={handleModerate} className="flex gap-4 cursor-pointer">
                <div className="svg">
                    <img src={Moderate} alt="" className="w-8 h-8 cursor-pointer " />
                </div>
                <div className="svgWork font-bold text-[22px]">Moderate</div>
            </div>)}

    </div>
    )
}


export default SideBar
