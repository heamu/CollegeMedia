// function ProfileTags({TagName}) {
//     return (
//         <div className="bg-blue-500 px-2 text-center text-md py-1 rounded-lg w-20 ">
//             {TagName}
//         </div>
//     )
// }

// export default ProfileTags



// ProfileTags.jsx
function ProfileTags({ TagName }) {
  return (
    <div className="bg-[#2b3945] px-4 py-1 rounded-lg text-white text-sm font-medium border border-gray-600 hover:border-purple-400 cursor-pointer transition-all">
      {TagName}
    </div>
  );
}

export default ProfileTags;
